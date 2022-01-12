class loudSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, _key){
        super(scene, x, y, _key);    
              
        this.setPosition(x,y);
    }

    getLoud(v){
        console.log("got loud " , v);
    }
}