
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
       game.regenerate();
   }

   function packethandler(packet){
       console.log(packet);
    switch(packet.pid){
        case gamehandler.connection.identifiers.packet.kMove:{
            
            if(packet.mine){
                let tile = game.tiles[packet.yposition][packet.xposition];
                tile.setowner(packet.player);
                tile.setmine();
                tile.disable();
                game.regeneratetile(packet.yposition,packet.xposition);
            }else{
                for(let e of packet.tiles){
                    let tile = game.tiles[e.yposition][e.xposition];
                    tile.setowner(packet.player);
                    tile.setvalue(e.value);
                    tile.disable();
                    game.regeneratetile(e.yposition,e.xposition);
                }
            }
        }
        break;
        case gamehandler.connection.identifiers.packet.kMyId:{
            localStorage.setItem('playerid',packet.playerid);
        }
        break;
        case gamehandler.connection.identifiers.packet.kAllPlayers:{
            document.getElementById('player-count').innerText = packet.count;
        }
        break;
        case gamehandler.connection.identifiers.packet.kInGame:
            mycolour = packet.ingamecolour;
        case gamehandler.connection.identifiers.packet.kInQue:{
            document.getElementById('join-que-leave-game-button').innerText = 'Leave';
        }
        break;
        case gamehandler.connection.identifiers.packet.kGameOver:
        case gamehandler.connection.identifiers.packet.kInLobby:
        case gamehandler.connection.identifiers.packet.kGameTerminated:{
            document.getElementById('join-que-leave-game-button').innerText = 'Que';
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