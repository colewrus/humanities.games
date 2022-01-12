window.onorientationchange = function(event){
    // console.log("Screen orientation " , event.target.screen.orientation);
}
//screen scaling controls
var firstRunLandscape;

var buttonPadding = 10;
var options = [];
var timer;
var progressRect, progressMax, progressCurrent, progressY;
var associateText;

var timerActive;

var library, answerBank, used;
var activeCard;//what is the card being presented;

var score, scoreText;
var firstLoad;

class GameJS extends Phaser.Scene{

  
	constructor(){
		super({key:'GameJS'});
	}

    preload(){
  
    }

    create(){

        library = hgGet("options.associations");
       
        answerBank = [];
        library.forEach((lib)=>{            
            answerBank.push(lib.answer);
        });        

        console.log("Device info " , this.scene.scene.sys.game.device.os);
        console.log("create begin");
        firstLoad = false;
        //mostly symbolic area
        let playArea = this.add.rectangle(this.game.canvas.width/2, (this.game.canvas.height/4)+50, this.game.canvas.width-100, (this.game.canvas.height/2) - 100, 0xaaafff, 0.3);
        //text with a 30 character wrapping to fit, maybe make a mask to be extra careful
        associateText = this.add.text(75, (this.game.canvas.height/4)-50, "", {font: '54px Arial', fill: '#000000', wordWrap:{width: this.game.canvas.width-125, useAdvancedWrap:true}});
      
        
        //set the progress bar and the timer  
        progressMax = this.game.canvas.width-100;
        progressCurrent = progressMax;
        progressY = (this.game.canvas.height/2);
      
        progressRect = this.add.rectangle(this.game.canvas.width/2, progressY+50, progressMax, 50, 0xe62222, 1);
        let progressOutline = this.add.graphics();
        progressOutline.lineStyle(15, 0x000000, 1);
        progressOutline.strokeRoundedRect(progressRect.x-progressMax/2-5, progressRect.y-progressRect.height/2, progressMax+10, 50);

        var speed = hgGet("options.speed");
        //the main timer
        timer = this.time.addEvent({
            delay: speed,
            callback: ()=>{
                progressCurrent -= (progressMax/50);
                if(progressCurrent >= 0){            
                    progressRect.width = progressCurrent;
                }else{                               
                    this.timeOut();
                }            
            },
            loop: true,
            paused: true
        });  
//TOOT TOOT DELETE THIS AREA FOR LIVE CODE

        //Testing button to fire whatever we need
        // var testButton = this.add.rectangle(30, 30, 45, 45, 0xec42f5, 1);
        // testButton.setInteractive();
        // testButton.on('pointerdown', ()=>{
        //     let rand = Math.floor(Math.random() * library.length);   
        //     // this.setRound(library[rand]);
        //     console.log("test button clicked");
        //     this.timerOn();

        // })

        var pauseButton = this.add.rectangle(this.game.canvas.width - 30, 30, 45, 45, 0xbcd991, 1);
        pauseButton.setInteractive();
        pauseButton.on('pointerdown', ()=>{
            this.pause();
        })

        let pline1 = this.add.graphics();
        pline1.lineStyle(8, 0xffffff, 1);
        pline1.lineBetween(this.game.canvas.width - 20, 15, this.game.canvas.width - 20, 45);
        let pline2 = this.add.graphics();
        pline2.lineStyle(8, 0xffffff, 1);
        pline2.lineBetween(this.game.canvas.width - 40, 15, this.game.canvas.width - 40, 45);

        //build the buttons below
//TOOT TOOT

        //build the scoreboard
        score = 0;
        var scoreBkg = this.add.graphics();
        scoreBkg.fillStyle(0x735e39, 1);
        
        let scoreBkgWidth = this.game.canvas.width/3;
        let scoreX = (this.game.canvas.width/2)-scoreBkgWidth/2;
        scoreBkg.fillRoundedRect(scoreX, 10, scoreBkgWidth, 75);
        let scorePadding = 15;
        scoreText = this.add.text(scoreX+scorePadding, 10+scorePadding, "Start", {font: '40px Arial', color:'#ffffff', wordWrap:{width: scoreBkgWidth-scorePadding, useAdvancedWrap:true}});
        let startButton = this.add.rectangle(scoreX+scoreBkgWidth/2, 45, scoreBkgWidth, 75, 0x000000, 0);
        startButton.setInteractive();
        startButton.on('pointerdown', ()=>{
            if(!firstLoad){
                this.setRound(library[1]);
                timer.paused = false;                    
                scoreText.text = ""  + score;  
                firstLoad = true;
            }            
        });


        //end scoreboard

        //option buttons
        var optionA = new PlainButton({scene: this});
        optionA.setRect((this.game.canvas.width/8), progressY+150, (this.game.canvas.width/4)*3, 100, 0x397356, 1, true, 15);
        // optionA.setText("");

        var optionB = new PlainButton({scene: this});
        optionB.setRect((this.game.canvas.width/8), optionA.y+150, (this.game.canvas.width/4)*3, 100, 0x397356, 1, true, 15);
        // optionB.setText("");

        var optionC = new PlainButton({scene: this});
        optionC.setRect((this.game.canvas.width/8), optionB.y+150, (this.game.canvas.width/4)*3, 100, 0x397356, 1, true, 15); 
        // optionC.setText("");
        

        options.push(optionA, optionB, optionC);
        options.forEach((option) =>{
            option.interactRect.on('pointerdown', ()=>{                
                this.buttonClick(option);
            })
        });              

        // this.setRound(library[1]);
        
    }//end of create
    

    buttonClick(self){
        timer.paused = true;             
        if(self.correct){
            console.log("correct");
            score += 1;
            scoreText.text = " "  + score;
            this.time.addEvent({
                delay: 300,
                callback: ()=>{
                    let rand = Math.floor(Math.random() * library.length);   
                    this.setRound(library[rand]);
                    this.timerOn();
                }
            })  
        }else{
            console.log("incorrect");
            self.disable();   
            score -= 1;     
            scoreText.text = ""  + score;  
            this.time.addEvent({
                delay: 300,
                callback: () => {
                    timer.paused = false;
                }
            })
        }
    }


    timeOut(){   
        score -= 1;     
        scoreText.text = ""  + score;  
        progressRect.width = 0;  
        timer.paused = true;               
        for(var i=0; i<options.length; i++){     
            options[i].disable();       
            if(options[i]._text !== activeCard.answer){                
                options[i].gray();
            }else{
                options[i].Highlight('0xf0f266');               
            }
        }
        //event to then repopulate the fields 
        this.time.addEvent({
            delay: 1500,
            callback: ()=>{
                let rand = Math.floor(Math.random() * library.length);   
                this.setRound(library[rand]);
                this.timerOn();
            }
        })              
    }

    pause(){
        timer.paused = !timer.paused;
    }

    timerOn(){
        this.time.addEvent({
            delay: 500,
            callback: ()=>{
                console.log("timer delay ended, begin timer");
                timer.paused = false;
            },
            callbackScope: this
        });
        progressRect.width = progressMax;
        progressCurrent = progressMax;        
    }




    setRound(card){
        activeCard = card;
        let question = card.question;
        associateText.text = question;
        let answer = card.answer;
        associateText.text = card.question;
        this.shuffle(answerBank);
        
        let buttons =0;
        let modifier = 0;
        //turn this into a for loop
        while(buttons !== options.length){            
            if(answerBank[buttons] == answer){
                modifier +=1;               
                options[buttons].setText(answerBank[buttons+modifier]);
                //make sure button has a false property
                options[buttons].correct = false;
            }else{               
                options[buttons].setText(answerBank[buttons+modifier]);
                //make sure button has a false property
                options[buttons].correct = false;
            }
            options[buttons].show(); //un-gray the buttons
            options[buttons].enable();          
            options[buttons].hideHighlight();            
            buttons += 1;
        }
        //random number between 1-3 for setting the button to hold the right answer
        let correct = Phaser.Math.Between(0,2);
        options[correct].setText(answer); //set this after assigning the buttons so the answer is guaranteed a spot  
        options[correct].correct = true; //make this the correct one.         
    }

    shuffle(lib){
        let currentIndex = lib.length-1, temporaryValue, randomIndex;        
        while(0 !== currentIndex){
            randomIndex = Math.floor(Math.random() * currentIndex);            
            temporaryValue = lib[currentIndex];       
            lib[currentIndex] = lib[randomIndex];
            lib[randomIndex] = temporaryValue;
            currentIndex -= 1;
        }
    }

    setScoreboard(value){

    }


   

}