var ws;
var MyPlayerId;
var Live = false;
var MyScore;
var OpponentScore;
function HandleWinPacket(Packet) {
  DrawHUD(MyPlayerId, null, MyScore, OpponentScore, "Winner");

}
function HandleLossPacket(Packet) {
  DrawHUD(MyPlayerId, null, MyScore, OpponentScore, "Loser");

}
function HandleMovePacket(Packet) {
  Packet.Position.forEach(element => {

    DisableCell(element.XPosition, element.YPosition, element.Cell);
  });
  ClickSound.play();

}
function HandleYourTurnPacket(Packet) {
  DrawHUD(MyPlayerId, "Yours", MyScore == 0 ? null : MyScore, OpponentScore == 0 ? null : OpponentScore);

}
function HandleOpponentTurnPacket(Packet) {
  DrawHUD(MyPlayerId, "Opponent's", MyScore, OpponentScore);

}
function HandleBeginGamePacket(Packet) {

  MyScore = 0;
  OpponentScore = 0;
  DrawHUD(MyPlayerId);
  MineSound.play();
  DrawGameboard();
  alert("Game has begun!");

  // document.getElementById("MyScore").innerHTML = "-";
  // document.getElementById("ApponentScore").innerHTML = "-";
  //Redraw Canvas here later on.

}
function HandleScorePacket(Packet) {
  Packet.Position.forEach(element => {
   // console.log("Score from:" + element.Id);
    if (element.Id == MyPlayerId) {
      MineHit(element.XPosition, element.YPosition, true);
      // document.getElementById("MyScore").innerHTML = element.Score;
      MyScore = element.Score;
      DrawHUD(MyPlayerId, "Yours", MyScore, OpponentScore);

    }
    else {
      MineHit(element.XPosition, element.YPosition, false);
      // document.getElementById("ApponentScore").innerHTML = element.Score;
      OpponentScore = element.Score;
      DrawHUD(MyPlayerId, "Opponent's", MyScore, OpponentScore);
    }
  });
  MineSound.play();

}
function HandleMyIdPacket(Packet) {
//  console.log("My Id:" + Packet.Id);
  MyPlayerId = Packet.Id;
  DrawHUD(MyPlayerId);

}
function HandleChallengeRequestPacket(Packet) {
  switch (Packet.RequestType) {
    case 0:
      alert("Player Id does not exist");
      break;
    case 1:
      alert("The player is not accepting challenges");
      break;
    case 2:
      alert("Challenge request sent");
      break;
    case 3:
      // alert("Incoming challenge request from:" + Packet.ChallengerId);
      if (confirm("Incoming challenge request from:" + Packet.ChallengerId + "\nClick OK to accept otherwise click cancel")) {
        //console.log("Accepting challenge");
        var Packet = {
          PacketId: 17,
          Status: true,
          Id: Packet.ChallengerId
        };
        SendToServer(JSON.stringify(Packet));
      }
      else {
        // console.log("Denying challenge");
        var Packet = {
          PacketId: 17,
          Status: false,
          Id: Packet.ChallengerId
        };
        SendToServer(JSON.stringify(Packet));
      }
      break;
    case 4:
      alert("You can't challenge yourself");
      break;
    default:
      break;
  }

}
function HandleChallengeResponsePacket(Packet) {
  if (Packet.RequestType == 0) {
    alert("Player denied your challenge request");
  }

}
function HandleServerResponsePacket(Packet) {
  switch (Packet.ServerResponseMessage) {
    case 0:
      {

        Packet.Coordinates.forEach(element => {

          DrawMines(element.X, element.Y);
        });
      }
      break;
    case 1: {
      Packet.Coordinates.forEach(element => {
        DrawZeros(element.X, element.Y);
      });

    }
      break;

    default:
  }

}

function HandlePacketId(received_msg) {
  var Packet = JSON.parse(received_msg);
  switch (Packet.PacketId) {
    case 0:
      {
        // document.getElementById("MyScore").innerHTML = "Winner";
        // document.getElementById("ApponentScore").innerHTML = "Loser";
        HandleWinPacket(Packet);
      }
      break;


    case 1: //Player lost the game but tell them nicely.
      {
        // document.getElementById("MyScore").innerHTML = "Loser";
        // document.getElementById("ApponentScore").innerHTML = "Winner";
        HandleLossPacket(Packet);
      }
      break;


    case 2:
      {
        HandleMovePacket(Packet);
      }
      break;


    case 3:
      {

        // document.getElementById("Turn").innerHTML = "Yours";
        HandleYourTurnPacket(Packet);

      }
      break;


    case 4:
      {
        // document.getElementById("Turn").innerHTML = "Opponent's";
        HandleOpponentTurnPacket(Packet);
      }
      break;


    case 5:
      {
        HandleBeginGamePacket(Packet);

      }
      break;

    case 7:
      {

      }
      break;
    case 11:
      {
        HandleScorePacket(Packet);
      }
      break;


    case 9:
      {
        HandleMyIdPacket(Packet);
      }
      break;


    case 12:
      {
        alert(Packet.Message);
      }
      break;


    case 13:
      {
        alert("Game Over!");
        // document.getElementById("Turn").innerHTML = "-";
      }
      break;



    case 16:
      {
        HandleChallengeRequestPacket(Packet);
      }
      break;



    case 17:
      {
        HandleChallengeResponsePacket(Packet);
      }
      break;



    case 19: {

    }
      break;


    case 20: {
      HandleServerResponsePacket(Packet);
    }
      break;

    default:
      console.log("Packet id not found");
      break;
  }
}
function Connect() {
  //
  if ("WebSocket" in window) {


    ws = new WebSocket("wss://synosure.me:8080");

    ws.onopen = function () {

      Live = true;
      //Edit this later

    };
    //RecordingStream test! 
    ws.onmessage = function (evt) {
      var received_msg = evt.data;
      RecordingStream+=received_msg+"\r\n";
      
      //console.log(Packet.PacketId);
      HandlePacketId(received_msg);
    };

    ws.onclose = function () {
      Live = false;
      // websocket is closed.
      //alert("Connection is closed..."); 
      alert("Server offline try again soon!");
      // document.getElementById("GamePlay").hidden = true;
      // document.getElementById("Login").hidden = false;
    };
  } else {

    // The browser doesn't support WebSocket

  }

}

function SendToServer(message) {
  ws.send(message);
}

function LeaveGame() {
  var Packet = {
    PacketId: 14
  };
  SendToServer(JSON.stringify(Packet));
  // document.getElementById("Turn").innerHTML = "-";
  // document.getElementById("MyScore").innerHTML = "-";
  // document.getElementById("ApponentScore").innerHTML = "-";
  DrawHUD(MyPlayerId);
}
function JoinQueue() {
  var Packet = {
    PacketId: 6
  };
  SendToServer(JSON.stringify(Packet));
  // document.getElementById("Turn").innerHTML = "Queueing";
  // document.getElementById("MyScore").innerHTML = "-";
  // document.getElementById("ApponentScore").innerHTML = "-";
  DrawHUD(MyPlayerId, "Queueing");
}
function RequestChallenge() {
  // var Entered = prompt("Enter Player ID To challenge",0);
  // if(Entered == null || Entered == "")
  //   return;
  TargetId = parseInt(PlayerIdInput.value(), 10);

  var Packet = {
    PacketId: 16,
    Id: TargetId
  };
  console.log(Packet);
  SendToServer(JSON.stringify(Packet));
}
var Toggle = true;
function ToggleRequests() {
  var Packet = {
    PacketId: 18
  };
  SendToServer(JSON.stringify(Packet));
  Toggle = !Toggle;
  if (Toggle)
    alert("Challenge requests allowed");
  else
    alert("Challenge requests disabled");

}
function Login() {
  // document.getElementById("GamePlay").hidden = false;
  // document.getElementById("Login").hidden = true;
}
//
/*
enum PacketId
{
	WIN, == 0
	LOSE, == 1
	MOVE, == 2
	TURN, == 3
	APPONENTTURN, == 4
	IN_GAME, == 5
	REJOIN, == 6
	TIME, == 7
	TIE, == 8
	MYID, == 9
	TEAMID, == 10
	SCORE, == 11
    STATUS, == 12
	GAME_OVER, == 13
  LEAVE_GAME == 14
  ALERT == 15
  CHALLENGE_REQUEST == 16
  CHALLENGE_RESPONSE == 17
  TOGGLE_REQUEST == 18
  ALL_PLAYERS = 19
  NOP = 20
};

*/
