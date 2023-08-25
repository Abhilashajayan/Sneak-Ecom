const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({

categoryName:{
    type:String,
}},{
    collection : "categories"
});

module.exports = mongoose.model("Category", categorySchema);