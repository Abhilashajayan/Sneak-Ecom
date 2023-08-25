const mongoose = require("mongoose");
const { User } = require("../models/userSchema");
const { Product } = require("../models/productSchema")

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    cartItems: [
      {
        product: {  
          type: mongoose.Schema.Types.ObjectId,
          ref:"Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    // coupon: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: COUPON,
    //   default : "63d25c73a171f7d607159252"
    // },
    // isCouponApplied: {
    //   type: Boolean,
    //   default : false,
    // },
   
  },
  {
    timestamps: true,
  },
  {
    collection : 'Cart'
  }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;