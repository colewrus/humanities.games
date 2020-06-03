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
    },
    scene: {
        preload: preload,
        create: create,
        render: render,
        update: update        
    }
};

var greeble
var destX = 0;
var move = false;
var target = new Phaser.Math.Vector2();


var game = new Phaser.Game(config);

function preload(){
    this.load.image('greeble', 'assets/vis/greeble.png');
    this.load.spritesheet('fireball', 'assets/vis/xfireball.png', {frameWidth: 32, frameHeight: 32});

}

function create(){

    text = this.add.text(10,10, '', {font: '11px Courier', fill: '#00ff00'});
  
    greeble = this.physics.add.image(400, 300, 'greeble');    
    greeble.setBounce(0.2, 0.2);
    greeble.setCollideWorldBounds(true);

//FIREBALL
    var fireball_config = {
        key: 'base',
        frames: this.anims.generateFrameNumbers('fireball', {end:4 }),
        frameRate: 12,
        repeat: -1        
    }
 

   fireball_anim = this.anims.create(fireball_config);

   fireball = this.add.sprite(250, 250, 'fireball');
   fireball.anims.load('base'); 
   fireball.anims.play('base');


//POINTER
    this.input.on('pointerdown', function(pointer){//pointer control
        target.x = pointer.x;
        target.y = pointer.y;

        // this.physics.moveToObject(greeble, target, 200);
        move = true;   
    }, this);

}

function render(){
    game.debug.inputInfo(32, 32);
    game.debug.pointer(game.input.activePointer);
}


function update(){
    var p = this.input.activePointer;

    var distance = Phaser.Math.Distance.Between(greeble.x, greeble.y, target.x, target.y); 
    
    text.setText([
        'x: ' + target.x,
        'y: ' + target.y,   
        'distance: ' + distance
    ]);

    target.x = p.x;
    target.y = p.y;
    this.physics.moveToObject(greeble, target, 200);
    
    if(distance < 4){
        greeble.body.stop();
        console.log("should stop");
        move = false;
    }       

    // if(move){       
    //     if(distance < 4){
    //         greeble.body.stop();
    //         console.log("should stop");
    //         move = false;
    //     }       
    // }
    
}



