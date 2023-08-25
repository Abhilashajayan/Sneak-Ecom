const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  userEmail: {
    type: String,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  expiresAt: {
    type: Date,
  }
}, { collection: "otp" });

module.exports = mongoose.model("userOtp", otpSchema);
