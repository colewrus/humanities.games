var arrows;
var player;
var playerControler;
var cam;

var box2;
var me;

var staticBlocks= [];
var collectible; //collecting this advances the level
var collectText;
var levelResetReady;
var level; //int that holds the level number and determines which to start
var path;
var brake;
var speed = 10;



class GameJS extends Phaser.Scene{
	
	constructor(){
		super({key:'GameJS'});
	}
	
	init(data){
		console.log("init", data);
		level = data.level;
		levelResetReady = false;
	}
	

	preload(){
		this.load.json('leveldata', 'level_data.json');
	}
	
	create(){
			
		me = this;	
		let dataTest = this.cache.json.get('leveldata');
		
		console.log("data test " , dataTest.level_data[0]);
		this.cameras.main.setBounds(0,0,1440, 720);
		this.physics.world.setBounds(0,0,1440,720);
		
		
		arrows = this.input.keyboard.createCursorKeys();
		levelResetReady = false;
		//this.loadLevel(Levels[level]);
			//deprecated from level object rather than json
		
		this.loadLevel(dataTest.level_data[level]);
			//new json hotness
		
		this.cameras.main.startFollow(player, true, 0.05, 0.05, 0, 35);
		//this.cameras.main.setZoom(0.8);
		this.physics.add.collider(player, staticBlocks);
		this.physics.add.overlap(player, collectible, this.collection);	

		
		this.input.on('pointerdown', function(pointer){
			if(levelResetReady){
				if(Levels[level] == undefined){
					console.log("no more levels");
				}else{
					console.log("level complete, next level " + Levels[level].name);
					me.scene.start("GameJS", {level: level})	
				}				
			}
		});
	}
	
	
	
	update(){		
		this.keyboardControls();	
	}		
	
	keyboardControls(testEnabled){
		   // //Keyboard contorls
		if(arrows.left.isDown){
			player.setVelocityX(-200);
			player.flipX = true;			
		}else if(arrows.right.isDown){
			player.setVelocityX(200);
			player.flipX = false;   		
		}else{
			player.setVelocityX(0);						
		}
	
		// //Floaty controls for testing
		if(testEnabled == true){
			player.body.setAllowGravity(false);        
			if(arrows.up.isDown){
				player.setVelocityY(-150);
			}else if(arrows.down.isDown){
				player.setVelocityY(160);
			}else{
				player.setVelocityY(0);
			}
		}else{
			player.body.setAllowGravity(true);
		}

		if(arrows.up.isDown && player.body.touching.down){            
			player.setVelocityY(-355);       
			let timedEvent = this.time.delayedCall(500, this.jumpDecay)
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
		console.log("begin load level");	
		player = this.physics.add.sprite(data.startPos.x, data.startPos.y, 'player');
		player.setCollideWorldBounds(true);
		
		data.staticPlatforms.forEach(this.addTileSprite);	
		this.addCollectible(data.collectibles[0]);

		if(data.movingPlatforms != null){
			//data.movingPlatforms.forEach(this.addPlatforms);
		}		
	}
	
	
	addTileSprite(obj){
		/* y u no work?!?!
		(obj) => {
			console.log("arrow function " );
			this.add.tileSprite(obj.x, obj.y, obj.width, obj.height, obj._key);
		}
		*/		
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
	
	
	collection(p, c){
		//console.log("collection firing" , me.cameras.main.midPoint.x,me.cameras.main.midPoint.y);
	

		var testRect = me.add.rectangle(360, 300, 600, 100, 0xd0def5);
		testRect.setScrollFactor(0);
		testRect.setStrokeStyle(2, 0xfc6b5d, 1);
		var testText = me.add.text(100, 270, Levels[level].collectibles[0]._text, {font: '24px Arial', fill:'#000000'});
		testText.setScrollFactor(0);
		
		
		c.visible = false;
		c.body.enable = false;		
		level = level +1;
		levelResetReady = true;	
	}

	
	
}
