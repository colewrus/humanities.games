let levelOne = {
	val: 1,
	staticPlatforms: [
		{
			x: 160,
			y: 380,
			width: 600,
			height: 64,
			_key: 'box'
		},
		{
			x: 660,
			y: 380,
			width: 256,
			height: 64,
			_key: 'box'
		}, 
		{
			x: 920,
			y: 280,
			width: 128,
			height: 64,
			_key: 'box'
		},
		{
			x: 1150,
			y: 280,
			width: 128,
			height: 64,
			_key: 'box'
		}, 
		{
			x: 1375,
			y: 200,
			width: 128,
			height: 64,
			_key: 'box'
		},
	],
	movingPlatforms:[
		{
			x:600,
			y:350,
			_key: 'box', 
			xTween: 250, //how far it should move
			yTween: 0,
			duration: 2000,
			ease: 'Power2',
			yoyo: true,
			delay: 500,
			xVel: 50,
		}
	],	
	collectibles: [
		{
			name: "Scroll",
			_text: "Hey I'm the first scroll, good job",
			x: 1375,
			y: 150,
			_key: "scroll",
			
		}	
	]	
}

let levelTwo = {
	val: 2,
	staticPlatforms: [
		{
			x: 60,
			y: 480,
			width: 600,
			height: 64,
			_key: 'box'
		},
		{
			x: 660,
			y: 480,
			width: 256,
			height: 64,
			_key: 'box'
		}, 
		{
			x: 920,
			y: 380,
			width: 128,
			height: 64,
			_key: 'box'
		},
		{
			x: 1150,
			y: 280,
			width: 128,
			height: 64,
			_key: 'box'
		}, 
		{
			x: 1375,
			y: 200,
			width: 128,
			height: 64,
			_key: 'box'
		},
	],	
	collectibles: [
		{
			name: "Scroll",
			_text: "Hey I'm the first scroll, good job",
			x: 1375,
			y: 150,
			_key: "scroll",
			
		}	
	],
	movingPlatforms:[
		{
			x:600,
			y:350,
			_key: 'box', 
			xTween: 250, //how far it should move
			yTween: 0,
			duration: 2000,
			ease: 'Power2',
			yoyo: true,
			delay: 500			
		}
	],
	movingColliders:[
	
	]
}