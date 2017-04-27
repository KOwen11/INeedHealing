var Gengu = Gengu || {};

Gengu.dim = Gengu.getGameLandscapeDimensions(500, 350);

Gengu.game = new Phaser.Game(Gengu.dim.w, Gengu.dim.h, Phaser.AUTO);

Gengu.game.state.add('Boot', Gengu.BootState); 
Gengu.game.state.add('Preload', Gengu.PreloadState); 
Gengu.game.state.add('Home', Gengu.HomeState);
Gengu.game.state.add('Game', Gengu.GameState);

Gengu.game.state.start('Boot'); 
