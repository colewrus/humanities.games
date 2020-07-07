var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gamespace',    
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 360
    },      
    physics: {
        default: 'arcade', 
        arcade: {
            gravity: {y:300},
            debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        render: render,
        update: update        
    },
    backgroundColor: "#4488AA",
};

var player;
var platforms;
var move = false;
var arrows; //arrow keys for keyboard control


var playerSpawn = new Phaser.Math.Vector2();

var winSound;

var onPassThrough = false; //if you are on top of an object you can "down" through

//mobile control vars
var leftButton;
var rightButton;
var leftDown = false;//boolean if i tap the left button
var rightDown = false;//boolean if i tap the right button
var timer;
var self = this;

var jumpTimer;


var worldHeight;
var me;

var acts; //number of acts collected
var maxActs; //maximum number to collect
var collectibleText;




function preload(){
    //UI plugin
   
    this.load.image('greeble', 'assets/vis/greeble.png');
    this.load.spritesheet('fireball', 'assets/vis/xfireball.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('ground', 'assets/vis/red32x32.png');
    this.load.spritesheet('cole', 'assets/vis/cole-run-only.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('box', 'assets/vis/128-box.png');
    this.load.image('cobblestone', 'assets/vis/ground-resize.jpg');

    //"this" is a string
    //123 is an integer
    //1.23 is a float 

    //audio
    this.load.audio('bkg', 'assets/audio/harp_bourree.mp3');
    this.load.audio('win', 'assets/audio/trumpet_1.mp3');

    //UI
    this.load.image('arrow', 'assets/vis/arrow.png');

    //Shakespeare
    this.load.image('globe', 'assets/vis/globe-1.png');
    this.load.image('scroll', 'assets/vis/scroll.png');
    this.load.image('blank-scroll','assets/vis/blank-scroll.png');
    this.load.image('will', 'assets/vis/shakes-1.png');
    this.load.image('bridge', 'assets/vis/bridge-2.png');
    this.load.spritesheet('cart', 'assets/vis/cart.png', {frameWidth:1000, frameHeight:600});
}


function create(){       
    this.cameras.main.setBounds(0,0, this.game.canvas.width*4, this.game.canvas.height * 2);
    this.physics.world.setBounds(0,0, this.game.canvas.width*4, this.game.canvas.height * 2);

    worldHeight = this.physics.world.bounds.height;

//Backgrounds 
    this.add.image(720, this.physics.world.bounds.height-(48+118), 'globe').setScale(0.5,0.5);
    this.add.image(2250, this.physics.world.bounds.height-(48+55), 'bridge')

//London Bridge
    var bridgeRect = this.add.rectangle(2250, this.physics.world.bounds.height-37, (2851*0.5), (476*0.25), 0x6666ff, 0);
    this.physics.add.existing(bridgeRect);  
    bridgeRect.body.setAllowGravity(false);
    bridgeRect.body.setImmovable(true);
    //bridge respawn point
    var bridgeSpawn = this.add.rectangle(1522, this.physics.world.bounds.height/2, 10, this.physics.world.bounds.height, 0x6666ff, 0);
    this.physics.add.existing(bridgeSpawn);
    bridgeSpawn.body.setAllowGravity(false);
    bridgeRect.body.setImmovable(true);
    
//AUDIO
    var bkgMusic = this.sound.add('bkg', {volume: 0.12, loop: true});
    bkgMusic.play();

    winSound = this.sound.add('win', {volume: 0.25});

//STATIC PLATFORMS
    platforms = this.physics.add.staticGroup();
  
    //opening ground level
    platforms.create(32*24, this.physics.world.bounds.height-48,'ground').setScale(48, 3).refreshBody();   //1 
    
    //this is the tile sprite of the ground texture
    var ts = this.add.tileSprite(32*24, this.physics.world.bounds.height-48, (48*32), 32*3, 'cobblestone');

    
    //upper left
    platforms.create(32*15, 300, 'ground').setScale(32, 1.5).refreshBody();
    var ts2 = this.add.tileSprite(32*15, 300, 32*32, 1.5*32, 'cobblestone'); 

    //Make platforms you can jump through here
    jumpThroughs = this.physics.add.staticGroup();

    jumpThroughs.create(1200, 550, 'box').setScale(1,0.15).refreshBody();
    jumpThroughs.create(1100, 475, 'box').setScale(1,0.15).refreshBody();
    jumpThroughs.create(1050, 375, 'box').setScale(.5,0.15).refreshBody();
    





//Carts
     var cart_config = {
         key: 'cartBase',
         frames: this.anims.generateFrameNumbers('cart', {end:2}),
         frameRate: 12,
         repeat: -1
     }
     cart_anim = this.anims.create(cart_config);


     var cart = this.physics.add.sprite(1812, 600, 'cart').setScale(0.07, 0.07);
     cart.body.setAllowGravity(false);

     cart.anims.load('cartBase');
     cart.anims.play('cartBase');

     var cartTween = this.tweens.add({
         targets: cart, 
         x:2207,
         ease: 'Linear',
         duration: 3500,
         repeat: -1,
         hold: 100,
         yoyo: true,
         flipX: true,
         onYoyo: function(){
             cart.body.enable = false;
             cart.setVisible(false);
             this.pause();
             resumeTween(cart, this);
             cart.flipX = false;
         },
         onRepeat: function(){
            cart.body.enable = false;
            cart.setVisible(false);
            this.pause();
            resumeTween(cart, this);
            cart.flipX = true;
         }
     })    
     

    
    

//BILL'S SCRIPTS

    var collectibles = this.physics.add.staticGroup();

    collectibles.create(100, 225,'blank-scroll').setScale(0.20, 0.20).refreshBody(); //act I
    var cBody = collectibles.children.entries[0].body;
    collectibles.create(500, this.physics.world.bounds.height - 175, 'blank-scroll').setScale(0.2, 0.2).refreshBody();//act II
    collectibles.create(1200, this.physics.world.bounds.height - 175, 'blank-scroll').setScale(0.2, 0.2).refreshBody();//act III
    collectibles.create(1800, this.physics.world.bounds.height - 175, 'blank-scroll').setScale(0.2, 0.2).refreshBody();//act IV
    collectibles.create(1700, this.physics.world.bounds.height - 175, 'blank-scroll').setScale(0.2, 0.2).refreshBody();//act V    
    //collectibles.children.entries[0].body.setSize(collectibles.children.entries[0].body.width*.9,collectibles.children.entries[0].body.width*.6);
    acts = 0;
    maxActs = collectibles.children.entries.length;
    for(i=0;i<collectibles.children.entries.length;i++){
        collectibles.children.entries[i].body.setSize(cBody.width*.9,collectibles.children.entries[0].body.width*.6);
    }


//PLAYER  

 
   player = this.physics.add.sprite(1452, 457, 'cole');
   player.setBounce(0.5);
   player.setCollideWorldBounds(false);
   player.body.setSize(12,32);
   player.body.setAllowGravity(true); //get rid of me once done testing

    //player animation
   var player_config = {
    key: 'run',
    frames: this.anims.generateFrameNumbers('cole'),
    frameRate: 12,
    repeat: -1
    }
   player_anim = this.anims.create(player_config);
   player.anims.load('run');
   player.anims.play('run');

   playerSpawn.set(player.body.x, player.body.y);

   //camera to follow player
   this.cameras.main.startFollow(player, true, 0.1, 0.1, 15, 50);




//Physics and collision
 

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, jumpThroughs, jumpThroughCollide);
    this.physics.add.collider(player, bridgeRect);   
    this.physics.add.overlap(player, cart, respawnPlayer);
    this.physics.add.overlap(player, bridgeSpawn, function(){playerSpawn.set(bridgeSpawn.body.x, 600);});

    this.physics.add.overlap(player, collectibles, collectCollide);
  




//Desktop Controller
    arrows = this.input.keyboard.createCursorKeys();

//Mobile inputs

    game.input.addPointer();
    game.input.addPointer();  
    

    //duck it big jump button that takes up most the screen
    var jumpButton = this.add.rectangle(this.game.canvas.width*0.65, this.game.canvas.height/2, this.game.canvas.width*0.75, this.game.canvas.height, 0x000000, 0);
    jumpButton.setInteractive();
    jumpButton.setScrollFactor(0);

    //buttons are large for easier tap
    leftButton = this.add.rectangle(50, this.game.canvas.height/2, 100, this.game.canvas.height, 0xc2fff7, 0);
    rightButton = this.add.rectangle(150, this.game.canvas.height/2, 100, this.game.canvas.height, 0xc2fff7, 0);

    leftButton.setInteractive();
    rightButton.setInteractive();

    leftButton.setScrollFactor(0);
    rightButton.setScrollFactor(0);

       
   //mobile button behavior
    leftButton.on('pointerdown', function(pointer){
        leftDown = true;
    });

    rightButton.on('pointerdown', function(pointer){
        rightDown = true;
    })

    jumpButton.on('pointerdown', (pointer) => {        
        if(player.body.touching.down){ //using these booleans doesn't work but we need to exempt the buttons           
            player.setVelocityY(-175);
            let eventTimer = this.time.delayedCall(500, jumpDecay)         
        }
    });

    jumpButton.on('pointerup', function(pointer){
        if(player.body.velocity.y <0)
            jumpDecay();
    })
  
//UI STUPH
//the arrows, just visual no interaction
    var leftArrow = this.add.image(50, this.game.canvas.height - 32, 'arrow').setScale(2,2);
    var rightArrow = this.add.image(150, this.game.canvas.height - 32, 'arrow').setScale(2,2);
    rightArrow.flipX = true;
    var arrowLine = this.add.line(100, this.game.canvas.height - 32, 0, 0, 0, 50, 0xffffff);
   
   //camera stuph to keep arrows on the screen
    leftArrow.setScrollFactor(0);
    rightArrow.setScrollFactor(0);
    arrowLine.setScrollFactor(0);


//might need to refine this but works for now
    for(i=0; i<jumpThroughs.children.entries.length; i++){
        jumpThroughs.children.entries[i].body.checkCollision.down = false; 
    } 


//collectible icon 
    var collectIcon = this.add.image(this.game.canvas.width - 100, 25, 'blank-scroll').setScale(0.1,0.1);
    collectIcon.setScrollFactor(0);    
    collectibleText = this.add.text(this.game.canvas.width - 50, 10, 'x0', {fontFamily:'Arial', color: '#ffffff'});
    collectibleText.setScrollFactor(0);


//THIS variable
   me = this;
    
}

// ----END OF CREATE

function render(){
    game.debug.inputInfo(32, 32);

}


function update(){       
//press down to fall through a platform probably unecessary as we don't have an easy control for mobile but meh 

//    console.log(fireballTween.state);
    if(player.body.touching.none){               
        onPassThrough = false;
    }else if(onPassThrough){
        if(arrows.down.isDown){           
            player.body.checkCollision.down = false;
            this.time.addEvent({
                delay: 500,
                callback: ()=>{
                    player.body.checkCollision.down = true;
                }
            })
        }
    }
//End of gratuitous code

    if(this.input.mousePointer.isDown || this.input.pointer1.isDown || this.input.pointer2.isDown){       
       if(leftDown){
            player.setVelocityX(-160);
            player.flipX = true;         
        }else if(rightDown){
            player.setVelocityX(160);
            player.flipX = false;                       
        }  
    }else{        
        if(leftDown || rightDown){           
            leftDown = false;
            rightDown = false;  
            player.setVelocityX(0);
        }
    }  

    mousePos();
    
    keyboardControls(false);
    checkPlayerOOB(player); 
    

}


function resumeTween(_obj, _tween){
    me.time.addEvent({
        delay:1000,
        callback: function(){            
            _obj.body.enable = true;
            _obj.setVisible(true);
            _tween.resume();
        }
    })
}

function mousePos(){
    if(me.input.mousePointer.isDown){
        console.log(me.input.mousePointer.worldX + ", " + me.input.mousePointer.worldY);
    }
}

function keyboardControls(testEnabled){
       // //Keyboard contorls
    if(arrows.left.isDown){
        player.setVelocityX(-160);
        player.flipX = true;
    }else if(arrows.right.isDown){
        player.setVelocityX(160);
        player.flipX = false;   
    }else{
        player.setVelocityX(0);
    }

    // //Floaty controls for testing
    if(testEnabled == true){
        player.body.setAllowGravity(false);        
        if(arrows.up.isDown){
            player.setVelocityY(-160);
        }else if(arrows.down.isDown){
            player.setVelocityY(160);
        }else{
            player.setVelocityY(0);
        }
    }else{
        player.body.setAllowGravity(true);
    }

    if(arrows.up.isDown && player.body.touching.down){            
        player.setVelocityY(-275);       
        let timedEvent = me.time.delayedCall(500, jumpDecay)
    }

    if(!player.body.touching.down && arrows.up.isUp && player.body.velocity.y < 0){
        jumpDecay();
    }  
}

function jumpThroughCollide(){
    onPassThrough = true;
}


function collectCollide(_player, _collectible){
    acts++;
    console.log("acts collected " + acts);
    _collectible.body.enable = false;
    _collectible.setVisible(false);
    collectibleText.text = "x" + acts;
}


function jumpDecay(){    
    if(player.body.velocity.y < 0)
        player.setVelocityY(0);
}

function checkPlayerOOB(p){
    if(p.getBounds().y > worldHeight){
        console.log("Player off screen");
        p.setPosition(playerSpawn.x, playerSpawn.y);
    }
}

function respawnPlayer(){
    player.setPosition(playerSpawn.x, playerSpawn.y);
}

function fireballTouch(){
    respawnPlayer();
}





var game = new Phaser.Game(config);