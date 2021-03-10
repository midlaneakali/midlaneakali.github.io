
$(document).ready(function() {

    let game = new Gameboard(xtilecount,ytilecount);
    let gamehandler = new GameHandlers(packethandler);
    let mycolour = 0;
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
   function setminefortile(yposition,xposition,owner){
    let tile = game.tiles[yposition][xposition];
    tile.setowner(owner);
    tile.setmine();
    tile.disable();
   }
   function setvaluefortile(yposition,xposition,owner,value){
    let tile = game.tiles[yposition][xposition];
    tile.setowner(owner);
    tile.setvalue(value);
    tile.disable();
   }
   function packethandler(packet){
       console.log(packet);
    switch(packet.pid){
        case gamehandler.connection.identifiers.packet.kMove:{
            
            if(packet.ismine){
                setminefortile(packet.yposition,packet.xposition,packet.player);
            }else{
                for(let e of packet.tiles){
                    setvaluefortile(e.yposition,e.xposition,packet.player,e.value);
                    

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
            mycolour = packet.ingamecolour;
            localStorage.setItem('gameid',packet.gameid);
            console.log("Setting game id");
            if(packet.tiles){
                for(let e of packet.tiles){
                    if(e.ismine){
                        setminefortile(e.yposition,e.xposition,e.owner);
                    }else{
                        setvaluefortile(e.yposition,e.xposition,e.owner,e.value);
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
            localStorage.setItem('selfid',null);
        }
        break;
        case gamehandler.connection.identifiers.packet.kTurn:{
            if(packet.playerturn == mycolour){
                document.getElementById('player-turn').innerText = 'You';
            }else{
                document.getElementById('player-turn').innerText = 'Them';
            }
        }
        break;
    }
   }

});