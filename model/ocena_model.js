var mongoose      = require('mongoose');
var konieSchema   = require('./ocena_model');

var ocena = mongoose.model('ocenas',new mongoose.Schema({
  _id    : String,
  sedzia : String,
  t      : Number,
  g      : Number,
  k      : Number,
  n      : Number,
  r      : Number,
  kon    : String,
}));

module.exports = ocena;
