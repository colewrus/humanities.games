var IS_TOUCH = false;

window.addEventListener('touchstart', function(){
	if(!IS_TOUCH){
		IS_TOUCH = true;		
	}	
});

var buttons = [];
var player;
var score;
var notes = [];
var scoreboard;
var words = [];
class GameJS extends Phaser.Scene{
	
	constructor(){
		super({key:'GameJS'});
	}	

    preload(){
        for( var imageID in gameData.images ) {		
			var asset = hgGet( 'images.' + imageID );
			if( asset != null ) {							
				this.load.image( imageID, asset );		
				console.log("added " , imageID , " at " , asset);	
			} else {
				// Shouldn't happen but we should display a whoops. 
				console.log("image preload whoops " + imageID );
			}
		}	
    }
	
	create(){
        
        var playCeil = 0;
        score = 0;
        scoreboard = this.add.text(this.game.canvas.width - 500, 0, "Score: " + score, {font:'64px Georgia', color:'#000000'});
        for(var i=0; i<4; i++){
            var tempLine = this.add.graphics();
            tempLine.lineStyle(200, 0xffffff, 1);
            tempLine.lineBetween(300, playCeil+140+(this.game.canvas.height/4)*i, this.game.canvas.width, playCeil+140+(this.game.canvas.height/4)*i);           
            
            var tempWord = this.add.text(this.game.canvas.width/2, playCeil+70+(this.game.canvas.height/4)*i, "Test " + i, {font:'64px Georgia', color:'#000000'});
            var tempButton = new PlainButton({scene: this});            
            tempButton.setRect(50,playCeil+10+(this.game.canvas.height/4)*i, 256, 250, 0x5aabe6, 1, true, 15);                  
          
            buttons.push(tempButton);            
            
        }
       

        player = this.physics.add.sprite(buttons[0].x+buttons[0].width/2, buttons[0].y+buttons[0].height/2, 'player-idle');
        player.body.setAllowGravity(false);
        
        
        for(var i=0; i<4; i++){
            var tempNote = new Note(this, this.game.canvas.width - 300, 256*i+150, 'collectible');        
  
            notes.push(tempNote);
        }

       
        this.physics.add.overlap(player, notes, this.collect);


    }

    update(){        

    }

    collect(_p, _n){
        console.log("overlap player " , _n);
        _n.body.enable = false;
        _n.setVisible(false);
        score += 1;
        scoreboard.text = "Score: " + score;
    }

  



}