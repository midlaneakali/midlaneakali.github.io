
$(document).ready(function() {

    let game = new Gameboard(xtilecount,ytilecount);
    let gamehandler = new GameHandlers(packethandler);
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


   function packethandler(packet){
       console.log(packet);
    switch(packet.pid){
        case gamehandler.connection.identifiers.packet.kMove:{
            
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
        case gamehandler.connection.identifiers.packet.kInQue:{
            document.getElementById('join-que-leave-game-button').innerText = "Leave";
        }
        break;
        case gamehandler.connection.identifiers.packet.kGameOver:
        case gamehandler.connection.identifiers.packet.kInLobby:
        case gamehandler.connection.identifiers.packet.kGameTerminated:{
            document.getElementById('join-que-leave-game-button').innerText = "Que";
        }
        break;
    }
   }
});