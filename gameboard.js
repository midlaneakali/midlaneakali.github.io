class Gameboard{
    constructor(xtilecount,ytilecount){
        this.tiles = new Array(xtilecount);
        for(let x = 0; x < xtilecount;++x){
            this.tiles[x] = new Array(ytilecount);
        }
        for(let x = 0; x < xtilecount;++x){
            for(let y = 0; y < ytilecount;++y){

                this.tiles[x][y] = new Tile(x,y);

            }
        }
    }
    draw(tick){
        for(let x = 0; x < xtilecount;++x){
            for(let y = 0; y < ytilecount;++y){
                //window.rough.draw( this.tiles[x][y].getgenerated());
               window.ctx.fillStyle = 'rgba(255,0,200,0.1)';
               if(this.tiles[x][y].getowner()!=0){
                   window.ctx.fillStyle = getcolourforid(this.tiles[x][y].getowner());
               }if(this.tiles[x][y].value ==0){
                   window.ctx.fillStyle = 'rgb(75,75,78)';
               }if(this.tiles[x][y].ismine()&&this.tiles[x][y].isdisabled()){
                    window.ctx.fillStyle = 'rgb(205,54,200)';
               }
               window.ctx.fillRect(x*window.xpositionmultiplier,y*window.ypositionmultiplier,window.tilewidth,window.tileheight);
               window.ctx.strokeStyle ='rgb(42,42,44)';
               window.ctx.strokeRect(x*window.xpositionmultiplier,y*window.ypositionmultiplier,window.tilewidth,window.tileheight);


               if(this.tiles[x][y].getvalue()>0)
               window.ctx.fillStyle = '#666699';
               window.ctx.font = '15px Exo';
               window.ctx.fillText(this.tiles[x][y].getvalue(),x*window.xpositionmultiplier+window.tilewidth/2,y*window.ypositionmultiplier+window.tileheight/2,10);
            }
        }
        
    }
  
}