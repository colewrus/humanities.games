var fanfare;
var bkgMusic;

var openMarks = [];
var closedMarks = [];
var arrows;
var player;
var markReady;

var playerAnim;

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

var projectiles_L = [];
var projectileSpeed = 300;
var splat = [];
var activeSplats;
var paused; 
var script;
// var info;
var info;
var quizPanel;

var rawCombo = [];

var firstStart;


var textBoxTop;
var textTop;
var tutorialText = [];
// var direction;
var projectileCount;
var me;
class GameJS extends Phaser.Scene{
    
    

	constructor(){
		super({key:'GameJS'});
	}
  
    preload(){                
        console.log(gameData.images);
        for( var imageID in gameData.images ) {		
			var asset = hgGet( 'images.' + imageID );                       
            if( asset != null ) {							
				this.load.image( imageID, asset );	                 
                // console.log("added " , imageID , " at " , asset);
			} else {
				// Shouldn't happen but we should display a whoops.     
                if(gameData.images.hasOwnProperty(imageID)){
                    console.log("whoa");
                }else{
                    console.log("image preload whoops ");
                }         
                
			}
        }
    }


    create(){
      
      
        let direction = hgGet('options.projectileDirection');
        let projectileSpeed = gameData.options.projectileSpeed.default;//difference between this and hgGet? issues?
        projectileCount = gameData.options.projectileCount.default;

     
      
        me = this;      
        var background = this.add.tileSprite(this.game.canvas.width/2, this.game.canvas.height-96, this.game.canvas.width, 192, 'background-0');
        var foreground = this.add.tileSprite(this.game.canvas.width/2, this.game.canvas.height-96, this.game.canvas.width, 192, 'foreground-0');
        score = 0;
        scoreText = this.add.text((this.game.canvas.width/5)*4, 5, 'Score: ' + score, {fontFamily: 'Arial', fontSize: 64, stroke: '#000', strokeThickness: 3});
        //click bool so we can control when we start the game
        firstStart = true;    


    //MARKS    
        const collectibles = this.add.group();

        for(var i =0; i < 5; i++){
            collectibles.create(90+(90*i), 90, 'collectible-0').setScale(0.75, 0.75);
            // collectibles.children.entries[i].setVisible(false);
        
            openMarks.push(collectibles.children.entries[i])
            this.physics.add.existing(collectibles.children.entries[i]);
            collectibles.children.entries[i].body.setAllowGravity(false);                                   
        }   

   
         //math this fool, calculate the position based on canvas size  (chelsea's right)
        collectibles.children.entries[0].setPosition((this.game.canvas.width/3)-300,this.game.canvas.height/3);
        collectibles.children.entries[1].setPosition(((this.game.canvas.width/3)*2)-300, this.game.canvas.height/3);
        collectibles.children.entries[2].setPosition((this.game.canvas.width)-300, this.game.canvas.height/3);
        collectibles.children.entries[3].setPosition((this.game.canvas.width/6)*2, (this.game.canvas.height/3)*2);
        collectibles.children.entries[4].setPosition((this.game.canvas.width/6)*4, (this.game.canvas.height/3)*2);

        for(var i =0; i < 5; i++){     
            collectibles.children.entries[i].setVisible(false);
        }
        let markInit = this.time.delayedCall(500, this.startDelay);

    //PLAYER
        player = this.physics.add.sprite(300, 200, 'player-idle');
        player.body.setAllowGravity(false);
        player.setSize(44,64);
        player.setCollideWorldBounds(true);
        //just one animation
        if(this.textures.exists('player-side-0') && this.textures.exists('player-side-1')){
           console.log("Both side move animation files found")
           this.anims.create({
                key: 'move',
                frames:[
                    {key: 'player-side-0'},
                    {key: 'player-side-1'}
                ],
                frameRate: 4,
                repeat: -1
		    });	
            // this.anims.exists('move') check if this animation exists 
          
        }else if(this.textures.exists('player-side-0')){
            console.log("Only one side move frame")
            this.anims.create({
                key: 'move',
                frames:[
                    {key: 'player-side-0'}                  
                ],
                frameRate: 4,
                repeat: -1
            });
        }else{
            console.log("no side move frames")
        }


    //PROJECTILES
       
        const projectiles = this.add.group();
        for(let y = 0; y<projectileCount; y++){
            //change starting position based on projectile direction
            switch(direction){
                case "down":
                    projectiles.create((100+(this.game.canvas.width/projectileCount)*y), -100, 'projectiles-0').setScale(0.5, 0.5);
                    break;
                case "up": 
                    projectiles.create((100+(this.game.canvas.width/projectileCount)*y), this.game.canvas.height+100, 'projectiles-0').setScale(0.5, 0.5);
                    break;
                case "left":          
                    projectiles.create(this.game.canvas.width+100, 100+(this.game.canvas.height/projectileCount)*y, 'projectiles-0').setScale(0.5, 0.5);
                    break;
                case "right":
                    projectiles.create(-100, 100+(this.game.canvas.height/projectileCount)*y, 'projectiles-0').setScale(0.5, 0.5);
                    break;
            }        
            this.physics.add.existing(projectiles.children.entries[y]);
            projectiles.children.entries[y].body.setAllowGravity(false);
            projectiles.children.entries[y].body.onWorldBounds = true;
            projectiles_L.push(projectiles.children.entries[y]);        
        }



    //Movement
        arrows = this.input.keyboard.createCursorKeys();
        movementEnabled = false;

        
    //Physics    
        this.physics.add.overlap(player, collectibles, this.markOverlap);
        this.physics.add.overlap(player, projectiles, this.projectileHit);
    //TIMERS
        dodgeTimer = this.time.addEvent({
            delay:1000, 
            callback: this.showMark, 
            loop: true
        });
        dodgeTimer.paused = false;

        let projectileRate = hgGet('options.projectileRate');

        throwTimer = this.time.addEvent({
            delay: projectileRate * 1000, //throw projectile delay, projectile rate. Students should provide in seconds
            callback: ()=>{
                this.throwProjectile(direction, projectileSpeed);
                // this.checkProjectile();
            }, 
            loop: true
        });

        throwTimer.paused = false;
        
        firstStart = false;
        paused = false;
        this.input.keyboard.on('keydown_SPACE', this.pause, this);
        
        //create info panel
        info = new InfoPanel({scene: this});
        info.drawPanel(this.game.canvas.width/8, this.game.canvas.height/4, 3*(this.game.canvas.width/4), 2*(this.game.canvas.height/3), 0x666444, 0.9, true, 5);
        info.addPage(null, gameData.text.about.intro);
        info.addPage(['collectible-0', 'collectible-1'], 'Collect the fish to rescue them from the oil spill');
        info.addPage([ 'projectiles-0', 'projectiles-1', 'projectiles-2'], 'Avoid the trash');
        info.unpause = this.pause;
        
    
    
        //create info panel button            
        var infoButton = this.add.image(75, 75, 'infoButton');
        infoButton.displayWidth = 64;
        infoButton.displayHeight = 64;
        infoButton.setInteractive();
  
        infoButton.on('pointerdown', ()=>{            
            this.pause(direction, projectileSpeed);         
            info.togglePanel();
        })      
        
        quizPanel = new QuizPanel({scene: this});
        quizPanel.drawPanel((this.game.canvas.width/2)-this.game.canvas.width/6, this.game.canvas.height*0.05, this.game.canvas.width/3, this.game.canvas.height * 0.9);
        
        quizPanel.createAnswers();

        //just the button to test out the quiz
        var quizToggle = this.add.rectangle(50, this.game.canvas.height-100, 50, 50, 0xd91ccc);
        quizToggle.setInteractive();
       
       
        quizPanel.setQuestion(gameData.questions.value[1]);
        quizToggle.on('pointerdown', ()=>{
            this.pause(direction);
            var randQuiz = Math.floor(Math.random()*3);
            quizPanel.setQuestion(gameData.questions.value[randQuiz]);
            quizPanel.togglePanel();                      
        })
    }   

    update(){        
        this.playerMove();                  
        //1-10-22 Doesn't seem to actually affect current build. Deprecated?
        // if(info.active){
        //     if(info.close){
        //         console.log('should close the info box');
        //         info.togglePanel();
        //         this.pause();
        //     }
        // }

        // if(quizPanel.active){
        //     if(quizPanel.close){
        //         console.log('close the quiz box');
        //         quizPanel.closePanel();
        //         this.pause();
        //     }
        // }
    }


    pause(_direction){       
        if(!paused){
            throwTimer.paused = true;           
            movementEnabled = false;   
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            paused = true;
        }else{
            throwTimer.paused = false;            
            movementEnabled = true;
      
            paused = false;
        }
        this.freezeProjectile(_direction);
    }



    throwProjectile(_direction){    
        let randNum = Phaser.Math.Between(0, projectiles_L.length-1);       
        
        //this bit can be cleaned up
        if(projectiles_L[randNum].y < 0){
            if(projectiles_L[randNum].texture.key == "projectiles-0"){
                projectiles_L[randNum].setTexture("projectiles-2");
            }else if(projectiles_L[randNum].texture.key == "projectiles-2"){
                projectiles_L[randNum].setTexture("projectiles-1");
            }else if(projectiles_L[randNum].texture.key == "projectiles-1"){
                projectiles_L[randNum].setTexture("projectiles-0");
            }               
        }
        //but later 1-10-2022

        switch(_direction){
            case "down":               
                for(let i=0; i<projectiles_L.length; i++){
                    if(projectiles_L[randNum].y > me.game.canvas.height || projectiles_L[randNum].y < 0){             
                        projectiles_L[randNum].y = -100;
                        projectiles_L[randNum].body.setVelocityY(300);  
                        break;
                    }           
                }
                break;
            case "up": 
                for(let i=0; i<projectiles_L.length; i++){
                    if(projectiles_L[randNum].y < 0 || projectiles_L[randNum].y > me.game.canvas.height){             
                        projectiles_L[randNum].y = me.game.canvas.height+200;
                        projectiles_L[randNum].body.setVelocityY(-300);  
                        break;
                    }           
                }               
                break;
            case "left":              
                if(projectiles_L[randNum].x < 0 || projectiles_L[randNum].x > me.game.canvas.width){             
                    projectiles_L[randNum].x = me.game.canvas.width + 200;
                    projectiles_L[randNum].body.setVelocityX(-300); 
                    break;
                }           
                               
                break;
            case "right":           
                if(projectiles_L[randNum].x > me.game.canvas.width || projectiles_L[randNum].x < 0){             
                    projectiles_L[randNum].x = -200;
                    projectiles_L[randNum].body.setVelocityX(300);
                    break;
                }                                      
                break;
        }
        
        projectiles_L[randNum].body.enable = true;
        projectiles_L[randNum].setVisible(true);

       
    }

    //Deprecated 1-10-2022. Delete after week if nothing breaks
    // checkProjectile(){ //checks for all thrown objects that are past the screen 
        
    //     for(let i=0; i<projectiles_L.length; i++){
    //         if(projectiles_L[i].y > me.game.canvas.height || projectiles_L[i] < 0){                
    //             projectiles_L[i].body.setVelocityY(0);
    //             // projectiles_L[i].y = -100;          

    //         }           
    //     }
    // }

    freezeProjectile(_dir){
        for(let i=0; i<projectiles_L.length; i++){
            if(projectiles_L[i].body.enable){                             
                if(paused){
                    projectiles_L[i].body.setVelocity(0,0);
                }else{
                    switch(_dir){
                        case "up":
                            projectiles_L[i].body.setVelocity(0,-300);
                            break;
                        case "down":
                            projectiles_L[i].body.setVelocity(0,300);
                            break;
                        case "left":
                            projectiles_L[i].body.setVelocity(-300,0);
                            break;
                        case "right":
                            projectiles_L[i].body.setVelocity(300,0);
                            break;
                    }                    
                }               
            }            
        }
    }

    projectileHit(_p, _t){
        _t.body.setVelocityY(0);
        _t.y = -300;
        _t.body.enable = false;      
        _t.setVisible(false);
        score -= 10;
        scoreText.text = "Score: " + score;  

    }

    pauseGame(status){
        dodgeTimer.paused = status;
        throwTimer.paused = status;
        movementEnabled = status;
    }


    playerMove(){
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

            if(player.body.velocity.x != 0 || player.body.velocity.y != 0){
                player.anims.play('move', true);
            }else{
                player.setTexture('player-idle');
            }

        }
    }

    clickStart(){ //should be placed in the create, should probs be a button really
        if(me.game.input.mousePointer.isDown){          
            if(!firstStart){            
                throwTimer.paused = false;
                dodgeTimer.paused = false;
                firstStart = true; 
            }
        }
    }

    startDelay(){
        for(let i=0; i< openMarks.length; i++){
            if(openMarks[i] == undefined){
                console.log("open marks " , openMarks);
            }else{
                openMarks[i].body.enable = false;
            }            
        }
        movementEnabled = true;    
    }

    reOpenMarks(){
        for(let i=0; i < 5; i++){
            openMarks.push(closedMarks[i]);
        }
        closedMarks = [];
    }

    markOverlap(_p, _m){//did you touch the mark
        openMarks.splice(openMarks.indexOf(_m), 1);     
        closedMarks.push(_m);
        _m.body.enable = false;
        dodgeTimer.paused = false;    
        score += 25;
        scoreText.text = "Score: " + score;
        setTimeout(()=>{
            _m.setVisible(false);
        }, 100);
    }


    showMark(){  
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
            me.reOpenMarks();      
            dodgeTimer.paused = false;
        }
    }
}

