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
	var quiz = new Quiz();
	quiz.createQuiz(2);

	hgSetupValues(function(){


		score = 0;
		drawnCards = 0;
		maxDrawn = hgGet('options.maxDrawn')+1; //get our card limit, offset due to index at 0
		$('#turn').children('p').text("Remaining Cards: " + (maxDrawn - drawnCards-1));//set the text for the card limit
		resetLock = false;

		var conclusions = hgGet('text.conclusion');
		// $('#header').append(' - '  + hgGet('text.setup'));

		console.log(conclusions);

		var gameDecks = hgGet('options.decks');

		//create the dom elements for the decks
		var deckWrapper = document.getElementById('deck-wrapper');

		for(var i = 0; i<gameDecks.length; i++){
			var singleDeckWrap = document.createElement('div');
			singleDeckWrap.className = 'deck-wrap';
			var newDeck = document.createElement('div');
			newDeck.className += 'deck';
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
			//newDeck.appendChild(nameEl);
			singleDeckWrap.appendChild(newDeck);
			singleDeckWrap.appendChild(nameEl);
			deckWrapper.appendChild(singleDeckWrap);
		}		
		
		$('.deck').click(function(){	
			if(drawnCards < maxDrawn-1){
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

		//https://images.pexels.com/photos/685458/pexels-photo-685458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260
		$('#selection h1').text(card.title);
		$('#selection p:nth-child(2)').text(card.content);
		if( card.value > 0 ) {
			var value = '+'+card.value
		} else {
			var value = card.value;
		}
		$('#selection p:nth-child(3)').text(value);
		if(drawnCards < maxDrawn-1){
			score += _deck.library[_deck.topCard].value;
			$('#score').children('p').text("Score: " + score);	
		}
		_deck.topCard++;
		drawnCards++;
		$('#turn').children('p').text("Remaining Cards: " + (maxDrawn - drawnCards-1));		
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
	console.log("drawn cards " , drawnCards , " max drawn " , maxDrawn);
	if(drawnCards >= maxDrawn-1){
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
		
			resetLock = false;
			var winState = hgGet('options.winState');
			if(score >= winState ){	
				$("#final").append('<h1>Well done!</h1>')			
				$("#final").append('<p> ' + info.win + '</p>')
				//add the success image
			}else{			
				$("#final").append('<h1>Try Again.</h1>')	
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
		$('#selection').append("<h1>Choose a card.</h1>");
		$('#selection').append("<p></p>");
		$('#selection').append("<p></p>");
		//reset the selection to have a h1, p, p

		$('#score').children('p').text("Score: 0");
		score = 0;
		drawnCards = 0;
		$('#turn').children('p').text("Remaining Cards: " + (maxDrawn - drawnCards-1));
		console.log("game reset");		
	}
}