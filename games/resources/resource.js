var wat = 0;
var cards = [];

var resources = [
	{name: 'Wealth', value: 25, breakpoint: 0},
	{name: 'Food', value: 50, breakpoint: 25},
	{name: 'Population', value: 40, breakpoint:150},
	{name: 'Goods', value: 10, breakpoint: 0}
]



var turns = [];

var turn0 = new turnObj(4,"Welcome to the Kingdom");
turn0.pushAdd("Wealth", 4, 0); //c1
turn0.pushSub("Goods", 8, 0);
turn0.pushAdd("Food", 10, 1); //c2
turn0.pushSub("Wealth", 5, 1);
turn0.pushAdd("Population", 4, 2); //c3
turn0.pushSub("Goods", 2, 2);
turn0.pushSub("Food", 2, 2);
turn0.pushAdd("Goods", 5, 3); //c4
turn0.pushSub("Wealth", 10, 3);

turns.push(turn0);

var turn1 = new turnObj(4, "Grow and be ready for any event");
turn1.pushAdd("Wealth", 4, 0);
turn1.pushSub("Goods", 8, 0);
turn1.pushAdd("Food", 10, 1);
turn1.pushSub("Wealth", 5, 1);
turn1.pushAdd("Population", 4, 2);
turn1.pushSub("Goods", 2, 2);
turn1.pushSub("Food", 2, 2);
turn1.pushAdd("Goods", 5, 3);
turn1.pushSub("Wealth", 10, 3);
turns.push(turn1);


var turn2 = new turnObj(2, "A famine has struck");
turn2.pushAdd("Wealth", 1, 0);
turn2.pushSub("Goods", 10, 0);
turn2.pushSub("Food", 2, 0);
turn2.pushSub("Population", 10, 0);
turn2.pushAdd("Population", 0, 1);
turn2.pushSub("Food", 10, 1);
turn2.pushSub("Goods", 10, 1);
turns.push(turn2);

var turn3 = new turnObj(3, "We must hold together and survive");
turn3.pushAdd("Wealth", 2, 0);
turn3.pushSub("Goods", 8, 0);
turn3.pushSub("Population", 3, 0);
turn3.pushAdd("Food", 5, 1);
turn3.pushSub("Wealth", 8, 1);
turn3.pushSub("Population", 1, 1);
turn3.pushAdd("Population", 1, 2);
turn3.pushSub("Food", 10, 2);
turn3.pushSub("Goods", 2, 2);
turns.push(turn3);

var turn4 = new turnObj(4, "Now is our time to thrive");
turn4.pushAdd("Wealth", 4, 0);
turn4.pushSub("Goods", 8, 0);
turn4.pushAdd("Food", 10, 1);
turn4.pushSub("Wealth", 5, 1);
turn4.pushAdd("Population",  4, 2);
turn4.pushSub("Goods", 2, 2);
turn4.pushSub("Food", 2, 2);
turn4.pushAdd("Goods", 5, 3);
turn4.pushSub("Wealth", 10, 3);
turns.push(turn4);


$(document).ready(function(){
	

	var turnCounter = 0;
	var turnEventTimers = [5, 7, 9];
	var maxTurns = turns.length;
	var finalTurn = false;

	

	populateResources(resources);

	$('.resource-card').each(function(){
		cards.push($(this));		
		$(this).hide();	
	})


	startTurn(turns[turnCounter]);
	$('#scene').text(turns[turnCounter].scenario);
	
	//click listeners 
	$('.resource-card').click(function(){
	
		//increment the turn counter
		if (finalTurn) {
			resourceClick($(this), turnCounter);
			clearCards();
			turnCounter++;
			$('#turn-counter').text('Turn: ' + turnCounter);
			$('#scene').text("Game Over");
		}else if(turnCounter < maxTurns-2 && !finalTurn){						
			
			if (turns[turnCounter] != undefined) {
				turnCounter++;
				resourceClick($(this), turnCounter);
				startTurn(turns[turnCounter]);
				$('#scene').text(turns[turnCounter].scenario);
			} else {
				console.log("not clear");
			}		
			$('#turn-counter').text('Turn: ' + turnCounter);
			//check for turn-based special events
		}else{
			turnCounter++;
			console.log("final turn");
			$('#turn-counter').text('Turn: ' + turnCounter);
			finalTurn = true;
			resourceClick($(this), turnCounter);
			startTurn(turns[turnCounter]);
			$('#scene').text(turns[turnCounter].scenario);
		}


		
	}) //end of click




})

var res1,res2,res3,res4;



function resourceAdd(obj, val){ //object to read what is assigned to the object

	for(i=0; i<resources.length; i++){		
		if(resources[i].name == obj.name){
			resources[i].value += val;			
		}
	}	
	populateResources(resources);
}

function resourceSubtract(obj, val){//n to read a name as a string
	for(i=0; i<resources.length; i++){	
		if(resources[i].name === obj.name){
			resources[i].value -= val;			
		}
	}	
	populateResources(resources);
}


function populateCards(n){//n=number of cards, 
	for(i=0; i<n; i++){
		cards[i].show();
		cards[i].data("card", i);
	}	
}

function clearCards(){
	for(i=0; i<cards.length; i++){
		cards[i].hide();
	}
}

function startTurn(obj){
	clearCards();
	populateCards(obj.number);	

	let i = (obj.subArray.length > obj.addArray.length) ? obj.subArray.length : obj.addArray.length;
	
	//populate the text
	//for each item in the add array 
	for(ad=0;ad<obj.addArray.length;ad++){
		let v = obj.addArray[ad].card;
		cards[v].text('+' + obj.addArray[ad].val + ' ' + obj.addArray[ad].name);
	}

	for(sb=0; sb < obj.subArray.length; sb++){
		let v = obj.subArray[sb].card;		
		cards[v].append("<br>" + ' -' + obj.subArray[sb].val + '  ' + obj.subArray[sb].name);
	}
}




function turnObj (nCards, sceneText){
	this.number = nCards;
	this.scenario = sceneText;
	this.addArray = [];
	this.subArray = [];
	
	this.pushAdd = function(_name, _val, _card){ 
		let _obj = {"name": _name, "val": _val, "card": _card};
		this.addArray.push(_obj);
	}

	this.pushSub = function(_name, _val, _card){
		let _obj = {"name": _name, "val": _val, "card": _card};
		this.subArray.push(_obj);
	}

	this.returnValues = function(){
		console.log(this.number, this.scenario);
	}
}

function cardObj(title,explanation) {
	this.title = title;
	this.explanation = explanation; 
	this.actions = [];


}



function resourceClick(e, t){
	
	//for all the add arrays
	turns[t].addArray.forEach((element) => {
		if(element.card === e.data("card")){
			resourceAdd(element, element.val);
		}
	});

	turns[t].subArray.forEach((element) => {		
		if(element.card === e.data("card")){
			resourceSubtract(element, element.val);
		}
	})
}



function matchResource(_name, _array){
	for(i=0; i<_array.length; i++){		
		if(_array[i].name === _name){
			return array[i];
		}		
	}
	
}


//4-15 needed? Might not assign data to object but instad just check the turn and use the
function assignData(){ //give card some data
	//needs to parse information for the turn, 
	//turn has a c


	//start off giving each dummy data 
	let n = 0;
	$('.resource-card').each(function(){
		$(this).data("myTurn", turn0); //assign the turn as a data element
	})
}




function getResource(n, arr){ //n = name arr = array of resources
	for(i=0; i<arr.length; i++){
		if(arr[i].name == n){
			console.log("You're resource amigo ", arr[i]);
		}
	}
}

function populateResources(arr){
	let counter = 0;
	$('#horizontal-list > li').each(function(){
		$(this).text('' + arr[counter].name + ': ' + arr[counter].value);
		counter++;
	})
	}