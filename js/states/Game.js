var Gengu = Gengu || {};

Gengu.GameState = {

  init: function() {    

    //constants
    this.RUNNING_SPEED = 300;
    this.JUMPING_SPEED = 600;
    this.maxJumpDistance = 500;

    //gravity
    this.game.physics.arcade.gravity.y = 2000;    
    
    //world bounds
    this.game.world.setBounds(0, 0, 2160, 720);
    
    //cursor keys to move the player
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
  },
  create: function() {
    //load current level
    this.loadLevel();
    
    //show on-screen touch controls
    //this.createOnscreenControls();    
  },   
  update: function() {   
    
    this.game.physics.arcade.collide(this.player, this.collisionLayer); 

    this.player.body.velocity.x = 0;
    
    //horizontal movement
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');
    }
    else {
      this.player.animations.stop();
      this.player.frame = 3;
    }
    
    
    //jump
    if((this.spaceBar.isDown) && (this.player.body.blocked.down || this.player.body.touching.down)) {
      this.playerJump();
    }
    
    
    //manual restart
    if(this.cursors.down.isDown){
      this.state.start('Game');
    }
  },
  loadLevel: function(){  
    
    this.map = this.add.tilemap('level1');
    
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
    
    //layers
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');
    
    //send background to back
    this.game.world.sendToBack(this.backgroundLayer);
    
    //collision on collisionLayer
    this.map.setCollisionBetween(1,160, true, 'collisionLayer');
    
    //create player
    this.player = this.add.sprite(100, this.game.world.height * 0.6, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {};
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(14,28,0,0);
    
   

    //follow player with the camera
    var style = 'STYLE_TOPDOWN';
    this.game.camera.follow(this.player, style);
  },
  
  createOnscreenControls: function(){
    /*
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
    */
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
