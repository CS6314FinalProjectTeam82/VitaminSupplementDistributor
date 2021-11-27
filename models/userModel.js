const mongoose = require('mongoose');

  const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    is_admin: Boolean,
    mobile_number: String
  })

  module.exports = mongoose.model('user', UserSchema)