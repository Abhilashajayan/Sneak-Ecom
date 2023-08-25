require('dotenv').config();
const mongoose = require('mongoose');
async function connectToMongoDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Connected successfully to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
    }
  }
  module.exports = connectToMongoDB;

