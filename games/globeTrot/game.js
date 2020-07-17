const config = {
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
            // debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update        
    },
    backgroundColor: "#4488AA",
};

const game = new Phaser.Game(config);

function preload(){
    this.load.image('blue', 'assets/visual/64xblue.png');
    this.load.image('green', 'assets/visual/64xgreen.png');
    this.load.image('red', 'assets/visual/64xred.png');
    this.load.image('white', 'assets/visual/64xshite.png');
    this.load.image('yellow', 'assets/visual/64xyellow.png')
    this.load.image('arrow', 'assets/visual/64xarrow.png');

    //audio
    this.load.audio('music', 'assets/audio/harp_bourree.mp3');
    this.load.audio('fanfare', 'assets/audio/trumpet_1.mp3');
    this.load.audio('hit', 'assets/audio/sfx_sounds_impact1.wav');
    this.load.audio('loss', 'assets/audio/loss-1.mp3');
}


var fanfare;
var hit;
var bkgMusic;

var openMarks = [];
var closedMarks = [];
var arrows;
var player;
var markReady;

var dodgeTimer;
var lineTimer; 
var throwTimer;
var infoTimer;

var movementEnabled;
var combo; 
var comboSuccess;

var score;
var scoreText;

var infoText;

var tomatoes = [];

var script;

var rawCombo = [];

var firstStart;

function create(){
    this.add.image(360, 90, 'yellow').setScale(12, 6);
    score = 0;
    scoreText = this.add.text(550, 5, 'Score: ' + score, {fontFamily: 'Arial', fontSize: 25, stroke: '#000', strokeThickness: 3});


    firstStart = false;
    //audio 
    bkgMusic = this.sound.add('music', {volume:0.45, loop:true});
    fanfare = this.sound.add('fanfare', {volume: 0.7});
    hit = this.sound.add('hit', {volume: 0.5});
    var loss = this.sound.add('loss', {volume: 0.85});

//MARKS
    const marks = this.add.group();

    for(var i =0; i < 5; i++){
        marks.create(90+(90*i), 90, 'green').setScale(0.5, 0.5);
        marks.children.entries[i].setVisible(false);
     
        openMarks.push(marks.children.entries[i])
        this.physics.add.existing(marks.children.entries[i]);
        marks.children.entries[i].body.setAllowGravity(false);
        marks.children.entries[i].name = "mark " + i;
    }
  

    marks.children.entries[0].setPosition(81, 62);
    marks.children.entries[1].setPosition(365, 62);
    marks.children.entries[2].setPosition(600, 62);
    marks.children.entries[3].setPosition(200, 205);
    marks.children.entries[4].setPosition(524, 215);

    for(var i =0; i < 5; i++){     
        marks.children.entries[i].setVisible(false);
        // marks.children.entries[i].body.enable = false;
    }
    let markInit = this.time.delayedCall(500, startDelay);

//PLAYER
    player = this.physics.add.sprite(300, 200, 'blue');
    player.body.setAllowGravity(false);



//TOMATOES
    const tomates = this.add.group();
    for(let y = 0; y<10; y++){
        tomates.create(25+(y*75), 400, 'red').setScale(0.3, 0.3);
        this.physics.add.existing(tomates.children.entries[y]);
        tomates.children.entries[y].body.setAllowGravity(false);
        tomates.children.entries[y].body.onWorldBounds = true;
        tomatoes.push(tomates.children.entries[y]);        
    }




//Movement
    arrows = this.input.keyboard.createCursorKeys();
    movementEnabled = false;

    
//Physics    
    this.physics.add.overlap(player, marks, markOverlap);
    this.physics.add.overlap(player, tomates, tomatoHit);
//TIMERS
    dodgeTimer = this.time.addEvent({
        delay:1000, 
        callback: showMark, 
        loop: true
    });
    dodgeTimer.paused = true;

    throwTimer = this.time.addEvent({
        delay: 500, 
        callback: ()=>{
            throwTomato();
            checkTomato();
        }, 
        loop: true
    });

    throwTimer.paused = true;

    lineTimer = this.time.addEvent({
        delay: 5000, 
        callback: ()=> {
            console.log("times up");
            if(!comboSuccess){
                console.log("line failed");
                score -= 50;
                scoreText.text = "Score: " + score;
                loss.play();
                // infoText.text = "Line Failed";
                // infoText.setVisible(true);
            }
            endLine();
        },
        loop: true
    });

    lineTimer.paused = true;

    // infoTimer = this.time.addEvent({
    //     delay: 2000,
    //     callback: infoTimerControl(),
    //     loop: true
    // });

    // infoTimer.paused = true;

//COMBO

    script = this.add.group();
    for(s=0; s<4;s++){
        script.create(162 + (128*s), 315, 'arrow');
    }
    combo = this.input.keyboard.createCombo([37,37,37,37], {resetOnMatch: true});
    setCombo(); 

    this.input.keyboard.on('keycombomatch', function(){
        if(!movementEnabled)
            console.log("combo match");
            score += 100;
            scoreText.text = "Score: " + score;
            comboSuccess = true;
            // infoText.text = "Line Succes!";
            // infoTimer.paused = false;
    })

    infoText = this.add.text(120, 120, 'GlobeTrotter\nHit your Mark, Deliver Your lines\nAvoid Tomatoes\nclick to start',  {fontFamily: 'Arial', fontSize: 35, stroke: '#000', strokeThickness: 3, align: 'center'});

   
}

function update(){
    // mousePos();
    playerMove();
    clickStart();

}

// function infoTimerControl(){
//     infoTimer.paused = true;
//     infoText.setVisible(false);
// }


function throwTomato(){
    let randNum = Phaser.Math.Between(0, tomatoes.length-1);
    if(tomatoes[randNum].y > 360){
        tomatoes[randNum].body.setVelocityY(-300);
    }
}

function checkTomato(){
    for(let i=0; i<tomatoes.length; i++){
        if(tomatoes[i].y < 0){
            tomatoes[i].body.setVelocityY(0);
            tomatoes[i].y = 400;            
        }
        tomatoes[i].body.enable = true;
        tomatoes[i].setVisible(true);
    }
}

function tomatoHit(_p, _t){
    _t.body.setVelocityY(0);
    _t.y = 400;
    _t.body.enable = false;
    _t.setVisible(false);
    score -= 10;
    scoreText.text = "Score: " + score;
    console.log("tomato hit");
    hit.play();
}

function setCombo(){
    rawCombo = [];
    for(let z = 0; z<4;z++){
        let rand = Phaser.Math.Between(0,3);
        rawCombo.push(37+rand);
        if(rand+37 == 38){
            script.children.entries[z].angle = 90;
        }else if(rand+37 == 39){
            script.children.entries[z].angle = 180;
        }else if(rand+37 == 40){
            script.children.entries[z].angle = 270;
        }else{
            script.children.entries[z].angle = 0;
        }
    }
    combo.keyCodes = rawCombo;

    console.log(combo.keyCodes);
}

function scriptVisibile(val){
    for(i=0; i<4;i++){
        if(val){
            script.children.entries[i].setVisible(true);
        }else if(!val){
            script.children.entries[i].setVisible(false);
        }else{
            console.log("invalid visibility control");
        }
       
    }
}


function playerMove(){
    if(movementEnabled){
        if(arrows.left.isDown){
            player.setVelocityX(-260);
            player.flipX = true;
        }else if(arrows.right.isDown){
            player.setVelocityX(260);
            player.flipX = false;   
        }else{
            player.setVelocityX(0);
        }
    
        if(arrows.up.isDown){
            player.setVelocityY(-200);        
        }else if(arrows.down.isDown){
            player.setVelocityY(200);
        }else{
            player.setVelocityY(0);
        }
    }

}

function mousePos(){    
    if(game.input.mousePointer.isDown){
        console.log(game.input.mousePointer.worldX + ", " + game.input.mousePointer.worldY);
    }
}

function clickStart(){
    if(game.input.mousePointer.isDown){
        if(!firstStart){
            throwTimer.paused = false;
            dodgeTimer.paused = false;
            firstStart = true;
            infoText.text = '';
            infoText.setVisible(false);
            bkgMusic.play();
        }
    }
}



function markOverlap(_p, _m){
    openMarks.splice(openMarks.indexOf(_m), 1);     
    closedMarks.push(_m);
    _m.body.enable = false;
    dodgeTimer.paused = false;
    _m.setVisible(false);
    score += 25;
    scoreText.text = "Score: " + score;
}


function showMark(){  
   dodgeTimer.paused = true;
   if(openMarks.length > 1){    
        let randNum = Phaser.Math.Between(0, openMarks.length-1);
        let obj = openMarks[randNum];      
        obj.body.enable = true;
        obj.setVisible(true);
   }else if(openMarks.length == 1){      
       openMarks[0].body.enable = true;
       openMarks[0].setVisible(true);
   }else{
       console.log("time to deliver your lines...yes honey");
       throwTimer.paused = true;
       movementEnabled = false;
       player.setVelocity(0,0);
       lineTimer.paused = false;       
       scriptVisibile(false);
       fanfare.play();
   }
}


function startDelay(){
    for(let i=0; i< 5; i++){
        openMarks[i].body.enable = false;
    }
    movementEnabled = true;    
}



function reOpenMarks(){
    for(i=0; i < 5; i++){
        openMarks.push(closedMarks[i]);
    }
    closedMarks = [];
}


function endLine(){
    lineTimer.paused = true;
    movementEnabled = true;
    reOpenMarks();
    dodgeTimer.paused = false;
    comboSuccess = false;
    throwTimer.paused = false;
    checkTomato();
    setCombo();
    scriptVisibile(true);
}