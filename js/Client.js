/*
Protocol revision 2.2
*/
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
  console.log(Packet);
  switch (Packet.PacketId) {

    case PacketId.Move:
      {
        HandleMovePacket(Packet);
      }
      break;
      case PacketId.MyId:{

        MyPlayerId = Packet.Id;
        document.getElementById("my-player-id").innerText = MyPlayerId.toString(16);
        // game.setSelfId(MyPlayerId);
      }
      break;
      case PacketId.InGame:{
        ingame = true;
        alert("Game begun!");
        document.getElementById("my-game-status").innerText = "In Game"
        var parent = document.getElementsByClassName("game-board")[0];
        while(parent.lastChild){
          parent.removeChild(parent.lastChild);
        }
        game = new Game('beginner');
        document.getElementById("join-leave-game-queue").innerText = "Leave";
      }
      break;
      case PacketId.Rejoin:{
        ingame = true;
        document.getElementById("join-leave-game-queue").innerText = "Leave";
      }
      break;
      case PacketId.Win:{
        ingame = false;
        alert("You win!");
        document.getElementById("join-leave-game-queue").innerText = "Join Queue";
      }
      break;
      case PacketId.Lose:{
        ingame = false;
        alert("You lose!");
        document.getElementById("join-leave-game-queue").innerText = "Join Queue";
      }
      break;
      case PacketId.GameOver:{
        ingame = false;
        alert("Game Over");
        document.getElementById("my-game-status").innerText = "Lobby";
        document.getElementById("join-leave-game-queue").innerText = "Join Queue";

      }
      break;
      case PacketId.Turn:{
        game.setTurn("Mine");
      }
      break;
      case PacketId.LeaveGame:{
        ingame = false;
        document.getElementById("join-leave-game-queue").innerText = "Join Queue";
      }
      break;
      case PacketId.AllPlayers:{
        document.getElementById("online-player-count").innerText = Packet.PlayerCount;
      }
      break;
      case PacketId.ApponentTurn:{
        game.setTurn("Opponent");
      }
      break;
      case PacketId.ToggleRequests:{
        alert("Allow Requests: "+Packet.allowed);
      }
      break;
      case PacketId.ChallengeRequest:{
        switch(Packet.RequestType){
          case 0:{
            alert("Player id does not exist");
          }
          break;
          case 1:{
            alert("Target is not accepting challenge requests");
          }
          break;
          case 2:{
            alert("Challenge request sent!");
          }
          break;
          case 3:{
            if(confirm("Accept challenge from: "+Packet.ChallengerId.toString(16))){
              send({PacketId: PacketId.ChallengeResponse,Id: Packet.ChallengerId, Status: true});
            }
            else{
              send({PacketId: PacketId.ChallengeResponse,Id: Packet.ChallengerId, Status: false});
            }
          }
          break;
          case 4:{
            alert("Don't challenge yourself, you maniac!");
          }
          break;
        }
      }
      break;
      case PacketId.ChallengeResponse:{
        switch(Packet.RequestType){
          case 0:{
            alert("Player denied your challenge request :(");
          }
          break;
        }
      }
      break;
      case PacketId.Nop2:{
        Packet.Coordinates.forEach(element =>{
          let zone = game.board.zones[element.Y][element.X];
          zone.Nop2();
        });
      }
      break;
    default:
      console.log("Packet id not found:"+Packet.PacketId);
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