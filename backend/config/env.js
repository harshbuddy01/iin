import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from root directory (parent of backend)
// Note: path inside config folder is backend/config/
// So root is ../../
dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('🔵 Environment variables loaded via config/env.js');
