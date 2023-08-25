const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    username: {
      type: String,
      trim: true,
    },
    password:{
      type:String,
      trim: true,
    } },{
      collection:"admin",
    });
  
    module.exports = mongoose.model("admin", adminSchema);