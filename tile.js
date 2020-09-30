let ytilecount = 16;
let xtilecount = 16;
class Tile{
    constructor(x,y,generated){
        this.y = y;
        this.x = x;
        this.disabled = false;
        this.mine = false;
        this.zero = false;
        this.value = -1;
        this.update = true;
        this.generated = generated;
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
    iszero(){
        return this.zero;
    }
    setzero(){
        this.zero = true;
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
    getgenerated(){
        return this.generated;
    }
    generate(generated){
        this.generated = generated;
    }
    getowner(){
        return this.owner;
    }
    setowner(owner){
        this.owner = owner;
    }
}