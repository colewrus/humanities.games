const Levels = 
	{ "level1":{	num: 1, 
		name: "Simple lvl 1",	
		worldSize: {x: 1920, y:1080},
		startPos: {x: 160, y: 600},
		staticPlatforms: [
			{
				x: 960,
				y: 952,
				width: 1920,
				height: 256,
				_key: 'staticPlatform'
			},	
			{
				x: 960,
				y: 696,
				width: 256,
				height: 256,
				_key: 'staticPlatform'
			}
		],		
		collectibles: [
			{
				name: "Scroll",				
				x: 1700,
				y: 650,
				_key: "collectible_1",				
			}	
		],	
	 },
	 
	 "level2": {	num:2,
		name: "Simple lvl 2",		
		worldSize: {x: 2640, y:1080},
		startPos: {x: 160, y: 750},
		traps: [
			{
				x:896,
				y:840,
				width: 256,
				height: 256,
				_key: 'trap'
			},
			{
				x:1408,
				y:840,
				width: 256,
				height: 256,
				_key: 'trap'
			}
		],	
		staticPlatforms: [
			{
				x:1320,
				y:1080,
				width:2640,
				height: 256,
				_key: 'staticPlatform'
			},
			{
				x:640,
				y:828,
				width:256,
				height:256,
				_key:'staticPlatform'
			},
			{
				x:1152,
				y: 710, 
				width: 256,
				height: 512,
				_key: 'staticPlatform'
			},
			{
				x: 1664,
				y:828,
				width:256,
				height:256,
				_key:'staticPlatform'
			}
		],	
		collectibles: [
			{
				name: "Scroll",
				_text: "Hey I'm the second scroll, good job\nClick to Continue",
				x: 2225,
				y: 550,
				_key: "collectible",				
			}	
		]
	 },
	 "level3": {
		num: 3,
		name: "Simple Level 3",
		worldSize: {x: 3000, y:1080},
		startPos: {x: 260, y: 650},
		staticPlatforms: [
			{
				x:512,
				y:952,
				width:1024,
				height: 256,
				_key: 'staticPlatform'
			},
			{
				x:2278,
				y:952,
				width: 1500, 
				height: 256,
				_key: 'staticPlatform'
			},
			{
				x:1275,
				y: 605,
				width: 256,
				height: 128,
				_key:'staticPlatform'
			},		
		],
		traps: [
			{
				x:1272,
				y:975,
				width: 512,
				height: 256,
				_key: 'trap'
			},
		],
		projectile: [
			{
				x:2400,
				y:200,		
				_key: 'projectile', 
				xTween: 300, //how far it should move				
				duration: 5000,
				ease: 'Linear',
				yoyo: true,
				hold: 500,
				repeat: -1,
				flipX: true,
				frames: ['projectile_1', 'projectile_2']
			}
		],
		collectibles: [
			{
				name: "Scroll",
				_text: "Hey I'm the third scroll, good job\nClick to Continue",
				x: 2575,
				y: 450,
				_key: "collectible",				
			}	
		]
	 },
	 "level4": {
		name: "Simple Level 4",
		worldSize: {x: 4608, y:1792},
		startPos: {x: 260, y: 300},
		staticPlatforms: [
			{
				x: 4483,
				y: 896,
				width: 256,
				height: 1792,
				_key: 'staticPlatform'
			},
			{
				x:512,
				y:640,
				width: 1024,
				height: 256,
				_key:'staticPlatform'
			},
			{
				x: 2816,
				y: 640,
				width: 1792,
				height: 256,
				_key: 'staticPlatform'
			},
			{
				x: 640,
				y: 1664,
				width: 1280,
				height: 256,
				_key: 'staticPlatform'
			},
			{
				x: 1664,
				y: 1664,
				width: 256,
				height: 256,
				_key: 'staticPlatform'
			},
			{
				x: 2304,
				y: 1664,
				width: 512,
				height: 256,
				_key: 'staticPlatform'
			},
			{
				x: 2944,
				y: 1664,
				width: 256,
				height: 256,
				_key: 'staticPlatform'
			},
			{
				x: 3968,
				y: 1664,
				width: 1280,
				height: 256,
				_key: 'staticPlatform'
			}
		],	
		traps: [
			{
				x:1408,
				y:1674,
				width: 256,
				height: 256,
				_key: 'trap'
			},
			{
				x:1920,
				y:1674,
				width: 256,
				height: 256,
				_key: 'trap'
			},{
				x: 2688,
				y:1674,
				width: 256,
				height: 256,
				_key: 'trap'
			},
			{
				x: 3200,
				y: 1674,
				width: 256,
				height: 256,
				_key: 'trap'
			}
		],
		collectibles: [
			{
				name: "Scroll",
				_text: "testing",
				x: 2048, 
				y: 384,
				_key: "collectible"
			}
		],
		jumpThrough: [
			{
				x: 3968,
				y: 1152,		
				width: 768,
				height: 256,		
				_key: 'jumpThrough'
			},
			{
				x: 3968, 
				y: 832,
				width: 768,
				height: 256,
				_key: 'jumpThrough'
			},
			{
				x: 3968, 
				y: 512,
				width: 768,
				height: 256,
				_key: 'jumpThrough'
			}
		]
	 }
		
	}	


