class Gameboard{
    constructor(xtilecount,ytilecount){
        this.tiles = new Array(xtilecount);
        for(let x = 0; x < xtilecount;++x){
            this.tiles[x] = new Array(ytilecount);
        }
        for(let x = 0; x < xtilecount;++x){
            for(let y = 0; y < ytilecount;++y){
                let rect = window.rough.generator.rectangle(x*window.xpositionmultiplier,y*window.ypositionmultiplier,window.tilewidth,window.tileheight, {
                    fill: 'rgba(255,0,200,0.1)',
                    fillStyle: 'solid',
                  });
                this.tiles[x][y] = new Tile(x,y,rect);

            }
        }
    }
    draw(tick){
        for(let x = 0; x < xtilecount;++x){
            for(let y = 0; y < ytilecount;++y){
                window.rough.draw( this.tiles[x][y].getgenerated());
               
            }
        }
        
    }
    regenerate(){
        for(let x = 0; x < xtilecount;++x){
            for(let y = 0; y < ytilecount;++y){
                let rect = window.rough.generator.rectangle(x*window.xpositionmultiplier,y*window.ypositionmultiplier,window.tilewidth,window.tileheight, {
                    fill: 'rgba(255,0,200,0.1)',
                    fillStyle: 'solid',
                  });
                  this.tiles[x][y].generated = rect;
            }
        }
    }
}