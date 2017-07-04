var LinkedList = require('./LinkedList').LinkedList;

function Queue(){
  var q = this;
  q.ll = LinkedList();
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
    var result = q.ll.remove(node);
    q.count = q.ll.count;
    return result;
  }
}

exports.Queue = function(){return new Queue();};