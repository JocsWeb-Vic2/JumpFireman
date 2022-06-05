  "use strict";

var pausat = -1;

class Platform2Scene extends Phaser.Scene {
    constructor (){
        super('PlatformScene');
		this.platforms = null;
		this.Levelplatforms = null;
		this.player = null;
		this.cursors = null;
		this.stars = null;
		this.score = 0;
		this.scoreText;
		this.bombs = null;
		this.gameOver = false;
		this.newfons = null;
    }
    preload (){
		this.load.image('sky', '../resources/starsassets/fons.png');
		this.load.image('ground', '../resources/starsassets/platform2.png');
		this.load.image('star', '../resources/starsassets/star.png');
		this.load.image('bomb', '../resources/starsassets/bomb.png');

		this.load.spritesheet('dude',
			'../resources/starsassets/dude2.png',
			{ frameWidth: 32, frameHeight: 32 }
		);
	}
    create (){


		{	// Creem platafomress

      this.fons = this.physics.add.group();
			this.newfons = this.fons.create(400, 250, 'sky');
			this.newfons.setVelocityY(300);

			this.platforms = this.physics.add.staticGroup();
      this.platforms.create(0, 600, 'ground').setScale(0.2, 0.1).refreshBody();
			this.platforms.create(200, 600, 'ground').setScale(0.2, 0.1).refreshBody();
			this.platforms.create(400, 600, 'ground').setScale(0.2, 0.1).refreshBody();
			this.platforms.create(600, 600, 'ground').setScale(0.2, 0.1).refreshBody();
			this.platforms.create(800, 600, 'ground').setScale(0.2, 0.1).refreshBody();

			this.Levelplatforms = this.physics.add.staticGroup();
			this.Levelplatforms.create(200, 200, 'ground').setScale(0.1, 0.075).refreshBody();
			this.Levelplatforms.create(400, 300, 'ground').setScale(0.1, 0.075).refreshBody();
			this.Levelplatforms.create(600, 400, 'ground').setScale(0.1, 0.075).refreshBody();
			this.Levelplatforms.create(800, 500, 'ground').setScale(0.1, 0.075).refreshBody();

		}


		{	// Creem player i definim animacions
			this.player = this.physics.add.sprite(100, 450, 'dude');
			this.player.setBounce(0.2);
			this.player.setCollideWorldBounds(true);

      var button_pause = this.add.text(400, 550, 'Pause') //el botó de pause game, que és un text que s'activa al clickar a sobre.
				.setOrigin(0.5)
				.setPadding(10)
				.setStyle({ backgroundColor: '#111' })
				.setInteractive({ useHandCursor: true })
				.on('pointerdown', ()=>{
					pausat = 0;
				});

			this.anims.create({
				key: 'left',
				frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
				frameRate: 10,
				repeat: -1
			});

			this.anims.create({
				key: 'turn',
				frames: [ { key: 'dude', frame: 2 } ],
				frameRate: 20
			});

			this.anims.create({
				key: 'right',
				frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 4 }),
				frameRate: 10,
				repeat: -1
			});
		}
    
		{	// Creem objectes interactuables
			this.stars = this.physics.add.group({
				key: 'star',
				repeat: 11,
				setXY: { x: 12, y: 0, stepX: 70 }
			});
			this.stars.children.iterate((child) =>
				child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)));
		}


			this.bombs = this.physics.add.group(); // Grup d'enemics
			this.createBomb();
		{	// Definim les col·lisions i interaccions
			this.physics.add.collider(this.player, this.platforms);
			this.physics.add.collider(this.stars, this.platforms);
			this.physics.add.collider(this.player, this.Levelplatforms);
			this.physics.add.collider(this.stars, this.Levelplatforms);
			this.cursors = this.input.keyboard.createCursorKeys();
			this.physics.add.overlap(this.player, this.stars,
				(body1, body2)=>this.collectStar(body1, body2));
			this.physics.add.collider(this.bombs, this.platforms);
			this.physics.add.collider(this.bombs, this.Levelplatforms);
			this.physics.add.collider(this.player, this.bombs,
				(body1, body2)=>this.hitBomb(body1, body2));
		}
		{ // UI
			this.scoreText = this.add.text(16, 16, 'Score: 0',
				{ fontSize: '32px', fill: '#000' });
		}
	}
	update (){
		if (this.gameOver) return;
		{ // Moviment
			if (this.cursors.left.isDown){
				this.player.setVelocityX(-160);
				this.player.anims.play('left', true);
			}
			else if (this.cursors.right.isDown){
				this.player.setVelocityX(160);
				this.player.anims.play('right', true);
			}
			else{
				this.player.setVelocityX(0);
				this.player.anims.play('turn');
			}

			if (this.cursors.up.isDown && this.player.body.touching.down){
				this.player.setVelocityY(-330);
			}

			if(this.newfons.y == 650){
				this.newfons.y = 0;
			}

      if(pausat === 0){ //si hem pausat es para l'escena i llançem la de pausa
				this.scene.pause();
				this.scene.launch('escena_pausa');
			}
		}
	}
	collectStar(player, star){
		star.disableBody(true, true);
		this.score += 10;
		this.scoreText.setText('Score: ' + this.score);
		if (this.stars.countActive(true) === 0){
			this.enableAllStars();
			this.createBomb();
		}
	}
	createBomb(){
		var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
	hitBomb(player, bomb){
		if (this.gameOver)
			return;
		this.physics.pause();
		this.player.setTint(0xff0000);
		this.player.anims.play('turn');
		this.gameOver = true;
		setTimeout(()=>loadpage("../"), 3000);
	}
	enableAllStars(){
		this.stars.children.iterate(child =>
			child.enableBody(true, child.x, 0, true, true));
	}

	createPlatforn(){
		this.Levelplatforms.create(200, 200, 'ground').setScale(0.1, 0.075).refreshBody();
		this.Levelplatforms.create(400, 300, 'ground').setScale(0.1, 0.075).refreshBody();
		this.Levelplatforms.create(600, 400, 'ground').setScale(0.1, 0.075).refreshBody();
		this.Levelplatforms.create(800, 500, 'ground').setScale(0.1, 0.075).refreshBody();

	}

}
