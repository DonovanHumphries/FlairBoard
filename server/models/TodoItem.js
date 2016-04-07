var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: { type: String, default: uuid.v1 },
    label: String,
    boardId: String,
    priority:Number,
    isDone:Boolean,
    status:String,
    todoListId:String
});

module.exports = mongoose.model('TodoItem',schema);