var Gengu = Gengu || {};

Gengu.game = new Phaser.Game(540, 300, Phaser.AUTO);

Gengu.game.state.add('Boot', Gengu.BootState); 
Gengu.game.state.add('Preload', Gengu.PreloadState); 
Gengu.game.state.add('Home', Gengu.HomeState);
Gengu.game.state.add('Game', Gengu.GameState);

Gengu.game.state.start('Boot'); 
