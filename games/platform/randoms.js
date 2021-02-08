	/*
	Code from testin, it works, sorta
		path = new Phaser.Curves.Line([400, 300, 500, 300]);
		
		var platforms = this.add.follower(path, 400, 300, 'tomato');
		this.physics.add.existing(platforms);
		
		platforms.body.setImmovable(true);
		platforms.body.allowGravity = false;
		console.log(platforms);
		platforms.startFollow({
			duration: 5000, 
			yoyo: true,
			repeat: -1,
			onUpdate: function(){
				platforms.body.velocity.copy(platforms.pathDelta);
			}
		});
	
		this.physics.add.collider(player, platforms, function(_player, _platform){
			console.log("Player velocity " + _player.body.velocity.x);
			player.body.position.x += _platform.body.velocity.x;
		});
	*/
	
			/*
		//level storage for long term can go into localStorage
		if(localStorage.getItem('Level') === null){
			let thisLevel = levelOne;		
			localStorage.setItem('Level', JSON.stringify(thisLevel));	
			this.loadLevel(levelOne);			
		}else{			
			if(level.val == 1){
				this.loadLevel(levelOne);
			}else if(level == 2){
				this.loadLevel(levelTwo);
			}else{
				localStorage.clear();
				console.log("purging local storage");
			}
			
		}
		*/
		/* fade control, neat
		this.cameras.main.once('camerafadeincomplete', function (camera) {
            camera.fadeOut(6000);
        });

        this.cameras.main.fadeIn(6000);
		*/
		
			
	addPlatforms(obj){
		console.log("add platforms");
		let _t = me.physics.add.image(obj.x, obj.y, obj._key);
		_t.body.allowGravity = false;
		_t.setImmovable(true);
		_t.setScale(0.5, 0.2);
		_t.setFriction(1);
		me.tweens.add({
			targets: _t,
			x: obj.xTween,
			y: obj.yTween, 
			duration: obj.duration,
			//ease: obj.ease,
			onStart: function(){_t.body.setVelocityX(50)},
			yoyo: obj.yoyo,
			onYoyo: function(){ _t.body.setVelocityX(_t.body.velocity.x*-1);},
			delay: obj.delay,
			loop: obj.loop,	
		})		
		me.physics.add.collider(player, _t, function(){
			if(player.body.blocked.down){
				console.log("butt blocked, t velocity " , _t.body.velocity);			
			}
		});
	}
	