// JavaScript source code
 
		var gameRoot = '';

        //how do we determine that the word is correct? 
            //bonus for collecting a specific type or category
            //generic catch-all "valid"? 
        var words = [
            {name: 'Ajax', category: 'greek-myth', type: 'hero', valid: true, caught: false},
            {name: 'Odin', category: 'norse-myth', type:'god', valid: true, caught: false},
            {name: 'Anubis', category: 'egypt-myth', type: 'god', valid: true, caught: false },
            {name: 'Gandalf', category: 'fiction', type:'hero', valid:false, caught: false},
            {name: 'Mjolnir', category: 'norse-myth', type:'item', valid: true, caught: false},
			{name: 'Voldemort', category: 'fiction', type:'character', valid: false, caught: false},
			{name: 'Katniss Everdeen', category: 'fiction', type:'hero', valid:false, caught: false},
            {name: 'Harry Potter', category: 'fiction', type: 'hero', valid: false, caught: false}
        ]
        
        //Evaluation tools
        var score = 0; //text and
        var bonus; //do a streak modifier
        var streak; //just a raw count of how many in a row
        
        var prompt; //turn this into a key pair for the data key and it's value, used to check for if a player got the prompt right
            //prompts could also be hint. "the hammer of Thor" 
		var promptCat, promptType; //variables to compary against both category and type (maybe don't use)')
        
        var wordBoxes = new Array();//array of the actual DOM elements so we can topToBot and compare
        
        var rate; //how often are we sending a wordBox down
        var dropBoxes; //interval variable for dropping the words
		
		var paddlePos; //int to hold the position of the paddle

		var activeBoxes = [];
		var activeValues = []; // to avoid duplicates when sending words
        var possibleValues = []; //for the value of item in the words list
        var possibleBoxes = []; //value for the div


		$(window).on('load', function(){
            paddlePos = 0;	
		
			
			setBoxes();

	
            
			setPossibleValues(words, possibleValues);
           
            sendWords();
		});
		

       //Paddle controls     
        window.addEventListener('keydown', function(e){            
            if(event.keyCode == 40){//down key         
                if(paddlePos > 0){
                    paddlePos--;
                    let tempPos = 2+(7.5*paddlePos);
                    $('#paddle').animate({
                        bottom: tempPos+'vw'
                    }, 250); 
                }    
            }            
            
            if(event.keyCode == 38){//up key
                if(paddlePos < 3){
                    paddlePos++;
                    let tempPos = 2+(7.5*paddlePos);
                    $('#paddle').animate({
                        bottom: tempPos+'vw'
                    }, 250);                    
                }
            }
            
            if(event.keyCode == 32){//space
               
                console.log(shuffle(wordBoxes));
            }
        });
        
        //--end paddle controls
        
        
        
		function setBoxes(){ //for setting the css of the boxes. Should create a way to instance and object pool enough items. 
            // limit the max number of active falling boxes at a time, max of 3 across all columns
			let iVal = 0;
			$('.fall').each(function(){
                wordBoxes.push($(this));
				$(this).css({
					width: 'max-content',
					height: '3vw',
					position: 'absolute', 
					border: '1px solid black',
					background: 'yellow',
					top: 12+(7.5*iVal) +'vw',
					'border-radius': '5px',
                    right: '0px',
                    display: 'none'
				});
				iVal++;            
			});
		}



		function sendWords(){
			setTimeout(function(){
				let randomGrab = Math.floor(Math.random() * wordBoxes.length); //this is the div
				
                if(!activeBoxes.includes(wordBoxes[randomGrab])){
                          
                    let randomValue = shuffle(possibleValues);

                    activeBoxes.push(wordBoxes[randomGrab]);
                    activeValues.push(randomValue);

                    wordBoxes[randomGrab].css({right: '0'}); //reset at the top
                    wordBoxes[randomGrab].data(words[randomValue]);//assign data
                    wordBoxes[randomGrab].children(0).text(words[randomValue].name);
                    wordBoxes[randomGrab].css({display: 'block'})
                    cullActive(activeValues, possibleValues, 3);

                    sideToSide(wordBoxes[randomGrab]);
                }else{
                    
                }                
                sendWords();
			}, 1000);
		}
        
        function cullActive(arrSource, arrDest, val){
            if(arrSource.length > val){
                let _shift = arrSource.shift();
                arrDest.push(_shift);
            }
        }
        

        function setPossibleValues(source, destination){
            for(i=0; i<source.length; i++){
                destination.push(i);
            }
            
        }

        function shuffle(o){
            for(i=o.length; i>-1; i--){
                var rand = o.splice(Math.floor(Math.random() * (i)), 1)[0];
                return rand;
            }
        }
		
		  
		function sideToSide(elem){
			var gameWidth = $('#gamespace').width();
			elem.css({})
			$(elem).animate({
				right: gameWidth
			}, 3000, 'linear', function(){
                //make it available
                if(activeBoxes.includes(elem)){
                    let _index = activeBoxes.indexOf(elem);
                    activeBoxes.splice(_index, 1);
                }
            });
            
            let tempLoop = setInterval(function(){
				compare($('#paddle'), elem);
			}, 150);
		}

		//ensure animation goes from top to bottom of gamespace
		function topToBot(elem){
			
			var bodyHeight = $('#gamespace').height();
			var elemOffset = elem.offset().top;
			elem.data().caught = false;	//// do this here?! or in the sendBoxes????
			var fullLength = bodyHeight;

			$(elem).animate({
				top: fullLength			
			}, 3000, 'linear');
			
			let tempLoop = setInterval(function(){
				compare($('#paddle'), elem);
			}, 150);			
		}
		
		//jQuery - mine
		function compare(obj1, obj2){			
			var oneLeft = obj1.offset().left;
			var oneRight = oneLeft + obj1.width();
			var oneTop = obj1.offset().top;
			var oneBot = oneTop + obj1.height();			
			
			var twoLeft = obj2.offset().left;
			var twoRight = twoLeft + obj2.width();
			var twoTop = obj2.offset().top;
			var twoBot = twoTop + obj2.height();				
	
			if(oneBot > twoTop && oneTop < twoBot){
				if(oneLeft < twoRight && oneRight > twoLeft){
									
					//only touch it once
					if(!obj2.data().caught){
						if(obj2.data().valid){
							score += 50;
							$('#score > p').text(score.toString());
						}else{
                            score -= 25;
                            $('#score > p').text(score.toString());
                        }
						obj2.data().caught = true;
                        obj2.css({display: 'none'});
					}
				}
			}			
		}
		
		function comparePositions(p1, p2){
			var x1 = p1[0] < p2[0] ? p1 : p2;
			var x2 = p1[0] < p2[0] ? p2: p1;
			return x1[1] > x2[0] || x1[0] === x2[0] ? true : false;
		} 