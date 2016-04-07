var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: { type: String, default: uuid.v1 },
    label: String,
    boardId: String,
    todoItems:[{ type: mongoose.Schema.Types.ObjectId, ref: 'TodoItem' }]
    //TODO add relationship to TodoItems
});

module.exports = mongoose.model('TodoList',schema);