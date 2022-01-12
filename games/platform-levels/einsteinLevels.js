const Levels = {
    "level1":{
        num: 1,
        name: "Einstein Level 1",
		worldSize: {x: 2640, y:1080},
		startPos: {x: 160, y: 750},
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
				name: "Note in a bottle",
				_text: "\nClick to Continue",
				x: 2225,
				y: 550,
				_key: "collectible",				
			}	
		]
    },
    "level2":{
        num:2,
        name: "Einstein Level 2",
        worldSize:{x:4608, y:1792},
        startPos:{x:384, y:1280},
        staticPlatforms:[
            {
				x:2304,
				y:1664,
				width:4608,
				height: 256,
				_key: 'staticPlatform'
			},
            {
                x:1152,
                y:1408,
                width:256,
                height: 256, 
                _key: 'staticPlatform'
            },
            {
                x:1918,
                y:1154,
                width:1280,
                height: 256, 
                _key: 'staticPlatform'
            },
            {
                x:3576,
                y:1154,
                width:1024,
                height: 256, 
                _key: 'staticPlatform'
            }
        ],
		jumpThrough:[
			{
				x: 4184,
				y:1247,
				width: 256,
				height: 64,
				_key:'jumpThrough'
			}
		],
        collectibles:[
            {
                name: "Note in a bottle",
				_text: "\nClick to Continue",
				x: 3968,
				y: 898,
				_key: "collectible",
            }
        ]
    },
    "level3":{
        num: 3,
        name: "Einstein Level 3",
		worldSize: {x: 4864, y:1792},
		startPos: {x: 160, y: 1250},
        staticPlatforms:[
            {
                x:2432,
				y:1664,
				width:4864,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:896,
				y:1408,
				width:256,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:1408,
				y:1280,
				width:256,
				height: 512,
				_key: 'staticPlatform'
            },
            {
                x:1920,
				y:1152,
				width:256,
				height: 768,
				_key: 'staticPlatform'
            },
            {
                x:3328,
				y:896,
				width:1536,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:4480,
				y:896,
				width:256,
				height: 256,
				_key: 'staticPlatform'
            }
        ],
		traps:[
			{
				x: 1664, 
				y: 1450,
				width:256,
				height: 256,
				_key: 'trap'
            }
		],	
		jumpThrough: [
			{
				x: 4224,
				y: 896,		
				width: 256,
				height: 256,		
				_key: 'jumpThrough'
			},
			{
				x:4224,
				y:1160,
				width: 256,
				height:256,
				_key:'jumpThrough'
			}
		],	
        collectibles:[
            {
                name: "Note in a bottle",
				_text: "\nClick to Continue",
				x: 4480,
				y: 640,
				_key: "collectible",
            }
        ]
    },
    "level4":{
        num: 4,
        name: "Einstein Level 4",
        worldSize: {x: 4864, y:1792},
		startPos: {x: 160, y: 1250},
        staticPlatforms:[
            {
                x:2432,
				y:1664,
				width:4864,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:1152,
				y:1408,
				width:256,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:1664,
				y:1152,
				width:256,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:2176,
				y:896,
				width:768,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:2688,
				y:640,
				width:256,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:2816,
				y:1152,
				width:512,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:3712,
				y:640,
				width:1280,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:3968,
				y:1152,
				width:256,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:4608,
				y:1152,
				width:512,
				height: 256,
				_key: 'staticPlatform'
            },
            {
                x:4736,
				y:896,
				width:256,
				height: 1792,
				_key: 'staticPlatform'
            }            
        ],
		collectibles:[
            {
                name: "Note in a bottle",
				_text: "\nClick to Continue",
				x: 4480,
				y: 640,
				_key: "collectible",
            }
        ]
    }
        
}