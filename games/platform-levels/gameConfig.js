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
            debug: false
        }
    },
	scene: [MenuScene, GameScene, GameJS],
    backgroundColor: "#4488AA",
};


hgSetupValues(function(){
    const game = new Phaser.Game(config);
});