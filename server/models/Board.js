var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;
var boardSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    label: String,
    layoutJson: String,
    owner: String
});

module.exports = mongoose.model('Board',boardSchema);