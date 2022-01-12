class Card {
	constructor(title, content, value=0){
		this.title = title;
		this.content = content;
		this.value = value;
		this.used = false;
		this.id = this.GenerateID()	
	}	

	AddIntroText(string){
		this.intro = string;
	}
	
	GenerateID(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		  });		 
	}

}
