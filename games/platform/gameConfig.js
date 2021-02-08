const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gamespace',    
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 360
    },      
    physics: {
        default: 'arcade', 
        arcade: {       
			gravity:{y:300},
            debug: true,
        }
    },
	scene: [MenuScene, GameScene, GameJS],
    backgroundColor: "#4488AA",
};


hgSetupValues(function(){
    const game = new Phaser.Game(config);
});