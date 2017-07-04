var obj = require('./LinkedList');
var obj2 = require('./chat');
var obj3 = require('./queue');

//////////////////////////////////////////////////////////
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(4040);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var girls = obj3.Queue();
var boys = obj3.Queue();

var chats = obj.LinkedList();

var startChat = function(girl, boy){
  var chat = obj2.Chat();

  girl.on("message",function(message){
    message = {message: message, sender: 'she'};
    console.log("girl send: ", message);
    chat.sendMessage(message);  
  });

  boy.on("message",function(message){
    message = {message: message, sender: 'he'};
    console.log("boy send: ", message);
    chat.sendMessage(message);  
  });

  chat.join(girl);
  chat.join(boy);
  
  var chatnode = chats.addTail(chat);
  io.of('/info').emit('chats',{count: chats.count});
  
  chat.onClosed= function(){
    chats.remove(chatnode);
    io.of('/info').emit('chats',{count: chats.count});
  };
};

io.of('/info')
  .on('connect',
  function(socket){
    socket.emit('girls', {count: girls.count});
    socket.emit('boys', {count: boys.count});
    socket.emit('chats', {count: chats.count});
  });

io.of('/girls')
  .on('connect',
  function(socket){
    console.log('girl connected');
    var girl = socket;
    var boy = boys.dequeue();
    io.of('/info').emit('boys', {count: boys.count});
    if(!boy){
      var girlNode = girls.enqueue(girl);
      girl.on('disconnect',function(){
        if(girls.remove(girlNode)){
          console.log('girl removed from queue');
          io.of('/info').emit('girls', {count: girls.count});
        };
      });
      io.of('/info').emit('girls', {count: girls.count});
    }else{
      startChat(girl, boy);
    }
  });

io.of('/boys')
  .on('connection', 
  function(socket){
    console.log('boy connected');
    var boy = socket;
    var girl = girls.dequeue();
    io.of('/info').emit('girls', {count: girls.count});
    if(!girl){
      var boyNode = boys.enqueue(boy);
      boy.on('disconnect',function(){
        if(boys.remove(boyNode)){
          console.log('boy removed from queue');
          io.of('/info').emit('boys', {count: boys.count});
        };
      });
      io.of('/info').emit('boys', {count: boys.count});
    }else{      
      startChat(girl, boy);
    }
  });