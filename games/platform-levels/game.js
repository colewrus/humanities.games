var arrows;
var player;
var playerControler;
var cam;
var moving;

var me;

var staticBlocks= [];
var trapBlocks = []; //should probably be initializing this only if needed when loading the level
var projectiles = [];
var jumpThroughs = [];
var collectible; //collecting this advances the level
var collectText;
var levelResetReady;
var level; //int that holds the level number and determines which to start
var levelOrder;

//audio vars
var music;
var fxJump;
var fxReset;
var fxCollect;

var IS_TOUCH = false;

window.addEventListener('touchstart', function(){
	if(!IS_TOUCH){
		IS_TOUCH = true;		
	}	
});

class GameJS extends Phaser.Scene{
	
	constructor(){
		super({key:'GameJS'});
	}
	
	init(data){	
		levelOrder = data.levels;
		level = data.level;
		levelResetReady = false;
	}


	
	create(){	
	
		me = this;	
		moving = false;
	
	//audio setup
		if(music === undefined){//make sure music is not already playing otherwise we get doubled up tracks
			music = this.sound.add('gameMusic', {
				mute: false,
				volume:0.5,
				loop: true
			});
			// music.play();
		}

		fxCollect = this.sound.add('fxCollect', {
			mute: false,
			volume: 1			
		});

		fxJump = this.sound.add('fxJump', {
			mute: false,
			volume:1.5
		});

		fxReset = this.sound.add('fxReset', {
			mute: false,
			volume: 1
		})
	//end audio setup
		
	//set camera size from the level file
		this.cameras.main.setBounds(0,0,Levels[levelOrder[level]].worldSize.x, Levels[levelOrder[level]].worldSize.y);
		this.physics.world.setBounds(0,0,Levels[levelOrder[level]].worldSize.x, Levels[levelOrder[level]].worldSize.y);
				

		arrows = this.input.keyboard.createCursorKeys(); //initialize keyboard controls, build in future check
		levelResetReady = false; //not ready to move to the next level
		this.nextLevelListen(); //listener for tap to advance level after touching collectible
		
		//build the game elements for the level
		this.loadLevel(Levels[levelOrder[level]]);
	
		
		this.cameras.main.startFollow(player, true, 0.05, 0.05, 0, 5);
		
		//Physics declarations
		this.physics.add.collider(player, jumpThroughs);
		this.physics.add.collider(player, staticBlocks);
		this.physics.add.overlap(player, collectible, this.collection);	
		this.physics.add.collider(player, trapBlocks, this.hitTrap);
		this.physics.add.collider(player, projectiles, this.hitProjectile);
		
		

		if(IS_TOUCH){
			this.input.addPointer(2);

			//create the mobile buttons on 	
			let jumpButton = this.add.rectangle(this.game.canvas.width*0.65, this.game.canvas.height/2, this.game.canvas.width*0.75, this.game.canvas.height, 0x000000, 0);
			jumpButton.setInteractive();
			jumpButton.setScrollFactor(0);

			let leftButton = this.add.rectangle(150, this.game.canvas.height/2, 300, this.game.canvas.height, 0xfffff, 0);
			let rightButton = this.add.rectangle(450, this.game.canvas.height/2, 300, this.game.canvas.height, 0xaaa, 0);
				
			leftButton.setInteractive();
			rightButton.setInteractive();
		
			leftButton.setScrollFactor(0);
			rightButton.setScrollFactor(0);

			//visual representation for the buttons
			let leftArrow = this.add.image(136, this.game.canvas.height - 128, 'arrow').setScale(2,2);
			leftArrow.setScrollFactor(0);			
			let rightArrow = this.add.image(465, this.game.canvas.height - 128, 'arrow').setScale(2,2);
			rightArrow.setScrollFactor(0);
			rightArrow.flipX = true;
			
			//exit button to leave the full screen view. Should be a menu button to adjust settings and go back
			let exitFullScreen = this.add.rectangle(125, 75, 100, 100, 0xd93909, 0.8);
			exitFullScreen.setInteractive();
			exitFullScreen.setScrollFactor(0);

			this.mobileControls(jumpButton, leftButton, rightButton);
			this.scale.startFullscreen();
			exitFullScreen.on('pointerdown', ()=>{
				if(this.scale.isFullscreen){
					this.scale.stopFullscreen();
				}else{
					this.scale.startFullscreen();
				}				
			})
		}
	}
	
	
	
	update(){		
			
		if(!IS_TOUCH){
			this.keyboardControls();
		}	
		
	}		


	nextLevelListen(){	
		//listener for advancing the game once collectible is collected
		this.input.on('pointerdown', function(pointer){		
			if(levelResetReady){
				// music.stop();
				if(Levels[levelOrder[level]] == undefined){
					console.log("no more levels");
				}else{
					console.log("level complete, next level " + Levels[levelOrder[level]].name);
					me.scene.start("GameJS", {level: level, levels: levelOrder})	
				}				
			}
		});
	}

	
	mobileControls(_jump, _left, _right){	
		_jump.on('pointerdown', function(pointer){			
			if(player.body.touching.down){
				// fxJump.play();
				player.setVelocityY(-955);					
				player.setTexture('player_jump');
				me.time.delayedCall(500, this.jumpDecay)

				setTimeout(()=>{
					if(player.body.velocity.y < 0){
						player.setVelocityY(0);
					}
				}, 500);
			}			
		})

		_jump.on('pointerup', function(pointer){
			if(player.body.velocity.y <0)
				player.setVelocityY(0);
		})
		
		if(!player.body.touching.down){
			player.setTexture('player_jump');
		}else{
			player.setTexture('player');
		}

		_left.on('pointerdown', () =>{
			player.setVelocityX(-400);
			player.flipX = true;
			if(player.body.touching.down){
				player.play('run', true);
			}else{
				player.setTexture('player_jump');
			}
				
		})

		_left.on('pointerup', ()=>{
			player.setVelocityX(0);
			player.anims.pause();
			player.setTexture('player');
		})

		_right.on('pointerdown', () => {
			player.setVelocityX(400);
			player.flipX = false;
			if(player.body.touching.down){
				player.play('run', true);
			}else{
				player.setTexture('player_jump');
			}
		})

		_right.on('pointerup', ()=>{
			player.setVelocityX(0);
			player.anims.pause();
			player.setTexture('player');
		})
	}
	
	keyboardControls(){
		   // //Keyboard contorls
		if(arrows.left.isDown){
			if(player.body.touching.down){
				player.setVelocityX(-500);
			}else{
				player.setVelocityX(-450);//slightly slower through the air
			}		
			player.flipX = true;		
			player.play('run', true);		
		}else if(arrows.right.isDown){
			if(player.body.touching.down){
				player.setVelocityX(500);
			}else{
				player.setVelocityX(450);//slightly slower through the air
			}
			player.flipX = false;	
			player.play('run', true);
		}else{
			player.setVelocityX(0);				
			player.anims.pause();
			player.setTexture('player');				
		}

		if(!player.body.touching.down){
			player.setTexture('player_jump');
		}

		//jump control
		if(arrows.up.isDown && player.body.touching.down){            
			player.setVelocityY(-845);       
			// fxJump.play();
			let timedEvent = this.time.delayedCall(500, this.jumpDecay)
			player.setTexture('player_jump');			
		}

		if(!player.body.touching.down && arrows.up.isUp && player.body.velocity.y < 0){
			this.jumpDecay();
		}  		
	}

	jumpDecay(){		
		if(player.body.velocity.y < 0)
			player.setVelocityY(0);		
	}
	
	
	loadLevel(data){		
		//add the backgrounds for parallax
		this.bg_far = this.add.tileSprite(0,0, Levels[levelOrder[level]].worldSize.x, 512, "backgroundFar");//default clouds
		this.bg_far.setOrigin(0,0);
		this.bg_far.setScrollFactor(0.2);
		this.bg_mid = this.add.tileSprite(0,Levels[levelOrder[level]].worldSize.y-512, Levels[levelOrder[level]].worldSize.x, 512, "backgroundMid");//default hills w/trees
		this.bg_mid.setOrigin(0,0);
		this.bg_mid.setScrollFactor(0.12);
		this.bg_near = this.add.tileSprite(0,Levels[levelOrder[level]].worldSize.y-256, Levels[levelOrder[level]].worldSize.x, 512, "backgroundNear");
		this.bg_near.setOrigin(0,0);
		this.bg_near.setScrollFactor(0.05);		

		player = this.physics.add.sprite(data.startPos.x, data.startPos.y, 'player');
		player.setCollideWorldBounds(true);
		player.setScale(0.75);		
		player.setSize(120,250, true);
		//player run animation
		me.anims.create({
			key: 'run',
			frames:[
				{key: 'player_run_1'},
				{key: 'player_run_2'}
			],
			frameRate: 8,
			repeat: -1
		});		

		if(data.collectibles != null){
			this.addCollectible(data.collectibles[0]);
		}
					

		if(data.projectile != null){
			data.projectile.forEach(this.addProjectile);
		}

		if(data.traps != null){
			data.traps.forEach(this.addTrap);
		}				

		if(data.jumpThrough != null){
			for(let i=0; i<data.jumpThrough.length; i++){				
				this.AddJumpThrough(data.jumpThrough[i]);
			}
		}
		//add the platforms last so you can cover up other elements
		data.staticPlatforms.forEach(this.addStatic);
	}

	hitProjectile(){
		//there should be a whole reset function.
			//animation to show "loss" state and reset, can just be a quick fade to black
		// fxReset.play();
		player.x = Levels[levelOrder[level]].startPos.x;
		player.y = Levels[levelOrder[level]].startPos.y;

	}

	addProjectile(obj){
		//create projectile sprite as object with physics and not affect by gravity
		let _temp = me.add.sprite(obj.x, obj.y, obj._key);
		me.physics.add.existing(_temp);
		_temp.body.allowGravity = false;
		_temp.body.setImmovable(true);
		projectiles.push(_temp);

		//add the tween so it is actually a projectile
		me.tweens.add({
			targets: _temp,
			x: obj.xTween,
			duration: obj.duration,
			ease: obj.ease,
			yoyo: obj.yoyo,
			repeat: obj.repeat,
			delay: obj.hold,
			flipX: obj.flipX
		})

		//need to check if it has animation, probably should be a separate function so it can be appliead to all elements
		me.anims.create({
			key: 'project', //is this shared name going to cause problems? make it unique
			frames: [
				{key: obj.frames[0]},
				{key: obj.frames[1]},
				{key: obj.frames[2]}
			],
			frameRate: 8,
			repeat: -1
		});
		_temp.play('project');
	}



	AddJumpThrough(_data){
		let jt = new JumpThrough(this, _data.x, _data.y, _data.width, _data.height, _data._key);		
		// jt.body.setSize(_data.width, 64);		
		// jt.body.offset.y = 192;
		jumpThroughs.push(jt);		
	}


	hitTrap(){
		// fxReset.play();
		player.x = Levels[levelOrder[level]].startPos.x;
		player.y = Levels[levelOrder[level]].startPos.y;
	}

	addTrap(obj){
		let _temp = me.add.tileSprite(obj.x, obj.y, obj.width, obj.height, obj._key);
		me.physics.add.existing(_temp);
		_temp.body.setImmovable(true);
		_temp.body.allowGravity = false;	
		trapBlocks.push(_temp);	
	}
	
	addStatic(obj){	
		let _temp = me.add.tileSprite(obj.x, obj.y, obj.width, obj.height, obj._key);
		me.physics.add.existing(_temp);
		_temp.body.setImmovable(true);
		_temp.body.allowGravity = false;	
		staticBlocks.push(_temp);	
		
	}
	
	addCollectible(obj){
		collectible = me.physics.add.sprite(obj.x, obj.y, obj._key);
		collectible.body.setAllowGravity(false);
	}	
	
	collection(p, c){ //this is the overlap check for the player and the collectible item
		//p is player, c is the collectible object
		var testRect = me.add.rectangle(960, 880, 1200, 300, 0xd0def5);
		testRect.setScrollFactor(0);
		testRect.setStrokeStyle(2, 0xfc6b5d, 1);
		var lastText = hgGet('text.collectible_by_level');
		
		var endText = me.add.text(400, 750, lastText[level]+"\n\nClick to continue", {font: '44px Arial', fill:'#000000', wordWrap:{width:1100, useAdvancedWrap:true}});
		
		endText.setScrollFactor(0);
		
		// fxCollect.play();
		c.visible = false;
		c.body.enable = false;		
		level = level +1;
		levelResetReady = true;	
	}	
}



