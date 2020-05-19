function Turn(sitText){
    this.sitText = sitText; //situation text
    this.cards = [];
    
    this.addCard = function(introText, outroText, _resource){
        let t = new Card(introText, outroText, _resource);
        this.cards.push(t);       
    }

    this.readCards = function(i){
        return this.cards[i];
    }

}