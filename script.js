
var mongoose = require('mongoose');
var async = require('async');
var konie    = require('./model/kon_model');

mongoose.connect('mongodb://localhost/tin_projekt');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var kon1 = new konie( {_id: mongoose.Types.ObjectId(),nazwa: 'Kon1', identyfikator: '10001'});
var kon2 = new konie( {_id: mongoose.Types.ObjectId(),nazwa: 'Kon2', identyfikator: '10010'});
var kon3 = new konie( {_id: mongoose.Types.ObjectId(),nazwa: 'Kon3', identyfikator: '10011'});
var kon4 = new konie( {_id: mongoose.Types.ObjectId(),nazwa: 'Kon4', identyfikator: '10100'});
var kon5 = new konie( {_id: mongoose.Types.ObjectId(),nazwa: 'Kon5', identyfikator: '10101'});

var dodajkonia = function(kon){
  return function (konSaveDone){
    konie.findOne({nazwa: kon.nazwa},function(error,result){
      if(error){
        console.log(error);
      }else{
        if(result === null){
          kon.save(function(err){
            if(err){
              console.log(err);
            }
            konSaveDone(err);
          });
        }else{
          console.log("juz istnieje");
        }
      }
    });
  };
};

var connection = function (openDone) {
  db.once('open', function () {
      openDone();
  });
};

var insert = function(insert){
  async.parallel([
    dodajkonia(kon1),
    dodajkonia(kon2),
    dodajkonia(kon3),
    dodajkonia(kon4),
    dodajkonia(kon5),
  ],function (err) {
      if (err) {
        console.log(err);
      }
      console.log("dodalo all konie");
      process.exit(0);
    });
};

async.series([connection,insert]);
