class InfoPanel extends Phaser.GameObjects.GameObject {

    constructor(config){
        super(config.scene);
        config.scene.add.existing(this);
        this.words;
        this.x;
        this.y;
        this.width
        this.height;
        this.rect;
        this.panelColor;
        this.panelAlpha;       
        this.pages = [];
        this.activePage = 0;
        this.nextButton;
        this.prevButton;
        this.close = false;
        this.active;
    }

    drawPanel(_x, _y, _width, _height, _color = '0xfffffff', _alpha = 1, _rounded = false, _borderRadius=1){
        this.rect = this.scene.add.graphics();
        this.rect.fillStyle(_color, _alpha);
        if(_rounded){
            this.rect.fillRoundedRect(_x, _y, _width, _height, _borderRadius)
        }else{
            this.rect.fillRect(_x, _y, _width, _height);
        }
        //x, y are top left corner
        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.height = _height;
        this.buttonColor = _color;
        this.buttonAlpha = _alpha;     
        this.rect.setVisible(false);    
    }

    togglePanel(){
       if(this.rect.visible){
           this.rect.setVisible(false);       
            this.hideAllPages();
            this.hideButtons();
            this.active = false;
            this.close = false;
       }else{
            this.rect.setVisible(true);    
            this.activePage = 0;            
            this.setPage(this.pages[this.activePage]);     
            this.showButtons();
            this.active = true;
       }
    }

    addPage(img = null, text, fontSize = 48, padding=15){
        var page = {};
        page.img = []
        var textPadding = padding;
        if(img != null){       
            for(var i=0; i<img.length; i++){                               
                let _img = this.scene.add.image(this.x + 128 + (i*300), (this.y+this.height) - 300 , img[i]);               
                _img.setVisible(false);                            
                page.img.push(_img);                               
            }               
            var leftChannel = (this.width/4);  
        }    
        if(this.text === null){
            console.log("no text added to page, could not create");
            return;
        }
        if(this.text === undefined){
            var _text = this.scene.add.text(this.x + textPadding*2, this.y + textPadding*2, text, {font: '64px Arial', color:"#ffffff", wordWrap:{width:this.width-(2*textPadding), useAdvancedWrap:true}} );
            _text.setFontSize(fontSize);
            _text.setVisible(false);
            page.text = _text;
        }     
        this.pages.push(page);      
        this.addPagination();
    }

    setPage(page){      
        if(page.img.length > 0){
            for(var i=0; i<page.img.length; i++){            
                page.img[i].setVisible(true);
            }
        }        
        page.text.setVisible(true);
        this.showButtons();
    }

    hideAllPages(){
        for(var i=0; i< this.pages.length; i++){
            if(this.pages[i].img != null){
                for(var j=0; j<this.pages[i].img.length; j++){
                    this.pages[i].img[j].setVisible(false);
                }
            }
            this.pages[i].text.setVisible(false);
        }
    }

    nextPage(){        
        this.hideAllPages();
        this.activePage += 1;
        this.setPage(this.pages[this.activePage]);        
    }

    prevPage(){
        this.hideAllPages();
        this.activePage -= 1;
        this.setPage(this.pages[this.activePage]);
    }

    addPagination(){
        var buttonY = this.y + this.height-100;

        this.prevButton = {};
        this.prevButton.vis = this.scene.add.graphics();
        this.prevButton.vis.fillStyle(0x408749, 1);
        this.prevButton.vis.fillRoundedRect(this.x+50, buttonY, 250, 75, 5);
        this.prevButton.interact = this.scene.add.rectangle(this.x+50+(250/2), buttonY+(75/2), 250, 75, 0xffffff, 0);
        this.prevButton.interact.setInteractive();
        this.prevButton.interact.on('pointerdown',()=>{
            this.prevPage();
        });
        this.prevButton.text = this.scene.add.text(this.x+75, buttonY+20, "Previous", {font: '34px Arial', color:"#ffffff", wordWrap:{width:200, useAdvancedWrap:true}});

        this.nextButton = {};
        this.nextButton.vis = this.scene.add.graphics();
        this.nextButton.vis.fillStyle(0x408749, 1);
        this.nextButton.vis.fillRoundedRect(this.x+this.width-300, buttonY, 250, 75, 5);
        this.nextButton.interact = this.scene.add.rectangle(this.x+this.width-300+125, buttonY+(75/2), 250, 75, 0xffffff, 0);
        this.nextButton.interact.setInteractive();
        this.nextButton.interact.on('pointerdown', ()=>{
            this.nextPage();
        })
        this.nextButton.text = this.scene.add.text(this.x+this.width-150, buttonY+20, "Next", {font: '34px Arial', color:"#ffffff", wordWrap:{width:200, useAdvancedWrap:true}});

        this.hideButtons();    
    }

    hideButtons(){
        this.prevButton.vis.setVisible(false);
        this.prevButton.interact.disableInteractive();
        this.prevButton.text.setVisible(false);
        this.nextButton.vis.setVisible(false);
        this.nextButton.interact.disableInteractive();
        this.nextButton.text.setVisible(false);
    }

    showButtons(){
        if(this.pages[this.activePage-1] != undefined){
            this.prevButton.vis.setVisible(true);
            this.prevButton.interact.setInteractive();
            this.prevButton.text.setVisible(true);
        }else{
            this.prevButton.vis.setVisible(false);
            this.prevButton.interact.disableInteractive();
            this.prevButton.text.setVisible(false);
        }
        
        if(this.pages[this.activePage+1] != undefined){
            this.nextButton.vis.setVisible(true);
            this.nextButton.interact.setInteractive();
            this.nextButton.text.setVisible(true);
        }else{
            this.nextButton.vis.setVisible(false);
            this.nextButton.interact.disableInteractive();
            this.nextButton.text.setVisible(false);
        }       
    }  
}