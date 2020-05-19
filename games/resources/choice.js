

function turnObj(situationText) {
    this.situationText = situationText;
    this.cards = [];
    this.startActions = [];

    this.scenarioAction = function (_name, _val) {
        this.startActions.push({ "name": _name, "value": _val });
    }

    this.addCard = function (_title, _ex, _url) {
        let _card = new cardObj(_title, _ex, _url);
        this.cards.push(_card);
    }
}

function cardObj(titleText, exText, url = '') {
    this.titleText = titleText;
    this.exText = exText;
    this.actions = [];

    this.resourceAction = function (_name, _val) {
        let _act = { "name": _name, "val": _val };
        this.actions.push(_act);
    }

   this.url = url
}

function populateCard(_cardDom, _cardObj) {
    _cardDom.text(_cardObj.titleText);
    _cardDom.append("<br>" + _cardObj.exText);    
}

function populateCards(domArray, _turn){
    for(i=0; i<_turn.cards.length; i++){        
        domArray[i].text(_turn.cards[i].introText);
        domArray[i].show();
    }
}

$(document).ready(function () {
    var cards = [];
    var resources = [];
    var turnCounter = 0;
    var turns = [];
    
    var playerReady = true;

    $('.resource-card').each(function () {
        cards.push($(this));
        cards[cards.length - 1].data("cardVal", cards.length-1);
        $(this).hide();
    })
 


    //this is probably a bad way to create the data objects should we just parse a json?

    resources = [
        { name: 'wealth', value: 15 },
        { name: 'food', value: 15 },
        { name: 'population', value: 15},
        { name: 'goods', value: 15 }
    ]

    var turn0 = new turnObj("Mesopotamia must thrive, can you help? Background info...");
    turn0.addCard("Create Irrigation", "Explanation: Science has helped save lives! Irrigation works by...", '#67c28d')
    turn0.cards[0].resourceAction("food", 4);
    turn0.cards[0].resourceAction("wealth", -10);
    turn0.cards[0].resourceAction("goods", 2);  
    

    turn0.addCard("Horde food for leaders", "Explanation: Your greed has cost lives. X ruler did this and...", '#aa67c2');
    turn0.cards[1].resourceAction("food", 10);
    turn0.cards[1].resourceAction("population", -30);
    turn0.cards[1].resourceAction("goods", -5);

    turn0.addCard("Let nature take its course", "Explanation: Inaction has cost lives.", '#d7db88');
    turn0.cards[2].resourceAction("food", -10);
    turn0.cards[2].resourceAction("wealth", -5);
    turn0.cards[2].resourceAction("population", -25);
    turn0.cards[2].resourceAction("goods", -10);
  

    
    turn0.addCard("Ration to the public", "The famine cost lives, but your generous spirit has saved many. X ruler tried this and...", '#d19560');
    turn0.cards[3].resourceAction("food", -5);
    turn0.cards[3].resourceAction("wealth", -7);
    turn0.cards[3].resourceAction("population", 1);
    turn0.cards[3].resourceAction("goods", 5);
    
    turns.push(turn0);

    var turn1 = new turnObj("Famine has struck! How do you respond?");
    turn1.scenarioAction("food", -15);
    turn1.addCard("Horde food for leaders", "Explanation: Your greed has cost lives. X ruler did this and...", '#d16086');
    turn1.cards[0].resourceAction("food", 10);
    turn1.cards[0].resourceAction("population", -30);
    turn1.cards[0].resourceAction("goods", -5);

    turns.push(turn1);


    populateResources();
    setCards();
    //End of construction

    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'Jump.wav');

  // var aud = new Audio('/assets/sound/Jump.wav');

    $('.resource-card').click(function () {

        let tempTurn = new Turn("situation text");
        tempTurn.addCard("intro", "outro");
        tempTurn.addCard("intro2", "outro2");
        
        for(i=0; i<tempTurn.cards.length; i++){
            console.log("read card " , tempTurn.readCards(i));

        }
        hideCards();
        populateCards(cards, tempTurn);

        console.log(tempTurn);

        /*
        console.log("click card");
        audioElement.setAttribute('src', 'Explosion.wav');
        audioElement.play();
        console.log(audioElement);
        */
        /*
        console.log("player ready " + playerReady);
        if (playerReady) {
            if (turnCounter < turns.length - 1) {
                let clickPos = readCard($(this));
                runCard(turnCounter, clickPos);

                turnCounter++;
                setTimeout(setCards, 2000);

                playerReady = false;
            } else {
                let clickPos = readCard($(this));
                runCard(turnCounter, clickPos);
                $('#scene').text("Game Over");
                hideCards();
            }
        }
        */
    })


    function runCard(_turn, _card) {
        let acts = turns[_turn].cards[_card].actions.length;        
        
        for (i = 0; i < acts; i++) { //for all the actions on the card
            let _n = turns[_turn].cards[_card].actions[i].name; //get the action name
            for (j = 0; j < 4; j++) { //check all the resources
                if (_n == resources[j].name) { //if the action name and resource name match
                    resources[j].value += turns[_turn].cards[_card].actions[i].val;                    
                }
            }
        }

        populateResources();
    }

    function populateResources() {
        let counter = 0;
        $('#horizontal-list > li').each(function () {
            $(this).text('' + resources[counter].name + ': ' + resources[counter].value);
            counter++;
        })
    }


    function readCard(_cardPos) {
        let cardPos = _cardPos.data('cardVal');
        return cardPos;
    }
     

    function setCards() {  
        hideCards();
        $('#turn-counter').text('Turn: ' + (turnCounter+1));
        $('#scene').text(turns[turnCounter].situationText); //provide scenario text

        if (turns[turnCounter].startActions.length > 0) {          
            resources.forEach(function (_n) {               
                if (_n.name == turns[turnCounter].startActions[0].name) { //!-----hold a hard coded value              
                    _n.value += turns[turnCounter].startActions[0].value;
                    populateResources();
                }                
            })
        }
   
        for (i = 0; i < turns[turnCounter].cards.length; i++) {          
            populateCard(cards[i], turns[turnCounter].cards[i]);
            cards[i].show();
            cards[i].css("background-color", turns[turnCounter].cards[i].url.toString());            
        }

        playerReady = true;
    }

    function hideCards() {
        for (i = 0; i < 4; i++) {
            cards[i].hide();
        }
    }

})