const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productImages: [
    {
      secure_url: { type: String },
      cloudinary_id: { type: String }
    }
  ],
  productTitle: { type: String, required: true },
  productPrice: { type: Number, required: true },
  discount: { type: Number },
  stock: { type: Number, required: true },
  productCategory: { type: String , required: true},
  isListed: { type: Boolean, default: true },
  sizes: {
    type: [Number],
    required: true,
  },
},{collection : 'products'});

module.exports = mongoose.model('Product', productSchema);