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
		this.score = 100;
		this.scoreText;
		this.kilometres = 0;
		this.kilometresText;
		this.comptador = 1;

		this.gasolines = null;
		this.cotxes = null;
		this.balles = null;
		this.bassals = null;
		this.edificis = null;
		this.lliscar = false;

		this.gameOver = false;
    }
    preload (){	
		//this.load.image('sky', '../resources/starsassets/carretera.png');
		this.load.image('ground', '../resources/starsassets/platform.png');
		this.load.image('star', '../resources/starsassets/star.png');
		this.load.image('bomb', '../resources/starsassets/bomb.png');
		this.load.image('fons', '../resources/starsassets/carretera2.png');
		this.load.image('balla', '../resources/starsassets/balla.png');
		this.load.image('bassal', '../resources/starsassets/bassal.png');
		this.load.image('gasolina', '../resources/starsassets/gas.png');
		this.load.image('edifici', '../resources/starsassets/edifici.png');

		//Load totes les imatges de cada cotxe
		this.load.image('cotxe1', '../resources/starsassets/cotxe1.png');
		this.load.image('cotxe2', '../resources/starsassets/cotxe2.png');
		this.load.image('cotxe3', '../resources/starsassets/cotxe3.png');
		this.load.image('cotxe4', '../resources/starsassets/cotxe4.png');
		this.load.image('cotxe5', '../resources/starsassets/cotxe5.png');
		this.load.image('cotxe6', '../resources/starsassets/cotxe6.png');
		
		this.load.spritesheet('dude',
			'../resources/starsassets/camio.png',
			{ frameWidth: 77, frameHeight: 175 }
		);
	}
    create (){	
		{
			this.fons = this.physics.add.group();
			this.newfons = this.fons.create(400, 250, 'fons');
			this.newfons.setVelocityY(300);
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
		{
			this.balles = this.physics.add.group();
			setTimeout(()=>this.createBalla(), 10000);
			this.bassals = this.physics.add.group();
			setTimeout(()=>this.createBassal(), 6000);
		}
		{
			this.gasolines = this.physics.add.group();
			setTimeout(()=>this.createGasolina(), 32000);
			setTimeout(()=>this.reduirGasolina(), 2000);
		}
		{
			this.edificis = this.physics.add.group();
			setTimeout(()=>this.createEdifici(), 5000);

		}
			this.cotxes = this.physics.add.group(); // Grup d'enemics
			setTimeout(()=>this.createCotxe(), 1000);
		{	// Definim les col·lisions i interaccions
			this.physics.add.collider(this.player, this.platforms);
			//this.physics.add.collider(this.stars, this.platforms);
			this.cursors = this.input.keyboard.createCursorKeys();
			this.physics.add.overlap(this.player, this.gasolines, 
				(body1, body2)=>this.collectGasolina(body1, body2));
			this.physics.add.collider(this.cotxes, this.platforms);
			this.physics.add.collider(this.player, this.cotxes, 
				(body1, body2)=>this.hitCotxe(body1, body2));
			//JUGADOR AMB BALLES
			this.physics.add.collider(this.player, this.balles, 
				(body1, body2)=>this.hitCotxe(body1, body2));
			//COTXES AMB BALLES
			this.physics.add.collider(this.cotxes, this.balles, 
				(body1, body2)=>this.hitBallaCotxe(body1, body2));
			//JUGADOR AMB BASSALS
			this.physics.add.collider(this.player, this.bassals, 
				(body1, body2)=>this.hitJugBassal(body1, body2));
			//BASSALS AMB COTXES
			this.physics.add.collider(this.cotxes, this.bassals, 
				(body1, body2)=>this.hitCotxeBassal(body1, body2));
			//PLAYER AMB EDIFICIS
			this.physics.add.collider(this.player, this.edificis, 
				(body1, body2)=>this.hitEdifici(body1, body2));
		}
		{ // UI
			this.scoreText = this.add.text(16, 16, 'Gasolina: 100', 
				{ fontSize: '32px', fill: '#000' });
			this.kilometresText = this.add.text(16, 50, 'Metres: 0', 
				{ fontSize: '32px', fill: '#000' });

			this.afegirKilometres();
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

			if (this.cursors.up.isDown && this.lliscar == false){

				this.player.setVelocityY(-160);
			}
			else if (this.cursors.down.isDown){
				this.player.setVelocityY(160);
			}
			else if(this.lliscar == false){
				this.player.setVelocityY(0);
			}
			if(this.newfons.y == 650){
				this.newfons.y = 0;
			}
		}
	}
	collectGasolina(player, gasolina){
		gasolina.disableBody(true, true);
		this.score = 100;
		this.comptador -= 0.1;
		this.scoreText.setText('Gasolina: ' + this.score);
	}
	reduirGasolina(){
		if (this.gameOver) return;
		if(this.score > 0){
			this.score -= 1;
			setTimeout(()=>this.reduirGasolina(), 800*this.comptador);
			this.scoreText.setText('Gasolina: ' + this.score);
		}
		else{
			this.hitCotxe(null, null);
		}
	}
	createFons(){
		this.newfons = this.fons.create(400, -400, 'fons');
		this.newfons.setVelocityY(300);
	}
	createBalla(){
		var pos = Phaser.Math.Between(0, 3);
		var balla;
		var posX = 596;
		if(pos < 1) posX = 214;
		else if(pos < 2) posX = 341;
		else if(pos < 3) posX = 468;

		balla = this.balles.create(posX, 0, 'balla').setScale(.65).refreshBody();
		balla.setVelocity(0, 300);
		setTimeout(()=>this.createBalla(), 10000);
	}
	createBassal(){
		var posX = Phaser.Math.Between(214, 596);
		var bassal;

		bassal = this.bassals.create(posX, 0, 'bassal').setScale(.2).refreshBody();
		bassal.setVelocity(0, 300);
		setTimeout(()=>this.createBassal(), 10000);
	}
	createGasolina(){
		var posX = Phaser.Math.Between(214, 596);
		var gasolina;

		gasolina = this.gasolines.create(posX, 0, 'gasolina').setScale(.08).refreshBody();
		gasolina.setVelocity(0, 300);
		setTimeout(()=>this.createGasolina(), 30000);
	}
	createCotxe(){
		var pos = Phaser.Math.Between(0, 3);
		var randomimatge = Phaser.Math.Between(0, 2);
		var imatge;
		var cotxe;
		if(pos < 2){
			if(randomimatge == 0) imatge = 'cotxe1';
			else if(randomimatge == 1) imatge = 'cotxe2';
			else imatge = 'cotxe3';
		}
		else{
			if(randomimatge == 0) imatge = 'cotxe4';
			else if(randomimatge == 1) imatge = 'cotxe5';
			else imatge = 'cotxe6';
		}


		if(pos < 1){
			cotxe = this.cotxes.create(214, 0, imatge).setScale(.4).refreshBody();;
			cotxe.setVelocity(0, 600);
		}
		else if(pos < 2){
			cotxe = this.cotxes.create(341, 0, imatge).setScale(.4).refreshBody();;
			cotxe.setVelocity(0, 600);
		}
		else if(pos < 3){
			cotxe = this.cotxes.create(468, 0, imatge).setScale(.4).refreshBody();;
			cotxe.setVelocity(0, 200);
		}
		else{
			cotxe = this.cotxes.create(596, 0, imatge).setScale(.4).refreshBody();;
			cotxe.setVelocity(0, 200);
		}

		setTimeout(()=>this.createCotxe(), 2000);
	}
	hitCotxe(player, cotxe){
		if (this.gameOver) 
			return;
		this.physics.pause();
		this.player.setTint(0xff0000);
		//this.player.anims.play('turn');
		this.gameOver = true;
		setTimeout(()=>loadpage("../"), 3000);
	}
	hitBallaCotxe(balla, cotxe){
		balla.setVelocityY(300);
		cotxe.setVelocityY(300);
	}
	hitCotxeBassal(cotxe, bassal){
		bassal.disableBody(true, true);
	}
	hitJugBassal(player, bassal){
		this.lliscar = true;
		player.setVelocityY(160);
		setTimeout(()=>this.restablirVel(), 2000);
		bassal.disableBody(true, true);
	}
	restablirVel(){
		this.lliscar = false;
		this.player.setVelocityY(300);
	}
	enableAllStars(){
		this.stars.children.iterate(child => 
			child.enableBody(true, child.x, 0, true, true));
	}
	afegirKilometres(){
		if(this.gameOver) return;
		this.kilometres += 1;
		//else {
			setTimeout(()=>this.afegirKilometres(), 50);
			this.kilometresText.setText('Metres: ' + this.kilometres);
		//}
	}
	createEdifici(){
		var pos = Phaser.Math.Between(0, 3);
		var edifici;
		var posX = 596;
		if(pos < 1) posX = 214;
		else if(pos < 2) posX = 341;
		else if(pos < 3) posX = 468;

		edifici = this.edificis.create(posX, 0, 'edifici').setScale(.65).refreshBody();
		edifici.setVelocity(0, 300);
		setTimeout(()=>this.createEdifici(), 60000);
	}
	hitEdifici(player, edifici){
		edifici.disableBody(true, true);
		let joc = {
			gasolina = this.score,
			km = this.kilometres
		          };
		loadpage("../html/platform2.html");
	}
	
}

