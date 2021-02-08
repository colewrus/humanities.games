class GameScene extends Phaser.Scene{
	
	constructor(){
		super({key: 'Scene1'});			
	}
	
	preload(){
		this.load.image('player', 'assets/will-pose.png');
		this.load.image('box', 'assets/128-box.png');
		this.load.image('scroll', 'assets/blank-scroll.png');
		this.load.image('tomato', 'assets/tomato.png');
		this.load.image('panel_500_300', 'assets/text-panel-500-300.png');		
	}
	
	
	create(){		

		console.log("game scene loads");	
	
		//this runs the actual game controls 
		this.scene.start('GameJS', {level: 0});
	}
	


}


//look for different preload types images, sound
//hgfecth will output value and type
//can we establish the object at the window level rather than through phaser