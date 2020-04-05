//There are fourteen lines in a Shakespearean sonnet. The first twelve lines are divided into three quatrains with four lines each. 
//In the three quatrains the poet establishes a theme or problem and then resolves it in the final two lines, called the couplet. 
//The rhyme scheme of the quatrains is abab cdcd efef. The couplet has the rhyme scheme gg. 
var gameRoot = '';

var sonnets = ["From fairest creatures we desire increase", "That thereby beauty's rose might never die", "But as the riper should by time decease", "His tender heir might bear his memory", "When forty winters shall besiege thy brow" , "And dig deep trenches in thy beauty's field", "Thy youth's proud livery so gazed on now", "Will be a totter'd weed of small worth held", "Look in thy glass and tell the face thou viewest", "Now is the time that face should form another" ,  "Whose fresh repair if now thou not renewest", "Thou dost beguile the world, unbless some mother", "Unthrifty loveliness, why dost thou spend", "Upon thy self thy beauty's legacy?", "Nature's bequest gives nothing, but doth lend", "And being frank she lends to those are free", "Full many a glorious morning have I seen","Flatter the mountain tops with sovereign eye" ,"Kissing with golden face the meadows green", "Gilding pale streams with heavenly alchemy;", "Anon permit the basest clouds to ride", "With ugly rack on his celestial face", "And from the forlorn world his visage hide", "Stealing unseen to west with this disgrace:", "Even so my sun one early morn did shine", "With all triumphant splendour on my brow;", "But out, alack, he was but one hour mine","The region cloud hath mask'd him from me now.", "Yet him for this my love no whit disdaineth;","Suns of the world may stain when heaven's sun staineth."];
        
var counter;
var quatrainCounter;
var quatrains = new Array();
var sonnetText = document.getElementsByClassName("choiceH");
var round; //keeps track of how many lines have been clicked before we have to reload more
var lines;

class Quatrain{
    myLines; 
    constructor(line1, line2, line3, line4){
        this.line1 = line1;
        this.line2 = line2;
        this.line3 = line3;
        this.line4 = line4;
                
        this.myLines = [line1, line2, line3, line4]
    }        
}
        
window.onload = function(){
	setup();
	
    for(i=0; i<sonnets.length; i+=4){
        quatrains.push(new Quatrain(sonnets[i], sonnets[i+1], sonnets[i+2], sonnets[i+3]));
    }        
    SetText();
}
  
function setup(){
	counter = 0;
    quatrainCounter = 0;
	lines = 0;
	round = 0;
}

        
function SetText(){
    for(i=0; i<4; i++){
        sonnetText[i].innerHTML = quatrains[quatrainCounter].myLines[i];
		$(sonnetText[i]).parent().data({"pos": i, "valid": true});      
		$(sonnetText[i]).css('opacity', '1');
    }
	round = 0;
    quatrainCounter++;           
}
        
function GameEnd(){
	console.log("Game Over");
    document.getElementById('narrativeHeader').innerHTML = "Poem Done";
	$('.choiceH').each(function(){
		$(this).css('opacity', '0.2');
	})
}
        

        
$(document).ready(function(){
	$('.sonnetCard').click(function(event){
		console.log("clicked");
		var text = $(event.target).text();  
		var progress =  document.getElementById('progress');
		var lineBreak = document.createElement("br")
		if(lines <= 13){
			if($(event.target).is("div") && $(event.target).data("valid")){				
				$(event.target).children().css('opacity', '0.2');
				$(event.target).data("valid", false);
				lines++;
				progress.append(lineBreak);
				progress.append(lines + '. '+text);
					
				if(round >=3){
						SetText();
				}else{					
					round++;						
				}				
			}else if($(event.target).hasClass("choiceH")){				
				if($(event.target).parent().data("valid")){												
					$(event.target).parent().data("valid", false);	
					lines++;
					progress.append(lineBreak);
					progress.append(lines + '. ' + text);	
						
					if(round >=3){
						SetText();
					}else{
						round++;							
					}									
				}				
			}           
			if(lines == 14){					
				GameEnd();
			}				
		}else{
			GameEnd();
		}				
	});

})



