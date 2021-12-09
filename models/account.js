var mongoose = require('mongoose'),
Schema = mongoose.Schema,
passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: { type: String },
    email : { type: String, require: true, index:true, unique:true,sparse:true},
    password: { type: String, require:true },
    firstName: { type: String},
    lastName: { type: String},
    is_admin: { type: Boolean},
    mobile_number: { type: String},
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
