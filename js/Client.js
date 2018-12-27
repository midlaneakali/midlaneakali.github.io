var ws;
var MyPlayerId;
var game;
function Connect() {
  //
  if ("WebSocket" in window) {

    game = new Game('beginner');
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = function () {

        
        //reset the game with game.init();
        //game.init();
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
  console.log(Packet);
  switch (Packet.PacketId) {

    case PacketId.Move:
      {
        HandleMovePacket(Packet);
      }
      break;
      case PacketId.MyId:{

        MyPlayerId = Packet.Id;
        console.log(MyPlayerId+":"+Packet.Id)
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
    
    if(Packet.PlayerScored == true){
      console.log(MyPlayerId);
      console.log(Packet.Id);
      if(Packet.Id == MyPlayerId){
        zone.isMine = true;
        zone.isApponentMine = false;
      }
      else{
        zone.isApponentMine = true;
        zone.isMine = false;
      }
      
      game.decreaseLeftMineCount();
    }
    else{
      zone.setMineCount(element.Cell);
      zone.isMine = false;
      zone.isApponentMine = false;
    }
    
    zone.reveal();

  });


}


var PacketId = {
  Win:  0,
	Lose: 1,
	Move: 2,
	Turn: 3,
	ApponentTurn: 4,
	InGame: 5,
	Rejoin: 6,
	Time:   7,
	Tie:  8,
	MyId: 9,
	Nop0: 10,
	Score:  11,
  Status: 12,
	GameOver: 13,
	LeaveGame:  14,
  Nop1:      15,
  ChallengeRequest: 16,
  ChallengeResponse:  17,
  ToggleRequests: 18,
  AllPlayers: 19,
  Nop2: 20
};