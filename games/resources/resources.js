function Resource(name, description, _url){
    this.name = name;
    this.value = 0;
    this.description = description;
    this.url = _url || null;

    this.addValue = function(v){
        this.value += v;
    }    
}