class PlainButton extends Phaser.GameObjects.Container {
    
    constructor(config){
        super(config.scene);
        config.scene.add.existing(this);
        this.interactRect;
        this.x;
        this.y;
        this.width;
        this.height;
        this.buttonColor;
        this.buttonAlpha;
        this.text;
        this.rect;
    }

    setRect(_x, _y, _width, _height, _color, _alpha=1, _rounded = false, _borderRadius = 0){
        //_color needs to be in 0x5aabe6 format
        //draw the rounded rectangle graphic
        this.rect = this.scene.add.graphics();
        this.rect.fillStyle(_color, _alpha);
        if(_rounded){
            this.rect.fillRoundedRect(_x, _y, _width, _height, _borderRadius)
        }else{
            this.rect.fillRect(_x, _y, _width, _height);
        }
        
        this.interactRect = this.scene.add.rectangle(_x+(_width/2), _y+(_height/2), _width, _height, 0xffffff, 0);
        this.interactRect.setInteractive();

        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.height = _height;
        this.buttonColor = _color;
        this.buttonAlpha = _alpha;
        this._text;
        this.highlight;
    }

    disable(){
        this.interactRect.disableInteractive();       
    }

    enable(){
        this.interactRect.setInteractive();
    }

    gray(){ //'gray out' the button to show it is disabled
        this.rect.alpha = 0.4;
        this.text.alpha = 0.4;
    }

    fill(){
        this.rect.alpha = 1;
        this.text.alph = 1;
    }


    hide(){
        this.rect.setVisible(false);
        this.text.setVisible(false);
    }

    show(){
        this.rect.setVisible(true);
        this.text.setVisible(true);
        this.rect.alpha = 1;
        this.text.alpha = 1;
    }
    
    Highlight(_colorHighlight){   
        if(this.highlight == undefined){
            this.highlight = this.scene.add.graphics();
            this.highlight.lineStyle(8, _colorHighlight, 0.7);
            this.highlight.strokeRoundedRect(this.x, this.y, this.width, this.height);
        }else{
            this.highlight.setVisible(true);
        }   
    }

    hideHighlight(){       
        if(this.highlight != undefined){
            this.highlight.setVisible(false);
        }
       
    }

    setText(text, _fontSize=64){
        //add the text      
        //set a mask just to be sure 
        if(this.text === undefined){          
            this.text = this.scene.add.text(this.x+10, this.y+15, text, {font: '64px Arial', color:"#ffffff"});
            this.text.setFontSize(_fontSize);
            this.mask = this.rect.createGeometryMask();    
            this.text.setMask(this.mask);
            this._text = this.text.text;
        }else{            
            this.text.text = text;
            this._text = text;
        }     
    }
}