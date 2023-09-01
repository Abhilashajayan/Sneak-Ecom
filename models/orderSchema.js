const mongoose = require('mongoose');
const Product = require('./productSchema');

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
  createdOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Cancelled', 'Delivered' ], default: 'Pending' },
  deliveredOn: { type: Date },
  razorpayOrderId:{type: String}
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

});
orderSchema.pre('save', async function (next) {
  console.log('Middleware triggered');
  const itemsToUpdate = this.items;
  const promises = itemsToUpdate.map(async item => {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
      console.log(`Updated product ${product._id}, new quantity: ${product.stock}`);
    } else {
      console.log('Insufficient items');
    }
  });
  await Promise.all(promises);
  console.log('Middleware completed');
  next();
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
