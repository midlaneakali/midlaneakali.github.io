
$(document).ready(function() {

    let game = new Gameboard(xtilecount,ytilecount);
    let gamehandler = new GameHandlers(packethandler);
    let minecount = 0;
    function renderloop(tick){
        requestAnimationFrame(renderloop);

       // window.ctx.clearRect(0,0,window.trueCanvas.width,window.trueCanvas.height);
        window.ctx.fillStyle = '#bdc3c7';
        window.ctx.fillRect(0,0,window.trueCanvas.width,window.trueCanvas.height);
        //window.ctx.fillStyle  = 'rgba(255,0,200,0.2)';
        game.draw(tick);
    }
    requestAnimationFrame(renderloop);
   // renderloop(0);
   window.scaletilescallback = function(){

   }
   function setminefortile(xposition,yposition,owner){
       ++minecount;
       let myingamepid = localStorage.getItem('ingamepid');
                if(owner==myingamepid){
                    document.getElementById('score-you').innerText++;
                }else{
                    document.getElementById('score-them').innerText++;
                }
       document.getElementById('mine-count').innerText = minecount;
    let tile = game.tiles[xposition][yposition];
    tile.setowner(owner);
    tile.setmine();
    tile.disable();
   }
   function setvaluefortile(xposition,yposition,owner,value){
    let tile = game.tiles[xposition][yposition];
    tile.setowner(owner);
    tile.setvalue(value);
    tile.disable();
   }
   function packethandler(packet){
       console.log(packet);
    switch(packet.pid){
        case gamehandler.connection.identifiers.packet.kMove:{
            
            if(packet.ismine){
                setminefortile(packet.xposition,packet.yposition,packet.player);
                
            }else{
                for(let e of packet.tiles){
                    setvaluefortile(e.xposition,e.yposition,packet.player,e.value);
                    

                }
            }
        }
        break;
        case gamehandler.connection.identifiers.packet.kMyId:{
            localStorage.setItem('playerid',packet.playerid);
        }
        break;
        case gamehandler.connection.identifiers.packet.kUuid:{
            localStorage.setItem('selfid',packet.selfid);
            
        }
        break;
        case gamehandler.connection.identifiers.packet.kAllPlayers:{
            document.getElementById('player-count').innerText = packet.count;
        }
        break;
        case gamehandler.connection.identifiers.packet.kInGame:
            

            localStorage.setItem('gameid',packet.gameid);
            localStorage.setItem('selfid',packet.selfid);
            localStorage.setItem('ingamepid',packet.player);

            if(packet.playerturn == packet.player){
                document.getElementById('player-turn').innerText = 'You';
            }else{
                document.getElementById('player-turn').innerText = 'Them';
            }
            document.getElementById('score-you').innerText = 0;
            document.getElementById('score-them').innerText = 0;
            if(packet.tiles){
                for(let e of packet.tiles){
                    if(e.ismine){
                        setminefortile(e.xposition,e.yposition,e.owner);
                    }else{
                        setvaluefortile(e.xposition,e.yposition,e.owner,e.value);
                    }
                }
            }
        case gamehandler.connection.identifiers.packet.kInQue:{
            document.getElementById('join-que-leave-game-button').innerText = 'Leave';
        }
        break;
        case gamehandler.connection.identifiers.packet.kGameOver:
        case gamehandler.connection.identifiers.packet.kInLobby:
        case gamehandler.connection.identifiers.packet.kGameTerminated:{
            document.getElementById('join-que-leave-game-button').innerText = 'Que';
            
            game = new Gameboard(xtilecount,ytilecount);
            localStorage.setItem('gameid',null);
            localStorage.setitem('ingamepid',null);
        }
        break;
        case gamehandler.connection.identifiers.packet.kTurn:{
            let ingameid = localStorage.getItem('ingamepid');
            if(packet.playerturn == ingameid){
                document.getElementById('player-turn').innerText = 'You';
            }else{
                document.getElementById('player-turn').innerText = 'Them';
            }
        }
        break;
    }
   }

});