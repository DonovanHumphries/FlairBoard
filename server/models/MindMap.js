var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: { type: String, default: uuid.v1 },
    label: String,
    boardId: String,
    //childNodes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'MindMapNode' }]
    //TODO add relationship to MindMapNodes
});

module.exports = mongoose.model('MindMap',schema);