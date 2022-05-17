var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    parent: 'game_area',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 300},
			debug: false
		}
	},
    scene: [ Platform2Scene ]
};

var game = new Phaser.Game(config);