var ws;
var MyPlayerId;
var game;
function Connect() {
  //
  if ("WebSocket" in window) {


    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = function () {

        game = new Game('beginner');
    };
    //RecordingStream test! 
    ws.onmessage = function (evt) {
      var received_msg = evt.data;
      HandlePacketId(received_msg);
    };

    ws.onclose = function () {
      Live = false;

      alert("Server offline try again soon!");
    };
  } else {

    // The browser doesn't support WebSocket

  }
}
function send(packet){
    ws.send(JSON.stringify(packet));
}
function HandlePacketId(received_msg) {
  var Packet = JSON.parse(received_msg);
  switch (Packet.PacketId) {

    case 2:
      {
        HandleMovePacket(Packet);
      }
      break;


    default:
      console.log("Packet id not found");
      break;
  }
}

function HandleMovePacket(Packet) {
  console.log(Packet);
  Packet.Position.forEach(element => {

    let zone = game.board.zones[element.YPosition][element.XPosition];
    if(element.Cell == -1){
      zone.isMine = true;
      game.decreaseLeftMineCount();
    }
    else{
      zone.setMineCount(element.Cell);
      zone.isMine = false;
    }
    
    zone.reveal();

  });


}
  
