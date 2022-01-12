class JumpThrough extends Phaser.GameObjects.TileSprite{
    constructor(scene, x, y, width, height, texture){
        super(scene, x, y, width, height, texture);
        scene.add.existing(this);
        scene.physics.world.enable(this);        
        this.body.setImmovable(true);
        this.body.checkCollision.down = false;
        this.body.allowGravity = false;
    }    

}