var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var app        = express();
var http       = require('http').Server(app);
var async      = require('async');
var io         = require('socket.io')(http);
var _          = require('Underscore');
var less       = require('less-middleware');
var ocena      = require('./model/ocena_model');
var konie      = require('./model/kon_model');

mongoose.connect('mongodb://localhost/tin_projekt', function(error) {
  if(error) {
    console.log('Błąd połączenia z baza danych:' + error);
  } else {
    console.log('Polaczono z baza danych.');
  }
});

app.use(less(__dirname + '/public'));
app.use('/admin',express.static(__dirname + '/public/admin.html'));
app.use('/sedziowie',express.static(__dirname + '/public/sedziowie.html'));
app.use(express.static(__dirname + '/public'));
app.use('/lib',express.static('./bower_components/jquery/dist'));


var czatujacy  = [];
var sedzia     = [];
var wylosowani = [];
var aktualnykon;
var zmienna = -1;
var zliczone = [];
var obiekt;

var imionasedziow = [];

obiekt_sedziego ={
  imie:"Janek",
  haslo:"jan"
};
obiekt_sedziego2 ={
  imie:"Grzegorz",
  haslo:"grz"
};
obiekt_sedziego3 ={
  imie:"Maciej",
  haslo:"mac"
};

imionasedziow.push(obiekt_sedziego);
imionasedziow.push(obiekt_sedziego2);
imionasedziow.push(obiekt_sedziego3);

io.sockets.on('connection',function(socket){

  var test = function(){
    konie.find({},function(err,result){
      if(err){
        console.log(err);
      }else{
        if(result===null){
        } else {
          zliczone.splice(0,zliczone.length);
          for(i=0;i<result.length;i++){
            zlicz_pkt_konia(result[i].nazwa);
          }
        }
      }
    });
  };

  var zlicz_pkt_konia = function(nazwaKon){
      ocena.find({kon:nazwaKon},function(err,result){
       var zt=0;
       var zg=0;
       var zk=0;
       var zn=0;
       var zr=0;
       for(j=0;j<result.length;j++){
         zt+= result[j].t;
         zg+= result[j].g;
         zk+= result[j].k;
         zn+= result[j].n;
         zr+= result[j].r;
       }
       zt=zt/result.length;
       zg=zg/result.length;
       zk=zk/result.length;
       zn=zn/result.length;
       zr=zr/result.length;
        obiekt = {
            zta:zt,
            zga:zg,
            zka:zk,
            zna:zn,
            zra:zr,
            nazwaKonia:nazwaKon
        };
        zliczone.push(obiekt);
     });
  };

  var aktualnykonik = function(){
    konie.find({},function(err,result){
      if(err){
        console.log(err);
      } else {
        zmienna++;
        aktualnykon = result[zmienna].nazwa;
        console.log("aktualnykon"+aktualnykon+" zmienna:"+zmienna);
      }
    });
  };

    socket.on('conect',function(){
      test();
      io.emit('wyswietl',zliczone,zmienna);
    });

  socket.on('czatujacy',function(wprowadzony_nick,callback){
    if(czatujacy.indexOf(wprowadzony_nick) != -1){
      callback(false);
    } else {
      callback(true);
      socket.czatujacy = wprowadzony_nick;
      czatujacy.push(socket.czatujacy);
    }
  });

  socket.on('losuj_sedziow',function(callback){
    if(sedzia.length>2){
      aktualnykonik();
      callback(true);
      console.log(zmienna);
      wylosowani = _.sample(sedzia,2);
      for(i=0;i<sedzia.length;i++){
        socket.broadcast.to(sedzia[i].idi).emit('clear');
      }
      for(i=0;i<wylosowani.length;i++){
        socket.broadcast.to(wylosowani[i].idi).emit('rozpocznij_zawody');
      }
    }else{
      callback(false);
    }
  });

  socket.on('dodaj_noty',function(t,g,k,n,r,callback){

    if(t,g,k,n,r === ""){
      callback(false);
    }
    else if(t>20||g>20||k>20||n>20||r>20||t<0||g<0||k<0||n<0||r<0){
      callback(false);
    } else {
      callback(true);
        var ocenka = new ocena();
        ocenka._id = mongoose.Types.ObjectId();
        ocenka.sedzia = socket.id;
        ocenka.t = t;
        ocenka.g = g;
        ocenka.k = k;
        ocenka.n = n;
        ocenka.r = r;
        ocenka.kon = aktualnykon;
        ocenka.save(function(err){
          if(err){
              console.log(err);
          }else{
            konie.findOne({
              nazwa:aktualnykon
            },function(err,konie){
              if(err){
                console.log(err);
              }else{
                konie.oceny.push(ocenka);
                konie.save();

              }
            });
          }
        });
    }
  });

  socket.on('edytuj_note',function(t,g,k,n,r,callback){
    callback(true);
    ocena.findOneAndUpdate({
      sedzia : socket.id,
      kon : aktualnykon
    },{
      t:t,
      g:g,
      k:k,
      n:n,
      r:r
    },function(err){
      if(err){
        console.log(err);
      } else{

      }
    });
  });

  socket.on('chat_data',function(data){
    io.sockets.emit('nick',data);
  });


  socket.on('check_password',function(dane,callback){
    for(i=0;i<imionasedziow.length;i++){
        if(dane === imionasedziow[i].haslo){
          var obiekt = {
            idi   : socket.id,
            sedzia : imionasedziow[i].imie
          };


            callback(true);
            sedzia.push(obiekt);
            io.sockets.emit('sedziowie',sedzia);
          
        }
      }
      callback(false);
    });

  socket.on('disconnect', function () {
    for(i=0;i<sedzia.length;i++){
      if(sedzia[i].idi === socket.id){
        sedzia.splice(sedzia[i],1);
        io.sockets.emit('sedziowie',sedzia);
      } else {
      }
    }
  });


  socket.on('error',function(err){
    console.log(err);
  });

});

http.listen(8888,function(){
  console.log('listening on :8888');
});
