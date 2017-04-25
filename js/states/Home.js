var Gengu = Gengu || {};

//loading the game assets
Gengu.HomeState = {
  init: function() {
      this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
  },
  
  create: function(){
      var style = {font: '60px Arial', fill: '#fff'};
      this.startText = this.add.text(this.game.world.width * 0.5, this.game.world.height * 0.5, 'Press Space To Start', style);
      this.startText.anchor.setTo(0.5);
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