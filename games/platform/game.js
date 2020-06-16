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

var game = new Phaser.Game(config);
var player;
var platforms;
var move = false;
var arrows; //arrow keys for keyboard control
var win = false;

var playerSpawn = new Phaser.Math.Vector2();

var text;
var winSound;

//mobile control vars
var leftButton;
var rightButton;
var leftDown = false;//boolean if i tap the left button
var rightDown = false;//boolean if i tap the right button
var timer;
var self = this;

var jumpTimer;
var debugText;

var worldHeight;

function preload(){
    this.load.image('greeble', 'assets/vis/greeble.png');
    this.load.spritesheet('fireball', 'assets/vis/xfireball.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('ground', 'assets/vis/red32x32.png');
    this.load.spritesheet('cole', 'assets/vis/cole-run-only.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('coinPNG', 'assets/vis/Coin.png', {frameWidth: 32, frameHeight: 32});
    
    //audio
    this.load.audio('bkg', 'assets/audio/harp_bourree.mp3');
    this.load.audio('win', 'assets/audio/trumpet_1.mp3');

    //UI
    this.load.image('arrow', 'assets/vis/arrow.png');

    //Shakespeare
    this.load.image('globe', 'assets/vis/globe-1.png');
    this.load.image('old-bridge', 'assets/vis/old-london-bridge.jpg');
}


function create(){       
    this.cameras.main.setBounds(0,0, this.game.canvas.width*4, this.game.canvas.height * 2);
    this.physics.world.setBounds(0,0, this.game.canvas.width*4, this.game.canvas.height * 2);

    worldHeight = this.physics.world.bounds.height;
//Backgrounds 
this.add.image(720, this.physics.world.bounds.height-(48+118), 'globe').setScale(0.5,0.5);
this.add.image((32*48) + 480, this.physics.world.bounds.height-(48+80), 'old-bridge');

//AUDIO
    var bkgMusic = this.sound.add('bkg', {volume: 0.12, loop: true});
    bkgMusic.play();

    winSound = this.sound.add('win', {volume: 0.25});

//PLATFORMS
    platforms = this.physics.add.staticGroup();
  
    platforms.create(32*24, this.physics.world.bounds.height-48,'ground').setScale(48, 3).refreshBody();   //1 
    // platforms.create(this.game.canvas.width-32*5, this.physics.world.bounds.height-48, 'ground').setScale(10,3).refreshBody(); //2
    console.log("Physics world bounds " , this.physics.world.bounds);

//World bkg 


//FIREBALL
    var fireball_config = {
        key: 'base',
        frames: this.anims.generateFrameNumbers('fireball', {end:4 }),
        frameRate: 12,        
        repeat: -1        
    }
   fireball_anim = this.anims.create(fireball_config);
   fireball = this.physics.add.sprite(300, this.game.canvas.height + 16, 'fireball');     
   fireball.body.setAllowGravity(false);
   
   fireball.body.setCircle(14,0,0);
   fireball.angle = 90;
   fireball.anims.load('base'); 
   fireball.anims.play('base');

   var fireballTween = this.tweens.add({
       targets: fireball,
       y: 220,
       ease: 'Linear',
       duration: 1500,
       repeat: -1, 
       yoyo: true,
       flipX: true,
   })
//COIN  
    var coin = this.physics.add.sprite(this.game.canvas.width-32, this.physics.world.bounds.height - 175, 'coinPNG');
    coin.body.setAllowGravity(false);
    coin.body.setCircle(11,5,5);

//PLAYER  
   var player_config = {
       key: 'run',
       frames: this.anims.generateFrameNumbers('cole'),
       frameRate: 12,
       repeat: -1
   }
 
   player = this.physics.add.sprite(32, this.physics.world.bounds.height - 150, 'cole');
   player.setBounce(0.2);
   player.setCollideWorldBounds(false);
   player.body.setSize(12,32);
//    player.body.setAllowGravity(false); //get rid of me once done testing
   player_anim = this.anims.create(player_config);
   player.anims.load('run');
   player.anims.play('run');
   playerSpawn.set(player.body.x, player.body.y);

   //camera to follow player
   this.cameras.main.startFollow(player, true, 0.1, 0.1, 15, 50);



//Physics and collision

   this.physics.add.collider(player, platforms);
   this.physics.add.overlap(player, fireball, fireballTouch);
   this.physics.add.overlap(player, coin, setWin);

//Win State
   text = this.add.text(300, 50, "You Win");
   text.setVisible(false);


//Desktop Controller
    arrows = this.input.keyboard.createCursorKeys();

//Mobile inputs

    game.input.addPointer();
    game.input.addPointer();  
    debugText = this.add.text(10, 10, 'input',{ font: '16px Courier', fill: '#00ff00' });

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
    
   //the arrows, just visual no interaction
    var leftArrow = this.add.image(50, this.game.canvas.height - 32, 'arrow').setScale(2,2);
    var rightArrow = this.add.image(150, this.game.canvas.height - 32, 'arrow').setScale(2,2);
    rightArrow.flipX = true;
    var arrowLine = this.add.line(100, this.game.canvas.height - 32, 0, 0, 0, 50, 0xffffff);
   
   //camera stuph
    leftArrow.setScrollFactor(0);
    rightArrow.setScrollFactor(0);
    arrowLine.setScrollFactor(0);
   
   //mobile button behavior
    leftButton.on('pointerdown', function(pointer){
        leftDown = true;
    });

    rightButton.on('pointerdown', function(pointer){
        rightDown = true;
    })

    jumpButton.on('pointerdown', (pointer) => {
        console.log('jump button');
        if(player.body.touching.down){ //using these booleans doesn't work but we need to exempt the buttons           
            player.setVelocityY(-175);
            let eventTimer = this.time.delayedCall(500, jumpDecay)         
        }
    });

    jumpButton.on('pointerup', function(pointer){
        if(player.body.velocity.y <0)
            jumpDecay();
    })
}

// ----END OF CREATE

function render(){
    game.debug.inputInfo(32, 32);

}


function update(){       
;

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

  

//Keyboard contorls
    if(arrows.left.isDown){
        player.setVelocityX(-160);
        player.flipX = true;
    }else if(arrows.right.isDown){
        player.setVelocityX(160);
        player.flipX = false;   
    }else{
        player.setVelocityX(0);
    }

//Floaty controls for testing
    // if(arrows.up.isDown){
    //     player.setVelocityY(-160);
    // }else if(arrows.down.isDown){
    //     player.setVelocityY(160);
    // }else{
    //     player.setVelocityY(0);
    // }
//end floaty
  
    if(arrows.up.isDown && player.body.touching.down){   
        player.setVelocityY(-275);       
        let timedEvent = this.time.delayedCall(500, jumpDecay)
    }

    if(!player.body.touching.down && arrows.up.isUp && player.body.velocity.y < 0){
        jumpDecay();
    }
 
    


   checkPlayerOOB(player);     
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

function setWin(){
    if(!win){  
        text.setVisible(true);
        winSound.play();
        win = true;          
    }
}

