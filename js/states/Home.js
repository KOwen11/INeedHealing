var Gengu = Gengu || {};

//loading the game assets
Gengu.HomeState = {
  init: function() {
      this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
  },
  
  create: function(){
      this.player = this.add.sprite(this.game.world.width * 0.5, this.game.world.height * 0.35, 'player', 3);
      this.player.scale.setTo(2,2);
      this.player.anchor.setTo(0.5);
      var style = {font: '40px Arial', fill: '#fff'};
      this.startText = this.add.text(this.game.world.width * 0.5, this.game.world.height * 0.5, 'Press Space To Start', style);
      this.startText.anchor.setTo(0.5);
      this.game.camera.follow(this.startText);
  },
  
  update: function(){
      if(this.spaceBar.isDown){
          this.start();
      }
  },
  start: function(){
      this.state.start('Game');
  }
};