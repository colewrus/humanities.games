var wat = 0;

$(document).ready(function(){

	var resources = [
		{name: 'Wealth', value: 25, breakpoint: 0},
		{name: 'Food', value: 50, breakpoint: 25},
		{name: 'Population', value: 100, breakpoint:150},
		{name: 'Goods', value: 10, breakpoint: 0}
	]

	var turnCounter = 0;
	var turnEventTimers = [5, 7, 9];
	var maxTurns = 10;
	var finalTurn = false;

	populateResources(resources);

	//click listeners 
	$('.resource-card').click(function(){
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



	})

})





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