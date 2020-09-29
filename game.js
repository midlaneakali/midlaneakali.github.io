$(document).ready(function() {
    let connection = new Connection(packethandlercallback);
    let down = false;

    function handleclicktap(x,y,mobile){
        var rect = window.canvas.getBoundingClientRect();
            xCoordinate = x - rect.left;
            yCoordinate = y - rect.top;
            let xtile = xCoordinate/((window.trueCanvas.width/xtilecount));
            let ytile = yCoordinate/((window.trueCanvas.height/ytilecount));
            /*
            if(Math.ceil(xtile)-xtile<.03||Math.ceil(ytile)-ytile<.03){
     
            }else{
                alert(Math.floor(xtile)+":"+Math.floor(ytile));
            }
            */
           connection.send({
               pid:connection.identifiers.packet.kMove,
            yposition: ytile,
        xposition: xtile});

        if(mobile){
            
        }else{
            
        }
    }
    function handletapstart(e){
        down = true;
    }
    function handletapend(e){
        if(down){

            down = false;
            handleclicktap(e.changedTouches[0].clientX,e.changedTouches[0].clientY,true);
        }
        
    }
    function handletapmove(e){
        down = false;
        e.preventDefaults();
    }
    function handlemousedown(e){
        handleclicktap(e.clientX,e.clientY,false);
    }
    function handlemousemove(e){
        window.canvas.style.cursor = 'pointer';
        var rect = window.canvas.getBoundingClientRect();
            xCoordinate = e.clientX - rect.left;
            yCoordinate = e.clientY - rect.top;
            let xtile = xCoordinate/((window.trueCanvas.width/16));
            let ytile = yCoordinate/((window.trueCanvas.height/16));
            if(Math.ceil(xtile)-xtile<.03||Math.ceil(ytile)-ytile<.03){
                window.canvas.style.cursor = 'default';
            }
    }
    if(window.settings.platform == "mobile"){
        window.sethandlersmobile(handletapstart,handletapend,handletapmove);

    }else{
        window.sethandlersdesktop(handlemousedown,handlemousemove);
        
    }


    function packethandlercallback(packet){
        let parsed = JSON.parse(packet);
        console.log(parsed);
        switch(parsed.pid){
            case connection.identifiers.packet.kMove:{
                
            }
            break;
            case connection.identifiers.packet.kMyId:{
                localStorage.setItem('playerid',parsed.playerid);
            }
            break;
            case connection.identifiers.packet.kAllPlayers:{
                document.getElementById('player-count').innerText = parsed.count;
            }
            break;
            case connection.identifiers.packet.kInGame:
            case connection.identifiers.packet.kInQue:{
                document.getElementById('join-que-leave-game-button').innerText = "Leave";
            }
            break;
            case connection.identifiers.packet.kGameOver:
            case connection.identifiers.packet.kInLobby:
            case connection.identifiers.packet.kGameTerminated:{
                document.getElementById('join-que-leave-game-button').innerText = "Que";
            }
            break;
        }
    }
    document.getElementById('join-que-leave-game-button').addEventListener('click',e=>{
        connection.send({pid:connection.identifiers.packet.kQueLeave});
    },false);
});