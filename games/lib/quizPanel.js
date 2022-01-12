class QuizPanel extends Phaser.GameObjects.GameObject {
    //only one of these should exist in the game code. Update using appropriate functions
    //check to close this panel in the update of the game
    constructor(config){
        super(config.scene);
        config.scene.add.existing(this);
        this.x;
        this.y;
        this.width
        this.height;
        this.rect;
        this.panelColor;
        this.panelAlpha;  
        this.questionText;
        this.answers = [];
        this.correctAnswer;
        this.active;
        this.close = false;
        this.previousAnswers = [];
        this.correctText;
        this.incorrectText;
    }

    //ask for orientation 
        //start landscape

    drawPanel(_x, _y, _width, _height, _color = '0xfffffff', _alpha = 1, _rounded = false, _borderRadius=1){
        this.rect = this.scene.add.graphics();
        this.rect.fillStyle(_color, _alpha);
        if(_rounded){
            this.rect.fillRoundedRect(_x, _y, _width, _height, _borderRadius)
        }else{
            this.rect.fillRect(_x, _y, _width, _height);
        }
        //x, y are top left corner
        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.height = _height;
        this.buttonColor = _color;
        this.buttonAlpha = _alpha;   
        this.questionText = this.scene.add.text(this.x+25, this.y+30, "Question Text Question Text Question Text Question Text Question Text", {font: '48px Arial', color:"#000000", wordWrap:{width:_width-50, useAdvancedWrap:true}});
        //read the documentation before you google dummy, below shows how to mask text overflow
        //this.questionText.setCrop(0,0,30, 100);
        this.questionText.setVisible(false);
        this.rect.setVisible(false); 
        this.questionObj;
        this.correctText = this.scene.add.text(this.x+100, this.y + 150, "Correct", {fontFamily:'Arial Black', fontSize:96, color:"#37cc5f"});     
        
        this.incorrectText = this.scene.add.text(this.x+75, this.y + 150, "Incorrect", {fontFamily:'Arial Black', fontSize:96, color:"#cf1800"});
        
        this.correctText.setVisible(false);
        this.incorrectText.setVisible(false);
        
    }

    //can only occur after the drawPanel has been run
    createAnswers(answerCount =4){     
        for(var i=0; i<answerCount; i++){            
            var answerButton = new PlainButton(this);
            var xPos = this.x+25;
            var yPos = ((this.y+this.height/2)+i*125);
            answerButton.setRect(xPos, yPos, this.width-50, 100, 0x58afed, 1, true, 30);    
            this.answers.push(answerButton);
            answerButton.hide();
        }
        
       
        this.answers.forEach((answer) =>{            
            answer.interactRect.on('pointerdown', ()=>{
                this.answerClick(answer);
            })
        });
    }

    answerClick(self){              
        this.disableAnswers();
        if(self.key == this.correctAnswer){
            console.log("Correct Answer, ");    
            self.Highlight();  
            this.correctText.setVisible(true);    
            setTimeout(() => {
                this.previousAnswers = [];     
                this.correctText.setVisible(false);               
                this.close = true;                    
            }, 1500);
        }else{
            console.log("incorrect choice");
            this.incorrectText.setVisible(true);
            setTimeout(()=>{             
                this.previousAnswers.push(self);   
                this.incorrectText.setVisible(false);
                this.enableAnswers();
            }, 1000);
        }       
        
    }
      
    disableAnswers(){
        for(var i=0; i<this.answers.length; i++){           
            this.answers[i].disable();
            this.answers[i].gray();
        }
    }

    enableAnswers(){
        for(var i=0; i<this.answers.length; i++){           
            if(this.previousAnswers.includes(this.answers[i])){
                console.log("already picked ", this.answers[i]);
            }else{
                console.log("enable answer");
                this.answers[i].enable();
                this.answers[i].fill();
            }                       
        }
    }


    setQuestion(_question){
        this.questionObj = _question; //probably unecessary
        this.questionText.text = _question.text;
        this.setAnswers(_question.answers);
        this.correctAnswer = _question.correct;
        this.disableAnswers();
    }


    setAnswers(_answerArray){    
        for(var i=0; i<4; i++){           
            // this.answers[i].text.text="";
            this.answers[i].setText("");
            this.answers[i].key ="";
            if(_answerArray[i] != undefined){
                // this.answers[i].text.text = _answerArray[i].text;   
                this.answers[i].setText(_answerArray[i].text, 34);
                this.answers[i].key = _answerArray[i].key;
                this.answers[i].hide();
            }           
        }
    }


    closePanel(){
        this.rect.setVisible(false);     
        this.active = false;
        this.close = false;
        this.questionText.setVisible(false);
        for(var i=0; i<this.answers.length; i++){                
            this.answers[i].hide();       
            this.answers[i].disable();        
        }
    }

    openPanel(){
        this.enableAnswers();
        this.rect.setVisible(true);    
        this.activePage = 0;    //needed? 5-18    
        this.active = true;
        this.questionText.setVisible(true);
        for(var i=0; i<this.answers.length; i++){             
            if(this.answers[i].key ===""){
                this.answers[i].hide();
                this.answers[i].disable();                 
            }else{                 
               this.answers[i].show();
               this.answers[i].enable();
            }             
       }
    }

    
    togglePanel(){
        if(this.rect.visible){
            this.rect.setVisible(false);     
             this.active = false;
             this.close = false;
             this.questionText.setVisible(false);
             for(var i=0; i<this.answers.length; i++){                
                 this.answers[i].hide();       
                 this.answers[i].disable();        
             }
        }else{
             this.rect.setVisible(true);    
             this.activePage = 0;        
             this.active = true;
             this.questionText.setVisible(true);
             for(var i=0; i<this.answers.length; i++){  
                 //clean this up
                 if(this.answers[i].key ===""){
                     this.answers[i].hide();
                     this.answers[i].disable();                 
                 }else{                 
                    this.answers[i].show();
                    this.answers[i].enable();
                 }             
            }
        }
     }
}