var Gengu = Gengu || {};

Gengu.game = new Phaser.Game(480, 360, Phaser.AUTO);

Gengu.game.state.add('Boot', Gengu.BootState); 
Gengu.game.state.add('Preload', Gengu.PreloadState); 
Gengu.game.state.add('Game', Gengu.GameState);

Gengu.game.state.start('Boot'); 
