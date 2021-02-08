const Levels = 
	[{	num: 1, 
		name: "Simple lvl 1",
		startPos: {x: 160, y: 250},
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
		collectibles: [
			{
				name: "Scroll",
				_text: "Hey I'm the first scroll, good job\nClick to Continue",
				x: 1375,
				y: 105,
				_key: "scroll",				
			}	
		],
		movingPlatforms:[
		{
			x:600,
			y:300,		
			_key: 'box', 
			xTween: 250, //how far it should move
			yTween: 300,
			duration: 2000,
			ease: 'Power2',
			yoyo: true,
			delay: 500,
			loop: -1,
			xVelocity: 50,
		}
	]
	 },
	 
	 {	num:2,
		name: "Simple lvl 2",		
		startPos: {x: 160, y: 350},
		staticPlatforms: [
			{
				x:720,
				y:480,
				width:1440,
				height: 128,
				_key: 'box'
			},
			{
				x:472,
				y:352,
				width:128,
				height:128,
				_key:'box'
			},
			{
				x:720,
				y: 290, 
				width: 124,
				height: 248,
				_key: 'box'
			},
			{
				x: 968,
				y:352,
				width:128,
				height:128,
				_key:'box'
			}
		],		
		collectibles: [
			{
				name: "Scroll",
				_text: "Hey I'm the second scroll, good job\nClick to Continue",
				x: 1375,
				y: 350,
				_key: "scroll",				
			}	
		]
	 },
	 {
		num: 3,
		name: "Simple Level 3",
		startPos: {x: 160, y: 350},
		staticPlatforms: [
			{
				x:720,
				y:480,
				width:1440,
				height: 128,
				_key: 'box'
			}
		],
		collectibles: [
			{
				name: "Scroll",
				_text: "Hey I'm the third scroll, good job\nClick to Continue",
				x: 1375,
				y: 250,
				_key: "scroll",				
			}	
		]
	 }
		
	]	


