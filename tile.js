let ytilecount = 16;
let xtilecount = 16;
class Tile{
    constructor(x,y){
        this.y = y;
        this.x = x;
        this.disabled = false;
        this.mine = false;
        this.zero = false;
        this.value = -1;
        this.update = true;
        this.owner = 0;
    }
    gety(){
        return y;
    }
    getx(){
        return x;
    }
    isdisabled(){
        return this.disabled;
    }
    disable(){
        this.disabled = true;
    }
    ismine(){
        return this.mine;
    }
    setmine(){
        this.mine = true;
    }
    setvalue(value){
        this.value = value;
    }
    getvalue(){
        return this.value;
    }
    needsupdate(){
        this.update = true; 
    }
    finishedupdate(){
        this.update = false;
    }
    getupdate(){
        return this.update;
    }
    getowner(){
        return this.owner;
    }
    setowner(owner){
        this.owner = owner;
    }
}