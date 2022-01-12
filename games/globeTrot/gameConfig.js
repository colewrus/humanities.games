
const config = {
    type: Phaser.CANVAS,
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
            gravity: {y:300},
            // debug: true,
        }
    },
    scene: [MenuScene, GameJS],
    backgroundColor: "#4488AA",
};

hgSetupValues(function(){
    const game = new Phaser.Game(config);
});