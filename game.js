class GameHandlers{
    constructor(packethandlercallback){
        this.packethandlercallback = packethandlercallback;
        this.connection = new Connection(this.packethandlerinternal.bind(this));
        this.down = false;
        if(window.settings.platform == "mobile"){
            window.sethandlersmobile(this.handletapstart.bind(this),this.handletapend.bind(this),this.handletapmove.bind(this));
    
        }else{
            window.sethandlersdesktop(this.handlemousedown.bind(this),this.handlemousemove.bind(this));
        }
        document.getElementById('join-que-leave-game-button').addEventListener('click',e=>{
            
            this.connection.send({pid:this.connection.identifiers.packet.kQueLeave});
        },false);
    }
    handleclicktap(x,y,mobile){
        var rect = window.canvas.getBoundingClientRect();
            let xCoordinate = x - rect.left;
            let yCoordinate = y - rect.top;
            let xtile = xCoordinate/((window.trueCanvas.width/xtilecount));
            let ytile = yCoordinate/((window.trueCanvas.height/ytilecount));
            /*
            if(Math.ceil(xtile)-xtile<.03||Math.ceil(ytile)-ytile<.03){
     
            }else{
                alert(Math.floor(xtile)+":"+Math.floor(ytile));
            }
            */
           this.connection.send({
               pid:this.connection.identifiers.packet.kMove,
            xposition: Math.floor(xtile),
        yposition: Math.floor(ytile)});

        if(mobile){
            
        }else{
            
        }
    }
    handletapstart(e){
        this.down = true;
    }
    handletapend(e){
        if(this.down){

            this.down = false;
            this.handleclicktap(e.changedTouches[0].clientX,e.changedTouches[0].clientY,true);
        }
        
    }
    handletapmove(e){
        this.down = false;
        e.preventDefaults();
    }
    handlemousedown(e){
        this.handleclicktap(e.clientX,e.clientY,false);
    }
    handlemousemove(e){
        window.canvas.style.cursor = 'pointer';
        var rect = window.canvas.getBoundingClientRect();
            let xCoordinate = e.clientX - rect.left;
            let yCoordinate = e.clientY - rect.top;
            let xtile = xCoordinate/((window.trueCanvas.width/16));
            let ytile = yCoordinate/((window.trueCanvas.height/16));
            if(Math.ceil(xtile)-xtile<.03||Math.ceil(ytile)-ytile<.03){
                window.canvas.style.cursor = 'default';
            }
    }
    setdesktopmobilehandler(){
        
    }
    packethandlerinternal(packet){
        let parsed = JSON.parse(packet);
        this.packethandlercallback(parsed);
    }
}
