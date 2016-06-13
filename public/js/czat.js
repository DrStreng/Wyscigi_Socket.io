$(function(){

  var chat_user_header_name        = $('#chat_user_header_name');
  var chat_user_header_name_submit = $('#chat_user_header_name_submit');
  var chat_send_data               = $('#chat_send_data');
  var chat_send_data_submit        = $('#chat_send_data_submit');
  var socket;
  var chat_user_header_name_error  = $('#chat_user_header_name_error');
  var chat_data                    = $('#chat_data');
  var wyniki                       = $('.wyniki');

  chat_send_data_submit.prop('disabled',true);

  if(!socket || !socket.connected){
    socket = io({forceNew:true});
  }

  socket.emit("conect");


  chat_user_header_name_submit.click(function(){
    if(chat_user_header_name.val() !== ''){
      socket.emit('czatujacy',chat_user_header_name.val(),function(data){
        if(data){
          chat_send_data_submit.prop('disabled',false);
          chat_user_header_name_error.html('');
          chat_user_header_name_submit.prop('disabled',true);
          chat_user_header_name.prop('disabled',true);
          socket.emit('chat_data', chat_user_header_name.val() +': Polaczyl sie do kanalu.');
        } else {
          chat_user_header_name_error.html('nick juz zajety');
        }
      });
    } else {
      chat_user_header_name_error.html('wpisz usera');
    }
  });

  socket.on('wyswietl',function(data,zmienna){
    console.log(zmienna);
    $('.tabelka').remove();
    wyniki.append('<table class="tabelka"><tr><td>Nazwa</td><td>t</td><td>g</td><td>k</td><td>n</td><td>r</td></table>');
    for(i=0;i<zmienna+1;i++){
      $('.tabelka').append('<tr><td>'+data[i].nazwaKonia+'</td><td>'+data[i].zta+'</td><td>'+data[i].zga+'</td><td>'+data[i].zka+'</td><td>'+data[i].zna+'</td><td>'+data[i].zra+'</td></tr>');
    }
  });


  socket.on('nick',function(data){
    chat_data.append('<p>'+ data +'</p>');
  });

  chat_send_data_submit.click(function(){
    socket.emit('chat_data',chat_user_header_name.val() +': '+ chat_send_data.val());
    chat_send_data.val('');
  });
  socket.on('disconnect',function(){

  });
});
