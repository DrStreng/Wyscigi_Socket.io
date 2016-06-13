$(function(){
var socket;
var sedziowie           = $('#sedziowie');
var tajne_haslo_input   = $('#tajne_haslo_input');
var tajne_haslo_submit  = $('#tajne_haslo_submit');
var wprowadz_haslo      = $("#wprowadz_haslo");
var poczekalnia_sedziow = $("#poczekalnia_sedziow");
var content = $('#content');

tajne_haslo_submit.click(function(){

  if(!socket || !socket.connected){
    socket = io({forceNew:true});
  }

    socket.emit('check_password',tajne_haslo_input.val(),function(data){
      if(data){
        wprowadz_haslo.remove();
        poczekalnia_sedziow.show();
      } else {
        tajne_haslo_input.css({"border":"solid 1px red"});
      }
    });

    socket.on('clear',function(data){
      console.log("usunalem");
      $('.form_zawody').remove();
    });

    socket.on('aktualnyk',function(data){
      console.log(data);
    });

    socket.on('rozpocznij_zawody',function(data){
        var form ='<form action="#" class="form_zawody"><table class="table_dodaj_noty">'+
        '<tr><td class="kategoria">t:</td><td><input type="number" id="t"  step=1 min=0 max=20 required></input></td></tr>'+
        '<tr><td class="kategoria">g:</td><td><input type="number" id="g"  step=1 min=0 max=20 required></input></td></tr>'+
        '<tr><td class="kategoria">k:</td><td><input type="number" id="k"  step=1 min=0 max=20 required></input></td></tr>'+
        '<tr><td class="kategoria">n:</td><td><input type="number" id="n"  step=1 min=0 max=20 required></input></td></tr>'+
        '<tr><td class="kategoria">r:</td><td><input type="number" id="r"  step=1 min=0 max=20 required></input></td></tr>'+
        '<tr><td></td><td id="dodaj_noty_td"><input type="submit" id="dodaj_noty" value="Oceń"></input>'+
        '<input type="submit" id="edytuj_noty" value="Edytuj"></input></td><td id="komunikat"><div id="tresc1">pozytywnie dodano</div><div id="tresc2">pozytywnie edytowano</div></td></tr></table></form>';
        content.append(form);
        $('#edytuj_noty').hide();
        $('#tresc1').hide();
        $('#tresc2').hide();
        $('#dodaj_noty').click(function(){
          socket.emit('dodaj_noty',$('#t').val(),$('#g').val(),$('#k').val(),$('#n').val(),$('#r').val(),function(data){
            if(data){
              $('#dodaj_noty').hide();
              $('#edytuj_noty').show();
              $('#tresc1').show().fadeOut(5000);
              socket.emit("conect");
            } else {

            }
          });
          $('#edytuj_noty').click(function(){
            console.log("kliknieto edytuj");
            socket.emit('edytuj_note',$('#t').val(),$('#g').val(),$('#k').val(),$('#n').val(),$('#r').val(),function(data){
              if(data){
                  $('#tresc2').show().fadeOut(5000);
                  socket.emit("conect");
              }
            });
          });
        });
    });

    socket.on('sedziowie',function(sedzia){
      var pom = '';
      for(i = 0; i < sedzia.length; i++){
        pom += '<li>'+ sedzia[i].sedzia +'</li>' ;
      }
      sedziowie.html(pom);
    });
    socket.on('oczekiwanie',function(){
      var pom='zostales wybrany';
      content.html(pom);
    });

  });

});
