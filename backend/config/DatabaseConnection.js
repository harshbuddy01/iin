/**
 * Database Connection Class
 * Created: Dec 29, 2025
 * Purpose: Centralized database connection management
 * 
 * BENEFITS:
 * - Single connection pool for entire application
 * - Automatic reconnection on failure
 * - Health checks for monitoring
 * - Easy migration from Railway to Hostinger
 * - Connection pooling for better performance
 */

import mysql from 'mysql2/promise';
import { env } from './Environment.js';

export class DatabaseConnection {
    constructor(config) {
        this.config = config;
        this.pool = null;
        this.isConnected = false;
    }
    
    /**
     * Create DatabaseConnection from environment variables
     * This is the recommended way to create the connection
     */
    static fromEnvironment() {
        return new DatabaseConnection(env.getDatabaseConfig());
    }
    
    /**
     * Get or create the connection pool
     */
    getPool() {
        if (!this.pool) {
            console.log('🔄 Creating new database connection pool...');
            this.pool = mysql.createPool(this.config);
            
            // Add error handler
            this.pool.on('connection', (connection) => {
                console.log('✅ New database connection established');
            });
            
            this.pool.on('error', (err) => {
                console.error('❌ Database pool error:', err);
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.log('🔄 Attempting to reconnect...');
                    this.pool = null; // Force recreation on next query
                }
            });
        }
        return this.pool;
    }
    
    /**
     * Test database connection
     * Returns true if connected, false otherwise
     */
    async testConnection() {
        try {
            console.log('🔍 Testing database connection...');
            const pool = this.getPool();
            const connection = await pool.getConnection();
            
            // Test query
            const [rows] = await connection.query('SELECT 1 as test');
            connection.release();
            
            this.isConnected = true;
            console.log('✅ Database connection successful!');
            console.log(`   Host: ${this.config.host}`);
            console.log(`   Database: ${this.config.database}`);
            console.log(`   User: ${this.config.user}`);
            
            return true;
        } catch (error) {
            this.isConnected = false;
            console.error('❌ Database connection failed:', error.message);
            console.error('   Please check:');
            console.error('   1. Database credentials in .env file');
            console.error('   2. Database server is running');
            console.error('   3. Network connectivity');
            return false;
        }
    }
    
    /**
     * Execute a query with automatic connection management
     */
    async query(sql, params = []) {
        const pool = this.getPool();
        try {
            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Query error:', error.message);
            console.error('   SQL:', sql.substring(0, 100));
            throw error;
        }
    }
    
    /**
     * Get a connection from the pool for transactions
     */
    async getConnection() {
        const pool = this.getPool();
        return await pool.getConnection();
    }
    
    /**
     * Execute multiple queries in a transaction
     */
    async transaction(callback) {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            console.error('❌ Transaction failed, rolled back:', error.message);
            throw error;
        } finally {
            connection.release();
        }
    }
    
    /**
     * Get connection pool statistics
     */
    getPoolStats() {
        if (!this.pool) {
            return {
                total: 0,
                active: 0,
                idle: 0
            };
        }
        
        return {
            total: this.pool.pool._allConnections.length,
            active: this.pool.pool._acquiringConnections.length,
            idle: this.pool.pool._freeConnections.length
        };
    }
    
    /**
     * Health check endpoint data
     */
    async getHealthCheck() {
        try {
            const startTime = Date.now();
            await this.testConnection();
            const responseTime = Date.now() - startTime;
            
            return {
                status: 'healthy',
                connected: this.isConnected,
                responseTime: `${responseTime}ms`,
                pool: this.getPoolStats(),
                config: {
                    host: this.config.host,
                    database: this.config.database,
                    port: this.config.port
                }
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                connected: false,
                error: error.message,
                pool: this.getPoolStats()
            };
        }
    }
    
    /**
     * Close all connections (call on server shutdown)
     */
    async close() {
        if (this.pool) {
            console.log('🔒 Closing database connections...');
            await this.pool.end();
            this.pool = null;
            this.isConnected = false;
            console.log('✅ Database connections closed');
        }
    }
}

// Singleton instance for the entire application
export const db = DatabaseConnection.fromEnvironment();

// Test connection on startup
db.testConnection().catch(error => {
    console.error('❌ Failed to connect to database on startup');
    if (!env.isDevelopment) {
        console.error('Exiting...');
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('\n🚦 SIGTERM received, closing database connections...');
    await db.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\n🚦 SIGINT received, closing database connections...');
    await db.close();
    process.exit(0);
});

export default db;
