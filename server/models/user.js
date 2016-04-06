var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    username: String,
    name: String,
    password: String,
    email: String
});

module.exports = mongoose.model('User',userSchema);