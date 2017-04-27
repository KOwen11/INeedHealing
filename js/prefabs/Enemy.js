var Gengu = Gengu || {};

Gengu.Enemy = function(game, x, y, key, velocity, tilemap) {
    Phaser.Sprite.call(this, game, x, y, key);
    this.game = game;
    this.tilemap = tilemap;
    this.anchor.setTo(0.5);
    this.speedReset = velocity;
    
    if(velocity === undefined){
        velocity = (40 + Math.random() * 20) * (Math.random() < 0.5 ? 1: -1);
    }
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1,0);
    this.body.velocity.x = velocity;
    this.body.friction = 1;
    this.body.setSize(25,20,0,0);
};
Gengu.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Gengu.Enemy.prototype.constructor = Gengu.Enemy;

Gengu.Enemy.prototype.update = function(){
    var direction;
    if(this.body.velocity.x > 0){
        this.scale.setTo(-1,1);
        direction = 1;
    }else{
        this.scale.setTo(1,1);
        direction = -1;
    }
    
    var nextX = this.x + direction * (Math.abs(this.width)/2 + 1);
    var nextY = this.bottom + 1;
    
    var nextTile = this.tilemap.getTileWorldXY(nextX, nextY, this.tilemap.tileWidth, this.tilemap.tileHeight, 'collisionLayer');
    
    if(!nextTile && this.body.blocked.down){
        this.body.velocity.x *= -1;
    }else if(this.body.velocity.x == 0){
        this.body.velocity.x = this.speedReset * -1;
    }
};
Gengu.Enemy.prototype.killCheck = function(player){

    if((this.body.touching.left ||this.body.touching.right) && (player.body.touching.left ||player.body.touching.right)){
      Gengu.GameState.gameOver();
    }else if(this.body.blocked.up || this.body.touching.up){
      this.kill();
    }
 
};