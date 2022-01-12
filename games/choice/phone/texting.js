// var startButton = document.getElementById("start");
// var infoButton = document.getElementById("info"); 
const msgArea = document.getElementById("messageContainer");
const keyboardArea = document.getElementById("keyboard");
const reset = document.getElementById("reset");
let started = false;
let round = 0;
let answerHistory = []; //holds the ID of answers so we can see the history of choices
let exchanges;
let resolutions;

hgSetupValues(()=>{
    exchanges = hgGet('text.exchanges');
    resolutions = hgGet('text.resolutions');    
   
});

keyboardArea.addEventListener('click', function(e) {    
    //paragraph tags may not be worth the effort
    if(e.target.id == 'start' || e.target.parentElement.id == 'start'){
        if(!started){
            sendMessage("Yes, let's start", false);
            round = 0;           
            started = true;
            clearKeyboard();
            setTimeout( ()=> {
                sendMessage(exchanges[round].question);
            }, 1000);
            setTimeout(setAnswers, 2000);    
        }
    }else if(e.target.id == 'info' || e.target.parentElement.id == 'info'){
        console.log('info');
    }else if(e.target.classList.contains('reply') || e.target.parentElement.classList.contains('reply')){// reply is the class we'll use to distinguish the actual answers from the data, just to keep this confusing
        let self;
        if(e.target.tagName == 'P'){         
            self = e.target.parentElement;
        }else{
            self = e.target;
        }
        let answerIndex = Array.from(keyboardArea.children).indexOf(self);
        readAnswer(answerIndex);       
    } 
});

reset.addEventListener("click", () => {
    resetStart();
});

//create message divs, set text, set inbound/outbound
function sendMessage(content, inbound=true){    
    var msg = document.createElement('div');
    var para = document.createElement('p');
    para.textContent = content;
    msg.appendChild(para);
    msgArea.appendChild(msg);
    msg.classList.add("message");
    inbound ?  msg.classList.add("inbound") : msg.classList.add("outbound");
    msg.classList.add('hidden');
    //single function didn't like assigning multiple classes but here I am doing it in a timeout
    setTimeout( ()=>{
        msg.classList.add('message');
        msg.classList.add('vis');
        msg.classList.remove('hidden');
    }, 500);    
    msg.scrollIntoView(false);
}

//wipes message area clear
function clearMessages(){
    let messages = msgArea.children;
    while(msgArea.firstChild){ 
        if(msgArea.firstChild == null || msgArea == null){
            break;
          }
          msgArea.removeChild(msgArea.firstChild);
    }
}

//resets starting buttonsto the keyboard area, text and ID elements  id=start,info
function resetStart(){  
    clearMessages();
    sendMessage("Hey, are you ready?");
    clearKeyboard();
    keyboardArea.children[0].classList.remove('hide');
    keyboardArea.children[0].firstChild.textContent = "Yes, let's start";
    keyboardArea.children[0].id = 'start';
    keyboardArea.children[1].classList.remove('hide');
    keyboardArea.children[1].firstChild.textContent = "What is this?";
    keyboardArea.children[1].id = 'info';
    started = false;   
    round = 0;
    answerHistory = []; //potential for issues with multiple playthroughs? this just creates a new array and doesn't trash the previous one
}

//wipes keyboard area clear
function clearKeyboard(){       
    for(let i=0; i< keyboardArea.children.length; i++){
        keyboardArea.children[i].classList.add('hide');
        keyboardArea.children[i].firstChild.textContent = '';
        if(keyboardArea.children[i].id != null || keyboardArea.children[i].id != undefined){       
            keyboardArea.children[i].removeAttribute('id');
        }
    }
};

//create answer divs within keyboard are, set text for each div, set interaction as button > assign value to button
function setAnswers(){      
    for(let i=0; i<3; i++){
        keyboardArea.children[i].firstChild.textContent = exchanges[round].answers[i].text;
        keyboardArea.children[i].classList.remove('hide');
        keyboardArea.children[i].classList.add('reply');
    }
}

function setAnswer(content, newID){
    //check to see if there are child elements that don't have the .hide class, so we can add multiple individual answers
    keyboardArea.children[0].firstChild.textContent = content;
    keyboardArea.children[0].classList.remove('hide');
    keyboardArea.children[0].classList.remove('reply');
    keyboardArea.children[0].id = newID;
}

//read answer, send as message - outbound
function readAnswer(ans){
    answerHistory.push(exchanges[round].answers[ans]); //log choice
    sendMessage(data.exchanges[round].answers[ans].text, false); 
    clearKeyboard();
    round++;
    remainderCheck();  
}

//from the MDN docs, a quick function to return a random number between values
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

//check for remaining messages
function remainderCheck(){
    if(round < exchanges.length){
        //timout for sending the next question, would be fun to vary the response time up
        setTimeout( ()=>{
            sendMessage(exchanges[round].question);  
        }, getRandomInt(1000, 2500)); 
        //timer here for the answers to the new question
        setTimeout( ()=> {
            setAnswers(); 
        }, 3500) ;
    }else{
        console.log("end");
        started = false;
        setTimeout( ()=>{
            EndGameResults();
        }, 1500);
        endGameQuery(5500);     
    }
}

//ask if they want to restart, delay in milliseconds
function endGameQuery(delay){
    setTimeout( ()=>{
        sendMessage("Start again?");
    }, delay);
    setTimeout( ()=> {
        setAnswer("Yes, let's start", 'start');
    }, delay+1500);
}

function EndGameResults(){
    let type0 = 0;
    let type1 = 0;
    let type2 = 0;
    
    for(let i = 0; i<answerHistory.length; i++){
        var ans = answerHistory[i].type;
        if(ans == 0){
            type0++;
        }else if(ans == 1){
            type1++;
        }else if(ans == 2){
            type2++;   
        }else{
            console.log("not found");
        } 
    }

    //switch didn't work here, there's gotta be a cleaner way
    if(type0 > type1 && type0 > type2){
        sendMessage(resolutions[0].text);
    }else if(type1 > type0 && type1 > type2){
        sendMessage(resolutions[1].text);
    }else if(type2 > type0 && type2 > type1){
        sendMessage(resolutions[2].text);
    }else{
        sendMessage("You are a complex person, we couldn't pin you down");
    }
}