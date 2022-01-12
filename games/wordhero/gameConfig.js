const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gamespace',    
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },      
    physics: {
        default: 'arcade', 
        arcade: {       
			gravity:{y:700},
            debug: true
        }
    },
	scene: [GameJS],
    backgroundColor: "#4a0b06",
};


hgSetupValues(function(){
    const game = new Phaser.Game(config);
});