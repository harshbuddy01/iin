import Razorpay from 'razorpay';

console.log('🔵 Initializing Razorpay instance...');

const instance = process.env.RAZORPAY_API_KEY && process.env.RAZORPAY_API_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
    })
    : null;

if (instance) {
    console.log('✅ Razorpay initialized successfully (from config)');
} else {
    console.warn('⚠️ Razorpay not initialized - Missing API credentials');
}

export default instance;
