class TextBox extends Phaser.GameObjects.Text{

    constructor(config){
        super(config.scene, config.x, config.y, config.text, config.key, config.wrap);      
        config.scene.add.existing(this);
      
        console.log(config.wrap);
        this.setStyle({
            fontSize: '16px',
            color: '#000',
            align: 'left',
            wordWrap: {width:config.wrap, useAdvancedWrap: true}
        })   
        this.setDepth(1);
    }

    typewriteText(text, speedMS){
        console.log("typewrite " );
        const length = text.length;
        let i=0;
        this.text = '';

        var typeTimer = setInterval(()=>{          
            this.text += text[i];
            if(i<length-1){
                i++;  
            }else{   
                clearInterval(typeTimer);            
            }               
        }, speedMS);
    }

    addBKG(key, _x=0, _y=0){
        // if(_x)
        console.log("add run x " + _x + " y " + _y);
        this.bkg = this.scene.add.image(_x, _y, key);
    }

    

    hideAll(){
        this.setVisible(false);
        if(this.bkg != undefined)
            this.bkg.setVisible(false);
    }

}





