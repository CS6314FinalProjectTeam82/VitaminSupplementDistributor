var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProductSchema = new Schema({})

module.exports = mongoose.model('Product', ProductSchema)