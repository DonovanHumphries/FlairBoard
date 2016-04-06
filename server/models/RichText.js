var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var richTextSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    label: String,
    text: String,
    BoardId: String,
});

module.exports = mongoose.model('RichText',richTextSchema);