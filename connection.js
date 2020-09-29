class Connection{
    constructor(packethandlercallback){
        this.packethandlercallback = packethandlercallback;
        this.ws = new WebSocket('ws://localhost:8080');
        this.ws.onmessage = this.onmessage.bind(this);
        this.ws.onopen = this.onopen.bind(this);
        this.ws.onclose = this.onclose.bind(this);
        this.identifiers = new IdentifierConstants();
    }
    onmessage(evt){
        let packet = evt.data;
        this.packethandlercallback(packet);
    }
    onopen(evt){

    }
    onclose(evt){

    }
    send(packet){
        this.ws.send(JSON.stringify(packet));
    }
}