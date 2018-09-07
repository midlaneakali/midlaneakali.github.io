
var RecordingStream;
var Recording;
var GameboardCell =
{
    Rows: 16,
    Cols: 16,
    width: 50,
    height: 50,
};
var LastHitX = 0;
var LastHitY = 0;
var LastCellValue = "";
var IsFirstMove = true;
var RecordPlayback;
var RedundantPlayback;
function InBounds(XPos, YPos) {
    return XPos >= 0 && YPos >= 0
        && XPos < GameboardCell.Cols && YPos < GameboardCell.Rows;
}
function HandleClickevent(evt) {
    rect = CanvasGameboard.getBoundingClientRect();

    var RelativeX = evt.clientX - rect.left;
    var RelativeY = evt.clientY - rect.top;

    var XPosition = Math.floor(RelativeX / GameboardCell.width);
    var YPosition = Math.floor(RelativeY / GameboardCell.height);
    console.log(XPosition + "," + YPosition);
    var Packet = {
        PacketId: 2,
        XPosition: XPosition,
        YPosition: YPosition
    };
    SendToServer(JSON.stringify(Packet));
}

function openAttachment() {

    document.getElementById('attachment').value = "";
   var Attachment =  document.getElementById('attachment');

   Attachment.click();
}
function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {
    if(x == 0){
        RecordPlayback = true;
    }
       callback();

       if (++x === repetitions) {
           RedundantPlayback = false;
           RecordPlayback = false;
           window.clearInterval(intervalID);
       }
    }, delay);
}

function PlayRedundantPackets(Packets) {

    var Index = 0;
    var Delay = 0;
    DrawGameboard();
    setIntervalX(function () {
        HandlePacketId(Packets[Index++]);
        

    }, Delay, Packets.length-1);
}
function PlayRelevantPackets(Packets) {

    var Index = 0;
    var Delay = 1000;
    DrawGameboard();
    setIntervalX(function () {
        HandlePacketId(Packets[Index++]);
        

    }, Delay, Packets.length-1);
}

function PlayPacketsFromBeginning(Packets){
    RedundantPlayback = true;
    PlayRedundantPackets(Packets[0].split("\r\n"));
    PlayRelevantPackets(Packets[1].split("\r\n"));
}
function fileSelected(e) {
    var file = e.files[0];

    if (!file) {
        return;
    }

    var reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function (e) {
        PlayPacketsFromBeginning(e.target.result.split("\r\n\r\n"));
    };
    

    reader.onloadend = function(e){
        console.log("Finished reading");
    };

    reader.onerror = function(e){
        console.log("Error occured");
    }
    
}

function HandleHUDClick(evt) {
    rect = CanvasHUD.getBoundingClientRect();

    var RelativeX = evt.clientX - rect.left;
    var RelativeY = evt.clientY - rect.top;
    var canvasColor = HitContext.getImageData(RelativeX, RelativeY, 1, 1).data; // rgba e [0,255]
    var Colour = {
        Red: canvasColor[0],
        Green: canvasColor[1],
        Blue: canvasColor[2]
    }

    if (Colour.Red == 0xfa && Colour.Green == 0xbc && Colour.Blue == 0x12) {
        console.log("Leave game");
        LeaveGame();
    }

    else if (Colour.Red == 0xf1 && Colour.Green == 0xbc && Colour.Blue == 0x11) {
        console.log("Join Queue");
        JoinQueue();
    }
    else if (Colour.Red == 0xf2 && Colour.Green == 0xbc && Colour.Blue == 0x12) {
        console.log("Toggle Requests");
        ToggleRequests();
    }
    else if (Colour.Red == 0xf3 && Colour.Green == 0xbc && Colour.Blue == 0x11) {
        console.log("Challenge");
        RequestChallenge();
    }
    else if (Colour.Red == 0xf3 && Colour.Green == 0xbc && Colour.Blue == 0x12) {

        Recording = !Recording;
        DrawStartStopRecord();

        if (Recording) {
            RecordingStream += "\r\n";
        }
        else {
            var blob = new Blob([RecordingStream], { type: "text/plain;charset=utf-8" });
            var timestamp = new Date();
            var timestampformat = timestamp.toTimeString().split(' ')[0];
            saveAs(blob, MyPlayerId + "-" + timestampformat);
        }

    }
    else if (Colour.Red == 0xf4 && Colour.Green == 0xbc && Colour.Blue == 0x11) {
        openAttachment();
    }
    else {

    }
}
var PlayerIdInput;
function DrawStartStopRecord() {
    HUDContext.clearRect(400, 60, 150, 20);
    if (!Recording) {
        HUDContext.fillText("Record", 425, 75, 150);
        HUDContext.strokeStyle = "#99aabb";
        HUDContext.strokeRect(400, 60, 150, 20);
        HitContext.fillStyle = "#f3bc12";
        HitContext.fillRect(400, 60, 150, 20);
    }

    else {
        HUDContext.fillText("Stop", 425, 75, 150);
        HUDContext.strokeStyle = "#99aabb";
        HUDContext.strokeRect(400, 60, 150, 20);
        HitContext.fillStyle = "#f3bc12";
        HitContext.fillRect(400, 60, 150, 20);
    }
}
function DrawHUD(playerid, turn, myscore, opponentscore, result) {
    HUDContext.clearRect(0, 0, CanvasHUD.width, CanvasHUD.height);

    HUDContext.fillStyle = "#000000";
    HUDContext.font = "20px Calibri";

    HUDContext.fillText("My Id: " + playerid, 0, 20, 150);

    if (turn)
        HUDContext.fillText("Turn: " + turn, 0, 40, 150);

    if (myscore)
        HUDContext.fillText("My Score: " + myscore, 0, 60, 150);

    if (opponentscore)
        HUDContext.fillText("Opponent's Score: " + opponentscore, 0, 80, 150);

    HUDContext.fillText("Leave Game", 225, 15, 150);
    HUDContext.strokeStyle = "#ff0000";
    HUDContext.strokeRect(200, 0, 150, 20);
    HitContext.fillStyle = "#fabc12";
    HitContext.fillRect(200, 0, 150, 20);

    HUDContext.fillText("Join Queue", 225, 45, 150);
    HUDContext.strokeStyle = "#0000ff";
    HUDContext.strokeRect(200, 30, 150, 20);
    HitContext.fillStyle = "#f1bc11";
    HitContext.fillRect(200, 30, 150, 20);

    HUDContext.fillText("Toggle Requests", 210, 75, 150);
    HUDContext.strokeStyle = "#00ff00";
    HUDContext.strokeRect(200, 60, 150, 20);
    HitContext.fillStyle = "#f2bc12";
    HitContext.fillRect(200, 60, 150, 20);

    HUDContext.fillText("Challenge Player", 410, 15, 150);
    HUDContext.strokeStyle = "#00ff00";
    HUDContext.strokeRect(400, 0, 150, 20);
    HitContext.fillStyle = "#f3bc11";
    HitContext.fillRect(400, 0, 150, 20);


    HUDContext.fillText("Objective: Hit 26 mines!", 600, 15, 150);
    if (result) {
        HUDContext.fillText("Result: " + result, 600, 45, 150);
    }


    PlayerIdInput = new CanvasInput({
        canvas: document.getElementById('HUD'),
        x: 400,
        y: 30,
        width: 140,
        height: 10,
        placeHolder: 'Enter Player ID'
    });

    DrawStartStopRecord();

    HUDContext.fillText("Playback", 625, 75, 150);
    HUDContext.strokeStyle = "#99aabb";
    HUDContext.strokeRect(600, 60, 150, 20);
    HitContext.fillStyle = "#f4bc11";
    HitContext.fillRect(600, 60, 150, 20);
}

function Initialise() {
    
    CanvasGameboard.addEventListener("click", HandleClickevent, false);
    CanvasHUD.addEventListener("click", HandleHUDClick, false);

    //DrawHUD(MyPlayerId,0,0,0);
    Recording = false;
    DrawGameboard();

}


function DrawGameboard() {

    //CanvasGameboard.addEventListener("ontouchstart", HandleClickevent, false);
    GameboardContext.clearRect(0, 0, CanvasGameboard.width, CanvasGameboard.height);
    LastCellValue = "";
    IsFirstMove = true;
    for (var Row = 0; Row < GameboardCell.Rows; ++Row) {
        for (var Cols = 0; Cols < GameboardCell.Cols; ++Cols) {
            var x = Cols * GameboardCell.width;
            var y = Row * GameboardCell.height;
            DrawRectangle(x, y);
        }
    }
}

function DrawRectangle(XPosition, YPosition) {
    rc.rectangle(XPosition, YPosition, GameboardCell.width, GameboardCell.height, {
        fill: "#AED6F1",
        roughness: 2.5,
        bowing: 1,
        // solid fill
        //fillStyle: "solid"
    });
}
function MineHit(XPosition, YPosition, MyScore) {
    var x = XPosition * GameboardCell.width;
    var y = YPosition * GameboardCell.height;
    GameboardContext.clearRect(x, y, GameboardCell.width, GameboardCell.height);
    if (MyScore) {
        rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
            fill: "#0000aa",
            //fillStyle: 'solid',
            roughness: 2.5,
            bowing: 1
        });
    }
    else {
        rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
            fill: "#aa0000",
            // fillStyle: 'solid',
            roughness: 2.5,
            bowing: 1
        });
    }

}
function DrawZeros(XPosition, YPosition) {
    var x = XPosition * GameboardCell.width;
    var y = YPosition * GameboardCell.height;
    GameboardContext.clearRect(x, y, GameboardCell.width, GameboardCell.height);
    rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
        fill: "#A569BD",
        //fillStyle: 'solid',
        roughness: 2.5,
        bowing: 1
    });
}
function DrawMines(XPosition, YPosition) {
    var x = XPosition * GameboardCell.width;
    var y = YPosition * GameboardCell.height;
    GameboardContext.clearRect(x, y, GameboardCell.width, GameboardCell.height);
    rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
        fill: "#F39C12",
        //fillStyle: 'solid',
        roughness: 2.5,
        bowing: 1
    });
}
function DisableCell(XPosition, YPosition, CellValue) {
    //("Disable cell:" + XPosition + "," + YPosition);
    var x = XPosition * GameboardCell.width;
    var y = YPosition * GameboardCell.height;
    GameboardContext.clearRect(x, y, GameboardCell.width, GameboardCell.height);
    rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
        fill: "#23223d",

        roughness: 2.5,
        bowing: 1 // solid fill
    });

    if (!IsFirstMove && LastCellValue != -1) {
        GameboardContext.clearRect(LastHitX, LastHitY, GameboardCell.width, GameboardCell.height);
        rc.rectangle(LastHitX, LastHitY, GameboardCell.width, GameboardCell.height, {
            fill: "#23223d",

            roughness: 2.5,
            bowing: 1
        });
        GameboardContext.fillStyle = "#000000";
        GameboardContext.font = "30px Calibri";
        GameboardContext.fillText(LastCellValue == 0 || LastCellValue == -1 ? "" : LastCellValue, LastHitX + GameboardCell.width / 2, LastHitY + GameboardCell.height / 2);

    }
    else {
        IsFirstMove = false;
    }

    if (CellValue != -1) {
        // "#6999B0";
        //GameboardContext.fillStyle = "#0E8203"
        //GameboardContext.fillRect(x,y,GameboardCell.width,GameboardCell.height);
        rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
            fill: "#0E8203",
            roughness: 2.5,
            bowing: 1
        });
    }
    GameboardContext.fillStyle = "#000000";
    GameboardContext.font = "30px Calibri";
    GameboardContext.fillText(CellValue == 0 || CellValue == -1 ? "" : CellValue, x + GameboardCell.width / 2, y + GameboardCell.height / 2);


    LastHitX = x;

    LastHitY = y;

    LastCellValue = CellValue;

}
