var card;
var decks = [];//dom elements, should hold the deck obj as identity
var gameStart;
var questions = [];
var turn;
var optionsReady;


$(document).ready(function () {

    gameStart = false;
    turn = 0;
    var scoreboard = {};

    hgSetupValues(function(){
        var gameDecks = hgGet('options.decks');
        
        var q = hgGet('text.questions');
        console.log(q);

        for(var i=0; i<q.length; i++){            
            questions.push(q[i]);
        }
        
        var deckWrapper = document.getElementById('options');
        for(var i=0; i < gameDecks.length; i++){
            var newDeck = document.createElement('div'); 
            newDeck.className = 'deck';   
            var deckObj = new Deck();
            deckObj.color = gameDecks[i].color;

            //use decks topcard as a scoreboard

      
            for(var c=0; c < gameDecks[i].cards.length; c++){
				var cardData = gameDecks[i].cards[c];
				deckObj.addCard(cardData.title, cardData.content, cardData.value);
                deckObj.city = gameDecks[i].name;
			}
            newDeck.identity = deckObj;
            deckWrapper.appendChild(newDeck);   
            decks.push(newDeck);
            
            var deckImg = document.createElement('img');
            deckImg.src = gameDecks[i].image;
            newDeck.appendChild(deckImg);
            
            var deckText = document.createElement('p');
            deckText.textContent = gameDecks[i].name;
            newDeck.appendChild(deckText);
        }
        console.log("scoreboard " , scoreboard);

        $('.deck').click(function(){       
            if(gameStart){
                var _card = this.identity.library[turn];         
                if(optionsReady){                 
                    readCard(_card);
                    //add score to deck to track
                }               
            }
        });


        
    });
    $('#start').click(function(){       
        setQuestion();
        gameStart = true;
        optionsReady = true;
        for(var i=0; i< decks.length; i++){
            setTopCard(decks[i]);         
        }
       
    })
});

function setQuestion(){
    console.log($('#question').children());
    if($('#question').children().length > 1){
        console.log('need to change question area');
       $('#question').empty();   
       var questionGraph = document.createElement('p');
       $('#question').append(questionGraph);
    }
    $('#question p').text(questions[turn]);
    optionsReady = true;

}

function setTopCard(txtDom){    
    var deckText = txtDom.identity.library[turn].title;
    txtDom.children[1].textContent = deckText;
   
}

function readCard(card){
    $('#question p').text(card.content); 
    disableOptions();
}


function disableOptions(){ 
   //clear out the text of the cards
   optionsReady = false;
   setTimeout(function(){
        turn = turn + 1;
        setQuestion();
        if(turn >= decks.length){
            //end game
            optionsReady = false;
            console.log("game over");
        }else{
            for(var i=0; i< decks.length; i++){
                console.log("feed deck " , decks[i]);
                setTopCard(decks[i]);
            }
        }      
       //should probably do a whol reset of the cards/question
   }, 3000);
}

function enableOptions(){

}