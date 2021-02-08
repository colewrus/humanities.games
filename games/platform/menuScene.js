
var graphics;

class MenuScene extends Phaser.Scene{
	
	constructor(){
		super('MenuScene');
	}
	
	preload(){
		
	}
	
	create(){		
	
		graphics = this.add.graphics();
		
		graphics.fillStyle(0x0056B3, 1);
		
		graphics.fillRoundedRect(160, 20, 400, 150, 32);
		//this.add.rectangle(360, 120,400, 150, 0x0056B3);
	
		this.add.text(360,60,'Menu Screen',{
					align:'center',
					fill: '#EEECCC',
					fontFamily: 'sans-serif',
					fontSize: 49,
				}).setOrigin(0.5, 0);		
		console.log("menu scene loads");	
	
		
		this.input.once('pointerdown', function(){			
			this.scene.switch('Scene1');
		}, this);
	}
	

}