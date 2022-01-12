class GameScene extends Phaser.Scene{
	
	constructor(){
		super({key: 'Scene1'});			
	}
	
	preload(){		
		for( var imageID in gameData.images ) {		
			var asset = hgGet( 'images.' + imageID );
			if( asset != null ) {							
				this.load.image( imageID, asset );		
				
			} else {
				// Shouldn't happen but we should display a whoops. 
				console.log("image preload whoops " + imageID );
			}
		}			
	}
	
	
	create(){
		console.log("game scene loads");	
		var order = hgGet( 'options.levelOrder' );
		if( order != null ) {
			console.log( 'order', order );
			//this runs the actual game controls 
			this.scene.start('GameJS', {levels: order, level: 0});
		}	
	}
	


}


//look for different preload types images, sound
//hgfecth will output value and type
//can we establish the object at the window level rather than through phaser