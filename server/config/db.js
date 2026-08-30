const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicfix', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.warn('⚠️  Make sure MongoDB is running locally (e.g. via mongod service) or provide a valid Atlas URI in server/.env');
    // Don't crash immediately so health checks and static endpoints can still respond
  }
};

module.exports = connectDB;
