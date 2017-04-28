var Gengu = Gengu || {};

Gengu.GameState = {

  init: function(level) {    

    //constants
    this.RUNNING_SPEED = 250;
    this.JUMPING_SPEED = 700;
    this.ENEMY_SPEED = 100;
    this.maxJumpDistance = 500;
    this.currentLevel = level || 'level1';
    
    //gravity
    this.game.physics.arcade.gravity.y = 2000;    
    this.game.world.setBounds(0,0,2040,700);
    
    //cursor keys to move the player
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
    
    this.game.renderer.renderSession.roundPixels = true;
  },
  
  create: function() {
    //load current level
    this.loadLevel();
    
    //show on-screen touch controls
    //this.createOnscreenControls();    
  },   
  
  update: function() {   
    
    this.game.physics.arcade.collide(this.player, this.collisionLayer); 
    this.game.physics.arcade.collide(this.enemies, this.collisionLayer);
    this.game.physics.arcade.collide(this.player, this.enemies, this.killCheck);
    this.game.physics.arcade.overlap(this.player, this.goal, this.nextLevel, null, this);
    this.game.physics.arcade.collide(this.deadPlayer, this.collisionLayer);
    this.game.physics.arcade.collide(this.winner, this.collisionLayer);
  
    
    
    //horizontal movement
    if(this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(-0.4, 0.4);
      this.player.play('walking');
    }
    else if(this.cursors.right.isDown || this.player.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(0.4, 0.4);
      this.player.play('walking');
    }else {
      this.player.animations.stop();
      this.player.frame = 4;
    }

    
    /*
    if(!this.player.body.touching.down || !this.player.body.blocked.down){
      this.player.setFrame(3);
    }
    */
    //jump
    if((this.spaceBar.isDown || this.player.mustJump) && (this.player.body.blocked.down || this.player.body.touching.down)) {
      this.playerJump();
      this.player.animations.stop();
      this.player.frame = 3;
      this.player.body.drag.x = 1200;
    }
    if(this.spaceBar.isDown && this.gameOverText){
      this.gameOverText.destroy();
      this.restartText.destroy();
      this.restartText = null;
      this.gameOverText = null;
      this.state.start('Home');
    }
    
    if(this.spaceBar.isDown && this.victoryText){
      this.victoryText.destroy();
      this.victoryText = null;
      this.state.start('Home');
    }
    
    if(this.player.body.blocked.down || this.player.body.touching.down) {
      this.player.body.drag.x = 1200;
    }else{
      this.player.body.drag.x = 900;
    }
    
    //non-suicidal slime movement
    //this.ledgeCheck(this.slime.body.x, this.slime.body.y, this.slime); 
    
    //manual restart, test related inputs
    if(this.cursors.up.isDown && this.spaceBar.isDown){
      this.player.body.velocity.y = -300;
    }
    
    if(this.cursors.down.isDown){
      this.state.start('Game');
      

      
    }
  },
  
  killCheck: function(player, enemy){
    enemy.killCheck(player);
  },
  
  loadLevel: function(){  
    
    //this.map = this.add.tilemap('level1');
    this.map = this.add.tilemap(this.currentLevel);
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
    
    //itle layers
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');
    //this.objectLayer = this.map.createLayer('objectLayer');
    
    //
    
    //send background to back
    this.game.world.sendToBack(this.backgroundLayer);
    
    //collision on collisionLayer
    this.map.setCollisionBetween(1,160, true, 'collisionLayer');
    
    this.collisionLayer.resizeWorld();
    
    //add a goal
    var goalArray = this.findObjectsByType('goal', this.map, 'objectLayer');
    this.goal = this.add.sprite(goalArray[0].x, goalArray[0].y, 'mercy');
    this.game.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;
    this.goal.nextLevel = goalArray[0].properties.nextLevel;
    this.goal.scale.setTo(0.75, 0.75);
    this.goal.body.setSize(40,70);
    
    
    
    //create player
    var playerArray = this.findObjectsByType('player', this.map, 'objectLayer');
    this.player = this.add.sprite(playerArray[0].x, playerArray[0].y, 'player', 4);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {};
    this.player.body.collideWorldBounds = true;
    this.player.scale.setTo(0.4, 0.4);
    this.player.body.setSize(40,70,0,0);
    
    
    //follow player with the camera
    this.game.camera.follow(this.player);
    
    
    //add enemies
    this.enemies = this.add.group();
    var enemyArray = this.findObjectsByType('enemy', this.map, 'objectLayer');
    this.enemyArraySize = enemyArray.length;
  
    var i;
    for(i=0; i<this.enemyArraySize; i++){
      var sampleEnemy = new Gengu.Enemy(this.game, enemyArray[i].x, enemyArray[i].y, 'slime', 100, this.map);
      this.enemies.add(sampleEnemy);
    }   
   
   
     
  },
  nextLevel: function(player, goal){
    if(goal.nextLevel > this.currentLevel){
      this.game.state.start('Game', true, false, goal.nextLevel);
    }else if(goal.nextLevel < this.currentLevel){
      this.youWin();
    }
  },
  findObjectsByType: function(targetType, tilemap, layer){
    var result = [];
    tilemap.objects[layer].forEach(function(element){
      if(element.type == targetType){
        element.y -= tilemap.tileHeight;
        result.push(element);
      }
    }, this);
    return result;
  },
  youWin: function(){
    var style = {font: '60px Arial', fill: '#fff'};
    this.victoryText = this.add.text(this.player.body.x, this.player.body.y, 'YOU WIN!', style);
    this.victoryText.anchor.setTo(0.5);
    this.player.kill();
    this.winner = this.add.sprite(this.player.body.x, this.player.body.y, 'player', 4);
    this.winner.anchor.setTo(0.5);
    this.winner.scale.setTo(0.4, 0.4);
    this.game.physics.arcade.enable(this.winner);
    this.winner.customParams = {};
    this.winner.body.collideWorldBounds = true;
    this.winner.body.setSize(40,70,0,0);
    this.winner.body.velocity.y = -400;
    this.winner.body.drag.y = 500;
  },
  gameOver: function(){
    this.deadPlayer = this.add.sprite(this.player.body.x, this.player.body.y, 'player', 2);
    this.player.kill();
    this.deadPlayer.scale.setTo(0.5, -0.5);
    this.deadPlayer.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.deadPlayer);
    this.deadPlayer.customParams = {};
    this.deadPlayer.body.collideWorldBounds = true;
    this.deadPlayer.body.setSize(12,28,0,0);
    this.deadPlayer.body.velocity.y = -400;
    this.deadPlayer.body.drag.y = 500;
    //this.state.start('Home');
    var style = {font: '60px Arial', fill: '#fff'};
    this.gameOverText = this.add.text(this.deadPlayer.body.x, this.deadPlayer.body.y, 'Game Over', style);
    this.gameOverText.anchor.setTo(0.5);
    var style2 = {font: '30px Arial', fill: '#fff'};
    this.restartText = this.add.text(this.deadPlayer.body.x, this.deadPlayer.body.y + 80, 'Spacebar to retry', style2);
    this.restartText.anchor.setTo(0.5);
  },
  
  createOnscreenControls: function(){

    this.leftArrow = this.add.button(20, this.game.height - 60, 'arrowButton');
    this.rightArrow = this.add.button(110, this.game.height - 60, 'arrowButton');
    this.actionButton = this.add.button(this.game.width - 100, this.game.height - 60, 'actionButton');

    this.leftArrow.alpha = 0.5;
    this.rightArrow.alpha = 0.5;
    this.actionButton.alpha = 0.5;

    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;

    this.actionButton.events.onInputDown.add(function(){
      this.player.customParams.mustJump = true;
    }, this);

    this.actionButton.events.onInputUp.add(function(){
      this.player.customParams.mustJump = false;
    }, this);

    //left
    this.leftArrow.events.onInputDown.add(function(){
      this.player.customParams.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputUp.add(function(){
      this.player.customParams.isMovingLeft = false;
    }, this);

    this.leftArrow.events.onInputOver.add(function(){
      this.player.customParams.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputOut.add(function(){
      this.player.customParams.isMovingLeft = false;
    }, this);

    //right
    this.rightArrow.events.onInputDown.add(function(){
      this.player.customParams.isMovingRight = true;
    }, this);

    this.rightArrow.events.onInputUp.add(function(){
      this.player.customParams.isMovingRight = false;
    }, this);

    this.rightArrow.events.onInputOver.add(function(){
      this.player.customParams.isMovingRight = true;
    }, this);

    this.rightArrow.events.onInputOut.add(function(){
      this.player.customParams.isMovingRight = false;
    }, this);
    
  },
  
  playerJump: function(){
    if(this.player.body.touching.down || this.player.body.blocked.down){
      this.startJumpY = this.player.y;
      
      this.isJumping = true;
      this.jumpPeaked = false;
      
      this.player.body.velocity.y = -this.JUMPING_SPEED;
    }else if(this.isJumping && !this.jumpPeaked){
      var distanceJumped = this.startJumpY - this.player.y;
      
      if(distanceJumped <= this.maxJumpDistance) {
        this.player.body.velocity.y = -this.JUMPING_SPEED;
      }else {
        this.jumpPeaked = true;
      }
    }
  }
  
};
