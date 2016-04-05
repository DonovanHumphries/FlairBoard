var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var boardSchema = new Schema({
    id: String,
    label: String,
    layoutJson: String,
    owner: String
});

module.exports = mongoose.model('Board',boardSchema);