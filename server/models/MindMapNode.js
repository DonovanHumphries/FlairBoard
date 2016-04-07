var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: { type: String, default: uuid.v1 },
    label: String,
    parentId: String,
    mindMapId:String,
    top:Number,
    left:Number
    //TODO add relationship to represent self join hierarchy
});

module.exports = mongoose.model('MindMapNode',schema);