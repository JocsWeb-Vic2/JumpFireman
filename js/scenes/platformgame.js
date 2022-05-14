"use strict";

class PlatformScene extends Phaser.Scene {
    constructor (){
        super('PlatformScene');
		this.platforms = null;
		this.player = null;

		this.fons = null;
		this.newfons = null;

		this.cursors = null;
		this.stars = null;
		this.score = 0;
		this.scoreText;
		this.bombs = null;
		this.gameOver = false;
    }
    preload (){	
		//this.load.image('sky', '../resources/starsassets/carretera.png');
		this.load.image('ground', '../resources/starsassets/platform.png');
		this.load.image('star', '../resources/starsassets/star.png');
		this.load.image('bomb', '../resources/starsassets/bomb.png');
		this.load.image('fons', '../resources/starsassets/carretera2.png')
		
		this.load.spritesheet('dude',
			'../resources/starsassets/camio.png',
			{ frameWidth: 77, frameHeight: 175 }
		);

		//this.load.spritesheet('fons',
		//	'../resources/starsassets/fons.png',
		//	{ frameWidth: 1033, frameHeight: 821 }
		//);
	}
    create (){	
		//this.add.image(400, 300, 'sky');
		//this.add.image(400, 300, 'fons');
		{	// Creem platafomres
			this.platforms = this.physics.add.staticGroup();
			//this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
			//this.platforms.create(600, 400, 'ground');
			//this.platforms.create(50, 250, 'ground');
			//this.platforms.create(750, 220, 'ground');
		}
		{
			this.fons = this.physics.add.group();
			this.newfons = this.fons.create(400, 250, 'fons');
			this.newfons.setVelocityY(300);
			//this.createFons();
		}
		{	// Creem player i definim animacions
			this.player = this.physics.add.sprite(468, 550, 'dude');
			//this.player.setBounce(0.2);
			//this.player = this.physics.add.staticGroup();
			this.player.setCollideWorldBounds(true);
			
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
			this.cursors = this.input.keyboard.createCursorKeys();
			this.physics.add.overlap(this.player, this.stars, 
				(body1, body2)=>this.collectStar(body1, body2));
			this.physics.add.collider(this.bombs, this.platforms);
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
				if(this.player.x > 150){
					this.player.setVelocityX(-160);
				}
				else this.player.setVelocityX(0);
				//this.player.anims.play('left', true);
			}
			else if (this.cursors.right.isDown){
				if(this.player.x < 660){
					this.player.setVelocityX(160);
				}
				else this.player.setVelocityX(0);
				//this.player.anims.play('right', true);
			}
			else{
				this.player.setVelocityX(0);
				//this.player.anims.play('turn');
			}

			if (this.cursors.up.isDown && this.player.body.touching.down){
				this.player.setVelocityY(-330);
			}

			if(this.newfons.y == 650){
				this.newfons.y = 0;
			}


		}
	}
	collectStar(player, star){
		star.disableBody(true, true);
		this.score += 10;
		this.scoreText.setText('Score: ' + this.score);
		if (this.stars.countActive(true) === 0){
			this.enableAllStars();
			//this.createBomb();
		}
	}
	createFons(){
		this.newfons = this.fons.create(400, -400, 'fons');
		this.newfons.setVelocityY(300);
	}
	createBomb(){
		var pos = Phaser.Math.Between(0, 3);
		var bomb;
		if(pos < 1){
			bomb = this.bombs.create(214, 16, 'bomb');
			bomb.setVelocity(0, 600);
		}
		else if(pos < 2){
			bomb = this.bombs.create(341, 16, 'bomb');
			bomb.setVelocity(0, 600);
		}
		else if(pos < 3){
			bomb = this.bombs.create(468, 16, 'bomb');
			bomb.setVelocity(0, 300);
		}
		else{
			bomb = this.bombs.create(596, 16, 'bomb');
			bomb.setVelocity(0, 300);
		}


		//var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        //var bomb = this.bombs.create(x, 16, 'bomb');
        //bomb.setBounce(1);
        //bomb.setCollideWorldBounds(true);
		setTimeout(()=>this.createBomb(), 1000);
	}
	hitBomb(player, bomb){
		if (this.gameOver) 
			return;
		this.physics.pause();
		this.player.setTint(0xff0000);
		//this.player.anims.play('turn');
		this.gameOver = true;
		setTimeout(()=>loadpage("../"), 3000);
	}
	enableAllStars(){
		this.stars.children.iterate(child => 
			child.enableBody(true, child.x, 0, true, true));
	}
}

