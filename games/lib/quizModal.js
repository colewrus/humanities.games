document.addEventListener("keyup", e=>{
    console.log("hit escape");
})


function passThrough(string){
    console.log("Pass through message ", string);
}

class Quiz {

    constructor(){
        this.question='';

    }

    createQuiz(qCount = 4){
        console.log("create quiz, ", document);
        var modal = document.createElement('div');
        document.body.appendChild(modal);
        modal.className = 'modal';

        var modalDialogue = document.createElement('div');
        modal.appendChild(modalDialogue);
        modalDialogue.className = 'modal-dialogue';

        var modalContent = document.createElement('div');
        modalDialogue.appendChild(modalContent);
        modalContent.className = 'modal-content';

        var modalQuestion = document.createElement('div');
        modalContent.appendChild(modalQuestion);
        modalQuestion.className = 'modal-question';

        for(var i=0; i< qCount; i++){
            var modalAnswer = document.createElement('div');
            modalContent.appendChild(modalAnswer);
            modalAnswer.className = 'modal-answer';
        }


    }
}