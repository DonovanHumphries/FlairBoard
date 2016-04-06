var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    label: String,
    layoutJson: String,
    owner: String,
    widgets:[{x:Number,y:Number,width:Number,height:Number,_id:String,directive:String}]
});

module.exports = mongoose.model('Board',boardSchema);