function Resource(name, description){
    this.name = name;
    this.value = 0;
    this.description = description;

    this.addValue = function(v){
        this.value += v;
    }

    
}