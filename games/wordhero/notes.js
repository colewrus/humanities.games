class Note extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, key){	
		
		super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.count;
        this.children = [];
        this.stageX;
        this.stageY;
    }

    setStaging(x, y){
        this.stageX = x;
        this.stageY = y;
        this.x = x;
        this.y = y;
    }
    
    returnStaging(){
        this.x = this.stageX;
        this.y = this.stageY;
    }
    send(speedX, speedY,lifespan=5000){
        this.body.setVelocity(speedX, speedY);
        
        setTimeout(()=>{
            if(player.body.velocity.y < 0){
                player.setVelocityY(0);
            }
        }, lifespan);
    }

    sleep(){
        this.body.enable = false;
        this.body.setVelocity(0);
    }


}