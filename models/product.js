var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProductSchema = new Schema({
    category_name: { type: String },
    name: { type: String },
    Image: { type: String },
    quantity: { type: String },
    _id: { type: Object },

});

module.exports = mongoose.model('products', ProductSchema)