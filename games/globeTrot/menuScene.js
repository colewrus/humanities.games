class MenuScene extends Phaser.Scene{
	
	constructor(){
		super('MenuScene');
	}
	
	preload(){
		for( var audioID in gameData.sounds){			
			var audioAsset = hgGet('sounds.' + audioID);
			if(audioAsset != null){
				this.load.audio(audioID, audioAsset);				
			}else{
				console.log("Audio preload whoop " + audioID);
			}
		}
		
	}
	
	create(){		
		let me = this;

		// music.play();
		

		//Title 
		console.log(gameData.text.title);

		let titleText = this.add.text(990, 150, ""+gameData.text.title, {font:'124px Arial', color:"#EEECCC", wordWrap: {width: 900}, align: 'center'});
		titleText.setOrigin(0.5);
		titleText.setStroke("#000000", 5);

		//this will be the animated start button that uses graphics rather than an object
		let gStart = this.add.graphics();		
		gStart.fillStyle(0x0056B3, 1);		
		gStart.fillRoundedRect(780, -150, 400, 150, 32);

		//we'll create an object that can actually be interacted with
		let start = this.add.rectangle(980, 415, 400, 150, 0xffffff, 0);

		//animate the start button down
		let tween = this.tweens.add({
			targets: gStart,
			duration: 200,
			delay: 500,
			x: 0,
			y:490,
			onComplete: () => {
				let button = this.add.text(980,385,'Start Game',{
							align:'center',
							fill: '#EEECCC',
							font: '49px Arial',							
				}).setOrigin(0.5, 0);	
				button.setShadow(4,2, "#333333", 2, false, true);
				start.setInteractive(); //we make the shape object interactable
			}
		})
				

		
		//shape object to start the game
		start.on('pointerdown', ()=>{			
			this.scene.switch('GameJS');
		})	
	}
}


