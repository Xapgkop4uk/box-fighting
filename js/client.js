/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClickDown = function(x,y){
  Client.socket.emit('down',{x:x,y:y});
};

Client.sendClickUp = function(){
    Client.socket.emit('up');
  };

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('accelerate',function(data){
        Game.acceleratePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('stop',function(data){
        Game.stopPlayer(data.id);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});


