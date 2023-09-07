const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  email:{
    type:String,
    trim: true,
  },
  password:{
    type:String,
    trim: true,
  },
  userImage: {
    secure_url: { type: String },
    cloudinary_id: { type: String },
  },

  status :{
    type: Boolean
  },

  phone:{
    type:Number,
    trim: true,
  },
  addresses: [
    {
      name :String,
      country: String,
      streetAddress: String,
      city: String,
      state: String,
      pincode: String,
    },
  ],
  // cart:  [
  //     {
  //       productId: String,
  //       quantity: Number,
  //       price: Number,
  //       subtotal: Number,
  //     },
  //   ],

},{
    collection : 'users',
  });

  module.exports = mongoose.model("users", userSchema);
