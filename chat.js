var LinkedList = require('./LinkedList').LinkedList;

function Chat(){
    var chat = this;
    chat.users = LinkedList();
    chat.listeners = LinkedList();
    chat.messages = [];
    
    chat.broadcast = function(items, event, data){
        items.foreach(function(node){
            var socket = node.value;
            socket.emit(event, data);
        });
    };

    chat.sendMessage = function(message){
        chat.broadcast(chat.users,'message',message);
        chat.broadcast(chat.listeners, 'message',message);
    };
    
    chat.onMessageReceived = function(message){
        chat.messages.push(message);
        chat.sendMessage(message);
    };

    chat.onClosed = null;

    chat.leave = function(userNode){
        console.log('chat destructed');
        if(chat.users.remove(userNode)){
            chat.users.foreach(function(node){
                if(chat.users.remove(node)){
                    node.value.disconnect();
                }
            });
            chat.listeners.foreach(function(node){
                if(chat.listeners.remove(node)){
                    nodel.value.disconnect();
                }
            });

            if(!!chat.onClosed){
                chat.onClosed();
            }
        };
    };

    chat.join = function(user){
        var node = chat.users.addTail(user);
        if(chat.users.count > 1)
            chat.broadcast(chat.users,'chatCreated', null);
        
        user.on('disconnect',function(){
            chat.leave(node);
        });
    };

    chat.subscribe = function(listener){
        console.log("listener attached");
        for(var m in chat.messages){
            listener.emit('message', m);
        }
        var node = chat.listeners.addTail(listener);
        listener.on('disconnect',function(){
            if(chat.listeners.remove(node)){
                console.log("listener removed");
            }
        });        
    };
}

exports.Chat = function(){return new Chat();};