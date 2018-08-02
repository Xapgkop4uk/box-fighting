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
    layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,dinos[Math.floor(Math.random() * dinos.length)]);
    Game.playerMap[id].animations.add('move', [...Array(10).keys()], 10, true);
};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    player.animations.play('move');
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);

    tween.onComplete.add(() => player.animations.stop(), this);

    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

checkOverlap = (spriteA, spriteB) => {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

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
