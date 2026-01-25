import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n' + '='.repeat(80));
console.log('🔵 ENVIRONMENT CONFIGURATION STARTUP');
console.log('='.repeat(80));

// 🔴 CRITICAL: Check Node environment FIRST
console.log(`\n♾️  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`🔍 Total environment variables available: ${Object.keys(process.env).length}`);

// 🔧 HOSTINGER FIX: In production, environment variables should already be in process.env
// Only try to load .env file if in development (local machine)
if (process.env.NODE_ENV !== 'production') {
  console.log('\n🚧 Development mode detected - attempting to load .env file...');
  try {
    const result = dotenv.config({ path: path.join(__dirname, '../../.env') });
    if (result.error) {
      console.log('⚠️  No .env file found (this is OK in production)');
    } else {
      console.log('✅ Loaded .env file for local development');
    }
  } catch (err) {
    console.log('ℹ️  .env file not accessible:', err.message);
  }
} else {
  console.log('\n🎧 PRODUCTION MODE - Using Hostinger environment variables');
  console.log('✨ Variables should be injected by Hostinger into process.env');
}

// 🔴 CRITICAL: Verify what Hostinger actually sent us
const requiredVars = {
  'MONGODB_URI': 'Database connection string',
  'RAZORPAY_API_KEY': 'Payment API key',
  'RAZORPAY_API_SECRET': 'Payment API secret',
  'NODE_ENV': 'Application environment',
  'EMAIL_USER': 'Email username',
  'EMAIL_PASSWORD': 'Email password',
  'EMAIL_HOST': 'Email host',
  'EMAIL_PORT': 'Email port',
  'API_URL': 'Backend API URL',
  'FRONTEND_URL': 'Frontend URL',
  'JWT_SECRET': 'JWT secret'
};

console.log('\n' + '='.repeat(80));
console.log('💫 DETAILED ENVIRONMENT VARIABLE CHECK');
console.log('='.repeat(80));

const missingVars = [];
const loadedVars = [];

Object.entries(requiredVars).forEach(([varName, description]) => {
  const value = process.env[varName];
  const exists = !!value;
  
  if (exists) {
    loadedVars.push(varName);
    const displayValue = value.length > 20 
      ? value.substring(0, 20) + '... [' + value.length + ' chars]'
      : value;
    console.log(`✅ ${varName.padEnd(25)} | ${description.padEnd(30)} | ‘${displayValue}’`);
  } else {
    missingVars.push(varName);
    console.log(`❌ ${varName.padEnd(25)} | ${description.padEnd(30)} | NOT SET`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('📋 SUMMARY');
console.log('='.repeat(80));
console.log(`✅ Loaded: ${loadedVars.length}/${Object.keys(requiredVars).length} variables`);

if (missingVars.length > 0) {
  console.error(`\n⚠️  MISSING CRITICAL VARIABLES: ${missingVars.join(', ')}`);
  console.error('\n😨 FIX INSTRUCTIONS:');
  console.error('  1. Go to: https://hpanel.hostinger.com');
  console.error('  2. Click Websites > backend-vigyanpreap');
  console.error('  3. Click Deployments > Settings');
  console.error('  4. Add each missing variable');
  console.error('  5. Click "Save and Redeploy"');
  console.error('  6. Wait 3-5 minutes for deployment');
  console.error('\n🗑️  App will run with LIMITED FUNCTIONALITY without these variables.\n');
} else {
  console.log('\n✅ ALL REQUIRED ENVIRONMENT VARIABLES ARE SET!');
  console.log(`🌟 Source: ${process.env.NODE_ENV === 'production' ? 'Hostinger Environment' : 'Local .env file'}`);
  console.log(`🚀 Application ready to start\n`);
}

console.log('='.repeat(80));
console.log('');

export default {};