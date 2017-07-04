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

  ll.remove = function(node){
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
  };

  ll.foreach = function(callback){
    if(ll.count == 0)
        return;
    var current = ll.head;
    do
    {
        callback(current);
        current = current.next;
    }
    while(current != ll.head)
  }
}

exports.LinkedList = function(){return new LinkedList();};