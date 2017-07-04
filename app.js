function LinkedList(){
  function Node(value){
    this.next = null;
    this.prev = null;
    this.value = value;
  }

  var ll = this;
  ll.head = null;
  ll.count = 0;
  
  ll.addHead = function(value){
    var node = new Node(value);
    if(ll.count == 0){
      ll.count++;
      ll.head = node;
      ll.head.next = node;
      ll.head.prev = node;
      return node;
    }
    ll.count++;
    node.prev = ll.head.prev;
    node.next = ll.head;
    ll.head.prev.next = node;
    ll.head.prev = node;
    ll.head = node;
    return node;
  };

  ll.getHead = function(){
    if(ll.count==0)
      return null;
    ll.count--;
    var node = ll.head;
    ll.head.prev.next == ll.head.next;
    ll.head.next.prev == ll.head.prev;
    ll.head = ll.head.next;
    return node.value;
  };

  ll.addTail = function(value){
    var node = new Node(value);
    if(ll.count == 0){
      ll.count++;
      ll.head = node;
      ll.head.next = node;
      ll.head.prev = node;
      return node;
    }
    ll.count++;
    node.next = ll.head;
    node.prev = ll.head.prev;
    ll.head.prev.next = node;
    ll.head.prev = node;
    return node;
  };

   ll.getTail = function(){
    if(ll.count==0)
      return null;
    ll.count--;
    var node = ll.head.prev;
    ll.head.prev = ll.head.prev.prev;
    ll.head.prev.next = ll.head;
    return node.value;
  };

  ll.removeNode = function(node){
    if(ll.count==0){
      return false;
    }
    var current = ll.head;
    do{
      if(current === node){
          current.next.prev = current.prev;
          current.prev.next = current.next;
          ll.count--;
          if(current === ll.head){
            ll.head = current.next;
          }
        return true;
      }
      current = current.next;
    }while(current!== ll.head);
    return false;
  }
}

function Queue(){
  var q = this;
  q.ll = new LinkedList();
  q.count = 0;
  q.enqueue = function(value){
    var node = q.ll.addTail(value);
    q.count = q.ll.count;
    return node;
  };

  q.dequeue = function(){
    var value = q.ll.getHead();
    q.count = q.ll.count;
    return value;
  };

  q.remove = function(node){
    var result = q.ll.removeNode(node);
    q.count = q.ll.count;
    return result;
  }
}
//////////////////////////////////////////////////////////
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(4040);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var girls = new Queue();
var boys = new Queue();
var chats = new LinkedList();

var startChat = function(girl, boy){
  var chat = {girl:girl, boy:boy, messages:[]};
  girl.on("message",function(message){
    message = {message: message, sender: 'she'};
    chat.messages.push();
    console.log("girl send: ", message);
    girl.emit("message",message);
    boy.emit("message",message);
  });
  boy.on("message",function(message){
    message = {message: message, sender: 'he'};
    chat.messages.push(message);
    console.log("boy send: ", message);
    boy.emit("message",message);
    girl.emit("message",message);
  });

  girl.on("disconnect",function(){
    boy.disconnect();
    if(chats.removeNode(chatnode)){
      console.log("chat closed");      
      io.of('/info').emit('chats',{count: chats.count});
    }});
  boy.on("disconnect",function(){
    girl.disconnect();
    if(chats.removeNode(chatnode)){
      console.log("chat closed");      
      io.of('/info').emit('chats',{count: chats.count});
    } 
  });

  var chatnode = chats.addTail(chat);
  io.of('/info').emit('chats',{count: chats.count});

  girl.emit("chatCreated");
  boy.emit("chatCreated");
  console.log("chat created");
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
