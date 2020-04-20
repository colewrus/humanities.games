var wat = 0;
var cards = [];

var resources = [
	{name: 'Wealth', value: 25, breakpoint: 0},
	{name: 'Food', value: 50, breakpoint: 25},
	{name: 'Population', value: 40, breakpoint:150},
	{name: 'Goods', value: 10, breakpoint: 0}
]



var turns = [];

var testTurn = new turnObj(4,"scenario text, good huh?");
testTurn.pushAdd("Wealth", 4, 0); //c1
testTurn.pushSub("Goods", 8, 0);
testTurn.pushAdd("Food", 10, 1); //c2
testTurn.pushSub("Wealth", 5, 1);
testTurn.pushAdd("Population", 4, 2); //c3
testTurn.pushSub("Goods", 2, 2);
testTurn.pushSub("Food", 2, 2);
testTurn.pushAdd("Goods", 5, 3); //c4
testTurn.pushSub("Wealth", 10, 3);

turns.push(testTurn);

$(document).ready(function(){
	

	var turnCounter = 0;
	var turnEventTimers = [5, 7, 9];
	var maxTurns = 10;
	var finalTurn = false;

	

	populateResources(resources);

	$('.resource-card').each(function(){
		cards.push($(this));		
		$(this).hide();
	
	})


	startTurn(turns[0]);
	
	//click listeners 
	$('.resource-card').click(function(){
		resourceClick($(this));
		//increment the turn counter
		if(finalTurn){
			console.log("game over");
		}else if(turnCounter < maxTurns-1 && !finalTurn){
			turnCounter++;			
			$('#turn-counter').text('Turn: ' + turnCounter);
			
			//check for turn-based special events
		}else{
			turnCounter++;
			console.log("final turn");
			$('#turn-counter').text('Turn: ' + turnCounter);
			finalTurn = true;
		}
		//end turn inrement

		
		//let myObj =	$(this).data("myTurn"); //grab the object we attached to the div data
	
		//myObj.returnValues();
				//this is where we will just run the add/subtract
		
		//get data
			
		//resourceAdd($(this), 5);
		//parse data
		//resourceSubtract("Wealth", 5);// need to add a check for all cases

		
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



function resourceClick(e){
	
	//for all the add arrays
	turns[0].addArray.forEach((element) => {
		if(element.card === e.data("card")){
			resourceAdd(element, element.val);
		}
	});




	turns[0].subArray.forEach((element) => {		
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
		$(this).data("myTurn", testTurn); //assign the turn as a data element
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
	$('.resource-bar > ul > li').each(function(){
		$(this).text('' + arr[counter].name + ': ' + arr[counter].value);
		counter++;
	})
	}