// console.log("DPR " , window.devicePixelRatio);
// console.log("Inner Width " , window.innerWidth);
// console.log("Inner Height " , window.innerHeight);

const config = {
    type: Phaser.CANVAS,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gamespace',    
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280
    },      
    physics: {
        default: 'arcade', 
        arcade: {       
			gravity:{y:0},
            debug: false
        }
    },
	scene: [GameJS],
    backgroundColor: "#4488AA",
};


hgSetupValues(function(){
    const game = new Phaser.Game(config);
});