const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: String,
  discountAmount: Number,
  minPurchase: Number,
  expiryDate: Date
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;