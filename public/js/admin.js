$(function(){
 var losuj_sedziow = $('#losuj_sedziow');
 var kolejny_kon   = $('#kolejny_kon');
 var socket;

  if(!socket || !socket.connected){
    socket = io({forceNew:true});
  }

losuj_sedziow.click(function(){
  console.log("losuj_sedziow");

  socket.emit('losuj_sedziow',function(data){
    if(data){
          losuj_sedziow.prop('disabled',true);
    }else{
    }
  });
});

kolejny_kon.click(function(){
  console.log("kliknieto");
  socket.emit('losuj_sedziow',function(){

  });
});





});
