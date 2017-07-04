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
      return;
    }
    ll.count++;
    node.prev = ll.head.prev;
    node.next = ll.head;
    ll.head.prev.next = node;
    ll.head.prev = node;
    ll.head = node;
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
      return;
    }
    ll.count++;
    node.next = ll.head;
    node.prev = ll.head.prev;
    ll.head.prev.next = node;
    ll.head.prev = node;
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
}

function Queue(){
  var q = this;
  q.ll = new LinkedList();
  q.count = 0;
  q.enqueue = function(value){
    q.ll.addTail(value);
    q.count = q.ll.count;
  };

  q.dequeue = function(){
    var value = q.ll.getHead();
    q.count = q.ll.count;
    return value;
  };
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
var chats = [];

var startChat = function(girl, boy){
  girl.on("message",function(message){
    console.log("girl send: ", message);
    boy.emit("message",message);
  });
  boy.on("message",function(message){
    console.log("boy send: ", message);
    girl.emit("message",message);
  });

  girl.on("disconnect",function(){
    boy.disconnect();
    console.log("chat closed");
  });
  boy.on("disconnect",function(){
    girl.disconnect();
    console.log("chat closed");
  });

  girl.emit("chatCreated");
  boy.emit("chatCreated");
  console.log("chat created");
};

io.of('/girls')
  .on('connect',
  function(socket){
    console.log('girl connected');
    var girl = socket;
    var boy = boys.dequeue();
    if(!boy){
      girls.enqueue(girl);
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
    if(!girl){
      boys.enqueue(boy);
    }else{      
      startChat(girl, boy);
    }
  });
