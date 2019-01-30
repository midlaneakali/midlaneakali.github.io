var ws;
var MyPlayerId;
var game;
var lastZone;
function Connect() {
  //
  if ("WebSocket" in window) {

    game = new Game('beginner');
    ws = new WebSocket("wss://cynosure.pw:8080");
    lastZone = null;
    nextTurn = false;
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
  switch (Packet.PacketId) {

    case PacketId.Move:
      {
        HandleMovePacket(Packet);
      }
      break;
      case PacketId.MyId:{

        MyPlayerId = Packet.Id;
        // game.setSelfId(MyPlayerId);
      }
      break;
      case PacketId.InGame:{
        alert("Game begun!");
      }
      break;
      case PacketId.Win:{
        alert("You win!");
      }
      break;
      case PacketId.Lose:{
        alert("You lose!");
      }
      break;
      case PacketId.Turn:{
        game.setTurn("Mine");
      }
      break;
      case PacketId.ApponentTurn:{
        game.setTurn("Opponent");
      }
      break;
    default:
      console.log("Packet id not found");
      break;
  }
}

function HandleMovePacket(Packet) {
  console.log(Packet);
  var selected = false;
  if(lastZone != null){
    lastZone.isLastMove = false;
    lastZone.reveal();
  }
  Packet.Position.forEach(element => {

    let zone = game.board.zones[element.YPosition][element.XPosition];
    if(!selected && !Packet.PlayerScored){
      lastZone = zone;
      zone.isLastMove = true;
      selected = true;
    }
    if(Packet.PlayerScored == true){
      console.log(MyPlayerId);
      console.log(Packet.Id);
      if(Packet.Id == MyPlayerId){
        zone.isMine = true;
        game.updateSelfScore();
      }
      else{
        zone.isApponentMine = true;
        game.updateOpponentScore();
      }
      
      game.decreaseLeftMineCount();
    }
    else{
      zone.setMineCount(element.Cell);
    }
    if(element.Cell == 0){
      zone.setEmpty();
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