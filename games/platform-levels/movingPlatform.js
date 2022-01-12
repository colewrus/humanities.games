class MovingPlatform extends Phaser.Physics.Arcade.Sprite{
	constructor(scene, x, y, key){
		
		
		super(scene, x, y, key);
		//config.scene.add.existing(this);

		this.path = new Phaser.Curves.Line([x, y, x+200, y]);
		console.log(this);
		
        this.pathIndex = 0;
        this.pathSpeed = 0.01;
        this.pathVector = new Phaser.Math.Vector2();
		console.log(this.pathVector , " vector");
        this.path.getPoint(0, this.pathVector);

        this.setPosition(this.pathVector.x, this.pathVector.y);
		this.dir = 0; //0 is right, 1 is left
	}
	
	preUpdate(time, delta){
		this.path.getPoint(this.pathIndex, this.pathVector);
		this.setPosition(this.pathVector.x, this.pathVector.y);

		if(this.dir == 0){
			this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
			if(this.pathIndex > 0.9)
				this.dir = 1;
		}else{
			this.pathIndex = Phaser.Math.Wrap(this.pathIndex - this.pathSpeed, 0, 1);
			if(this.pathIndex < 0.1)
				this.dir = 0;
		}
		
	}

		
}