const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      size: {
        type: Number,
        required: true
      }
    }
  ],
  shippingAddress: {
    name: { type: String, required: true },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  shippingCharge: { type: Number, required: true },
  subtotals: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus : { type: Boolean },
  createdOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Cancelled', 'Delivered', 'Placed' ], default: 'Pending' },
  deliveredOn: { type: Date },
  razorpayOrderId:{type: String}
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
