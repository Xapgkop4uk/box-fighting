/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};

const dinos = ['doux', 'mort', 'tard', 'vita']

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet1.png',32,32);

    dinos.forEach((name) => {
        game.load.spritesheet(name, `assets/sprites/DinoSprites - ${name}.png`,24,24);
    })
};

Game.create = function(){
    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet1', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputDown.add(Game.accselerateTo, this);
    layer.events.onInputUp.add(Game.stopAccselerate, this);
    Client.askNewPlayer();
};

Game.accselerateTo = function(layer,pointer){
    Client.sendClickDown(pointer.worldX,pointer.worldY);
};

Game.stopAccselerate = function(){
    Client.sendClickUp();
}

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,dinos[Math.floor(Math.random() * dinos.length)]);
    Game.playerMap[id].animations.add('move', [...Array(10).keys()], 10, true);
    Game.playerMap[id].moveSpeed = 0;
    game.physics.arcade.enable(Game.playerMap[id]);
    Game.playerMap[id].body.collideWorldBounds = true;
};

Game.acceleratePlayer = function(id,x,y){
    const player = Game.playerMap[id];
    player.animations.play('move');
    clearInterval(player.stopTimer)
    player.target = {x:x, y:y};
    player.accelerateTimer = setInterval(() => {
        player.moveSpeed += 0.1;
        const angle = Phaser.Math.angleBetween(player.x, player.y, x, y)
        player.body.velocity.x = player.body.velocity.x + Math.cos(angle) * player.moveSpeed;
        player.body.velocity.y = player.body.velocity.y + Math.sin(angle) * player.moveSpeed;
    }, 10)
};

Game.stopPlayer = function(id){
    const player = Game.playerMap[id];
    clearInterval(player.accelerateTimer)

    player.stopTimer = setInterval(() => {
        if( player.moveSpeed <= 0) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.animations.stop();
            return;
        }
        player.animations.play('move');
        player.moveSpeed -= 0.1;
        const angle = Phaser.Math.angleBetween(player.x,player.y, player.target.x, player.target.y)
        const cos =  Math.cos(angle)
        const sin = Math.sin(angle)
        const vX = player.body.velocity.x
        const vY = player.body.velocity.y
        player.body.velocity.x = vX * cos > 0 ? vX - cos * player.moveSpeed : vX + cos * player.moveSpeed;
        player.body.velocity.y = vY * sin > 0 ? vY - sin * player.moveSpeed : vY + sin * player.moveSpeed;
    }, 10)
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

checkOverlap = (spriteA, spriteB) => {
    if(spriteA && spriteB){
            
        
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }
    else return false
}

Game.update = () => {
    const players = Object.values(Game.playerMap)
    if (!!players.length) {
        console.log(Game.playerMap)

        if (checkOverlap(players[0], players[1]))
        {
            console.log('Overlapping: true');
        }
    }

}
