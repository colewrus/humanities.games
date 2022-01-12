var score;
var drawnCards;
var deck1;
var deck2;
var deck3;
var decks;
var resetLock; //locks the reset button from executing. Mostly to 
var maxDrawn;

$(document).ready(function () {

	//set the header with the name of the 


	hgSetupValues(function(){


		score = 0;
		drawnCards = 0;
		maxDrawn = hgGet('options.winState'); //get our card limit
		$('#turn').children('p').text("Remaining Cards: " + (maxDrawn - drawnCards));//set the text for the card limit
		resetLock = false;

		var conclusions = hgGet('text.conclusion');
		$('#header').append(' - '  + hgGet('text.setup'));

		console.log(conclusions);

		var gameDecks = hgGet('options.decks');

		//create the dom elements for the decks
		var deckWrapper = document.getElementById('deck-wrapper');

		for(var i = 0; i<gameDecks.length; i++){
			var newDeck = document.createElement('div');
			newDeck.className += 'col deck';
			var data = new Deck();
			var nameEl = document.createElement('p');
			nameEl.textContent = gameDecks[i].name;
			data.color = gameDecks[i].color;//important to assign for the reset
			newDeck.style.backgroundColor = gameDecks[i].color;

	
			for(var c=0; c < gameDecks[i].cards.length; c++){
				var cardData = gameDecks[i].cards[c];
				data.addCard(cardData.title, cardData.content, cardData.value);
			}

			data.shuffle();
			newDeck.myDeck = data;
			newDeck.appendChild(nameEl);
			deckWrapper.appendChild(newDeck);
		}		
		
		$('.deck').click(function(){	
			if(drawnCards < maxDrawn){
				readCard(this.myDeck, this, conclusions);			
			}else{
				console.log("Game Over");		
			}
		})	
		
		$('#reset').click(function(){		
			resetGame();
		});
	});
});




function readCard(_deck, _dom, info){	
	if(_deck.topCard < _deck.library.length){		
		let card = _deck.library[_deck.topCard];


		$('#selection h1').text(card.title);
		$('#selection p:nth-child(2)').text(card.content);
		$('#selection p:nth-child(3)').text(card.value);

	
		score += _deck.library[_deck.topCard].value;
		$('.score').children('p').text("Score: " + score);	
		_deck.topCard++;
		drawnCards++;
		$('#turn').children('p').text("Remaining Cards: " + (maxDrawn - drawnCards));		
		if(_deck.topCard == _deck.library.length){
			console.log("hit the limit " , _dom);
			$(_dom).css("background-color", '#dedede'); //gray out
		}
	
		endGame(info);
		
	}else{
		console.log("no more cards in deck");
	}
	
	
}


function endGame(info){
	if(drawnCards >= maxDrawn){
		resetLock = true;		

		$('.deck').each(function(){ //gray out the buttons to signify they are disabled
			$(this).css("background-color", '#dedede');			
		})
		$('#selection').text('');
		setTimeout(function(){
			$("#selection").attr("id", "final");
			console.log(hgGet('images.portrait'));

			let img = new Image();
			img.src = hgGet('images.portrait');
			console.log(img);
		
			resetLock = false;
			if(score > 4){				
				$("#final").append('<p> ' + info.win + '</p>')
				//add the success image
			}else{			
				$("#final").append('<p> ' + info.loss + '</p>');
				//add the failure image
			}	
			$('#final').append('<div></div>');
			$('#final > div').append(img);		
		}, 500);
		
		
	}
}

function resetGame(){
	
	if(resetLock){
		console.log("reset locked");
		setTimeout(resetGame, 1000);
	}else{

		let pile = document.getElementsByClassName('deck');

		for(var d=0; d<pile.length; d++){		
			pile[d].myDeck.shuffle();
			pile[d].myDeck.topCard = 0;
			pile[d].style.backgroundColor = pile[d].myDeck.color;
		}
	


		if($("#final").length != 0){
			$("#final").attr("id", "selection");
			$("#final").append()
		}
	
		$('#selection').text('');
		$('#selection').append("<h1></h1>");
		$('#selection').append("<p></p>");
		$('#selection').append("<p></p>");
		//reset the selection to have a h1, p, p

		$('.score').children('p').text("Score: 0");
		score = 0;
		drawnCards = 0;
		$('#turn').children('p').text("Remaining Cards: " + (maxDrawn - drawnCards));
		console.log("game reset");		


	}
}