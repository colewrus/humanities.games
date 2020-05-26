
function populateCards(domArray, _turn){
    for(i=0; i<_turn.cards.length; i++){    
        //currently sets icon on the card to the attached resource, could be unique by card
        domArray[i].children('div').css("background-image", "url(./assets/" + _turn.cards[i].r.url + ")"); 
        domArray[i].children('p').text(_turn.cards[i].introText); 
        domArray[i].fadeTo('fast', 1);
        domArray[i].css('pointer-events','auto');
    } 
}

function hideCards(domArray, exempt) {
    for (i = 0; i < domArray.length; i++) {
        //domArray[i].hide();
        if(i != exempt){
            domArray[i].fadeTo('slow', 0);
            domArray[i].css('pointer-events', 'none');
        }else{
            domArray[i].delay(1000).fadeTo('slow',0); 
            domArray[i].css('pointer-events', 'none');           
        }       
    }
}




function play(n){
    let audio = document.createElement('audio');   
    audio.src = './assets/sound/' + n + '.mp3';
    audio.play();
}



$(document).ready(function () {

    var cards = [];
    var turnCounter = 0;
    var turns = [];
    
    var playerReady = true;

    var resources = []


//Construction Zone  BEEP BEEP
    var athens = new Resource("Athens", "A center for the arts, learning and philosophy. A powerful city-state protected only by a wooden wall.", 'athens-icon.png');
    var sparta = new Resource("Sparta", "Unique in ancient Greece for its social system and constitution. A society with all social institutions focused on military training and physical development.", 'sparta-icon.png');
    var thebes = new Resource("Thebes", "The largest city of the ancient region of Boeotia and was the leader of the Boeotian confederacy. A major rival to Athens and Sparta.", 'thebes-icon.png');
            //assign the resources
            resources.push(athens);
            resources.push(sparta);
            resources.push(thebes);
    
        

    var turn0 = new Turn("Your city values...");
    turn0.addCard("Knowledge and wisdom ", "Athens was a hub for philosohpy and science", resources[0]); 
    turn0.addCard("Perfect martial prowess.", "Sparta was a brutal society that trained citizen men for one thing, war", resources[1]);
    turn0.addCard("Power and influence", "Thebes was shrewd and used it's central location to influence all of Greece", resources[2]);

    var turn1 = new Turn("Your City is protected by....");
    turn1.addCard("A citizen army and a professional navy", "Athens used silver from local mines to pay a professional navy", resources[0]);
    turn1.addCard("Every man, a warrior", "Spartans rarely went far for military campaigns, preferring to use diplomacy for far conflict. But every man ready to fight", resources[1]);
    turn1.addCard("Strong walls and a network of vassal states", "While Thebes relied on control of it's neighbors to exert power it was also protected by strong fortifications", resources[2]);

    var turn2 = new Turn("Your city fears...");
    turn2.addCard("Tyrants and the mob, each a different but equal threat", "athens was a democracy but prone to domination by aristocrats or overrule in times of panic", resources[0]);
    turn2.addCard("A slave uprising, while warriors are in battle far away who keeps the homeland safe?", "All Spartan citizen men being warriors meant they relied upon slave labor for food and manufacture",resources[1]);
    turn2.addCard("Isolation is the blade you fear. Walls may protect from siege but vassals protect from invasion", "Thebes was centrally located and used control over neighboring villages and cities to protect itself", resources[2]); 


//End of Construction Zone BEEP BEEP    


    //Assign the turns
    turns.push(turn0);
    turns.push(turn1);
    turns.push(turn2);



    //add all the DOM elements that should be a card
    $('.resource-card').each(function () {
        cards.push($(this));
        cards[cards.length - 1].data("cardVal", cards.length-1);
        $(this).hide();
        $(this).fadeTo('slow', 0);
        $(this).css('pointer-events','none');
        $(this).show();
    })
    

    var start = document.createElement("div");   
    start.className += "start-game";
    start.textContent ="Start Game";
    $('#card-table').append(start);



    $('.start-game').click(function(){ //basically the init
        turnCounter = 0;
        playerReady = true;
        $('#turn-counter').text("Turn: " + turnCounter);   
        populateCards(cards, turns[turnCounter]);
        play('gliss');    
        $('#scene').text(turns[turnCounter].sitText)
        $(this).fadeTo("fast", 0);
        $(this).css('pointer-events', 'none');
        for(i=0;i<resources.length;i++){
            resources[i].value = 0;
        }
    })  


    $('#reaction').fadeTo("fast", 0);  //hide reaction, ---temporary--- may do something different for this


    $('.resource-card').click(function () {           
        if(playerReady){
            console.log("player valid click");   
            
            //quick randomizer for the two sounds
            if(turnCounter%2 != 0){
                play('trumpet_1');
            }else{
                play('trumpet_2');
            }
            let pos = $(this).index(); //get the position in the list of cards to know which card was clicked                
            turns[turnCounter].cards[pos].r.value += 1; //score one for the associated card
         
            setTimeout(() => {
                hideCards(cards, pos); //hide the cards, the one you clicked has a delay                        
            }, 2000);

           $('#scene').fadeTo("slow", 0);//hide the scene text
           $('#reaction').fadeTo("fast", 0);             

            setTimeout(function(){            
                $('#reaction').text(turns[turnCounter].cards[pos].outText);
                $('#reaction').fadeTo("fast", 1);
            }, 500);  
             
            setTimeout(() => { //setup the new turn
                turnCounter++;     
                if(turnCounter != turns.length){ //if we have more turns in the list                    
                    $('#turn-counter').text("Turn: " + turnCounter);       
                    populateCards(cards, turns[turnCounter]);
                    play('gliss');
                    $('#scene').text(turns[turnCounter].sitText)
                    $('#scene').fadeTo("fast", 1);                    
                    playerReady = true;    
                }else{  //otherwise end
                    $('#scene').text("End of game");
                    $('#scene').fadeTo("fast", 1);
                    $('#reaction').fadeTo("fast", 0);
                    console.log("end of game");
                    $('.start-game').fadeTo("slow", 1);
                    $('.start-game').css('pointer-events', 'auto');
                }         
            }, 4000);
           playerReady = false;
        }  
    })




    function createBlock(dest, _card){         //idea to put a block that holds the data of the card selected so player can review their choices      
        $('<div></div>',{
            "class": "block",
            "data": _card,
            hover:function(){
                console.log($(this).data().outText);
            }
        }).appendTo(dest);    
    }

})