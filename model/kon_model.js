var mongoose      = require('mongoose');
var ocena         = require('./ocena_model');

var konieSchema = mongoose.model('konies',new mongoose.Schema({
  _id           : String,
  nazwa         : String,
  identyfikator : String,
  oceny         :[{type:String,ref:'ocena'}]
}));

module.exports = konieSchema;
