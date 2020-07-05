/*
Protocol revision 2.5
*/
var ws;
var MyPlayerId;
var game;
var lastZone;
var interval;
var timeremaining;
var elapsed;
function Connect() {
  //
  if ("WebSocket" in window) {

    game = new Game('beginner');
    ws = new WebSocket("wss://jdragon.me:8080");
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
       // alert("Game begun!");
        document.getElementById("my-game-status").innerText = "Game"
        var parent = document.getElementsByClassName("game-board")[0];
        while(parent.lastChild){
          parent.removeChild(parent.lastChild);
        }
        game = new Game("blue");
        document.getElementById("join-leave-game-queue").innerText = "Leave";
        document.getElementById("my-session-id").innerText = Packet.SessionId.toString(16);
        game.destroystats();
        game.initgamestats();
      }
      break;
      case PacketId.Time:{
        
        timeremaining =  Packet.Remaining;
        elapsed = Date.now();
        let timeelement = document.getElementById("time-value-id");
        if(timeelement != null ){
          if(timeelement != undefined){
            timeelement.textContent = Packet.Remaining;
            clearInterval(interval);
            interval = setInterval(() => {
              let now = Date.now();
              elapsed = now - elapsed;
              timeremaining -=elapsed;
              elapsed = now;
              document.getElementById("time-value-id").textContent = (timeremaining/1000.0).toFixed(2);
            }, 10);
          }
        }
        
      }
      break;
      case PacketId.SpectateStarted:{
        game = new Game("blue");
        game.destroystats();
        game.initspectatorstats();
      }
      break;
      case PacketId.Rejoin:{
        ingame = true;
        document.getElementById("join-leave-game-queue").innerText = "Leave";
      }
      break;
      case PacketId.Win:{
        if(!Packet.spectate){
          ingame = false;
        alert("You win!");
        document.getElementById("join-leave-game-queue").innerText = "Join Queue";
        }else{
          if(Packet.Colour == ColourId.kBlue){
            alert("Blue wins!");
          }else if(Packet.Colour == ColourId.kBlack){
            alert("Black wins!");
          }
        }
        
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
        game.destroystats();
      }
      break;
      case PacketId.Turn:{
        if(Packet.spectate){
          if(Packet.Colour == 1)
            game.setturn("Blue");
          else if(Packet.Colour == 2){
            game.setturn("Black");
          }
        }else{
          game.setturn("You");
        }
        

      }
      break;
      
      case PacketId.LeaveGame:{
        ingame = false;
        document.getElementById("join-leave-game-queue").innerText = "Join Queue";
        game.destroystats();
      }
      break;
      case PacketId.AllPlayers:{
        document.getElementById("online-player-count").innerText = Packet.PlayerCount;
      }
      break;
      case PacketId.ApponentTurn:{
        if(Packet.spectate){
          if(Packet.Colour == 1)
            game.setturn("Blue");
          else if(Packet.Colour == 2){
            game.setturn("Black");
          }
        }else{
          game.setturn("Them");
        }

        
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
        Packet.Position.forEach(element =>{
          let zone = game.board.zones[element.YPosition][element.XPosition];
          zone.Nop2();
        });
      }
      break;
      case PacketId.sendstringmessage:{

        let chatcontainer = document.getElementsByClassName("messages")[0];
      
        if(Packet.Id ==MyPlayerId){
          let mymessage = document.createElement("p");
          mymessage.className = "from-me";
          mymessage.appendChild(document.createTextNode(Packet.Chat));
          chatcontainer.appendChild(mymessage);
          document.getElementById("player-send-message").value = "";
        }else{
        //  let notify = document.getElementById("notaudio");
         // notify.play();
        //  notify.onended = function(){
            
          //}

            let mymessage = document.createElement("p");
            mymessage.className = "from-them";
            mymessage.appendChild(document.createTextNode(Packet.Chat));
            chatcontainer.appendChild(mymessage);

        }
        chatcontainer.scrollTop = chatcontainer.scrollHeight; 
        
        if(chatcontainer.childNodes.length>15){
          chatcontainer.removeChild(chatcontainer.firstChild);
        }
        
      }
      break;
    default:
      console.log("Packet id not found:"+Packet.PacketId);
      break;
  }
}

function HandleMovePacket(Packet) {
 // document.getElementById("tickaudio").play();
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
      if(Packet.spectate){
        if(Packet.Colour == ColourId.kBlue){
          zone.isMine = true;
          game.incrementselfscore();
        }else{
          zone.isApponentMine = true;
          game.incrementapponentscore();
        }
      }
      else if(Packet.Id == MyPlayerId){
        zone.isMine = true;
        game.incrementselfscore();
      }
      else{
        zone.isApponentMine = true;
        game.incrementapponentscore();
      }
      
      game.decreaseminecount();
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
function gethhmmss(){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  return ""+h+":"+m+":"+s;
}
function sendstringmessage(event){
  if(event.which == 13){
    m = document.getElementById("player-send-message");
    //console.log(m.value);
    packet  = {
      PacketId: 21,
      Chat: m.value
    };
    ws.send(JSON.stringify(packet));
  }

}

var ColourId = {
  kNone: 0,
  kBlue: 1,
  kBlack: 2,
  kRed: 3,
  kGreen: 4,
  

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
  Nop2: 20,
  sendstringmessage: 21,
  Spectate: 22,
  StopSpectate: 23,
  SpectateStarted: 24,
  SpectateStopped:25
};