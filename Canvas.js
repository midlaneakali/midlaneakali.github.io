
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

function InBounds(XPos, YPos) {
    return XPos >= 0 && YPos >= 0
        && XPos < GameboardCell.Cols && YPos < GameboardCell.Rows;
}
function HandleClickevent(evt){
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
function Initialise(){
    CanvasGameboard.addEventListener("click", HandleClickevent, false);
    DrawGameboard();
}
    

function DrawGameboard() {
    
    //CanvasGameboard.addEventListener("ontouchstart", HandleClickevent, false);
    GameboardContext.clearRect(0, 0, CanvasGameboard.width, CanvasGameboard.height);
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
      //  fill: "#66a5ad",
        roughness: 2.5,
        bowing: 1 // solid fill
    });
}
function MineHit(XPosition,YPosition,MyScore)
{
    var x = XPosition * GameboardCell.width;
    var y = YPosition * GameboardCell.height;
    if(MyScore){
        rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
            fill: "#0000aa",
            //fillStyle: 'solid',
            roughness: 2.5,
            bowing: 1
        });
    }
    else{
        rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
            fill: "#aa0000",
           // fillStyle: 'solid',
            roughness: 2.5,
            bowing: 1
        });
    }
    
}
function DisableCell(XPosition, YPosition, CellValue) {
    var x = XPosition * GameboardCell.width;
    var y = YPosition * GameboardCell.height;
    rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
        fill: "#b4b8c8",

        roughness: 2.5,
        bowing: 1 // solid fill
    });

    if(!IsFirstMove && LastCellValue != -1)
    {
        GameboardContext.clearRect(LastHitX,LastHitY,GameboardCell.width,GameboardCell.height);
        rc.rectangle(LastHitX, LastHitY, GameboardCell.width, GameboardCell.height, {
            fill: "#b4b8c8",

            roughness: 2.5,
            bowing: 1
        });
        GameboardContext.fillStyle="#000000";
        GameboardContext.font = "30px Calibri";
        GameboardContext.fillText(LastCellValue == 0   || LastCellValue == -1 ? "" : LastCellValue,LastHitX+GameboardCell.width/2,LastHitY+GameboardCell.height/2);

    }
    else
    {
        IsFirstMove = false;
    }

    console.log("X:"+LastHitX+","+LastHitY);
    if(CellValue != -1){
       // "#6999B0";
       //GameboardContext.fillStyle = "#0E8203"
        //GameboardContext.fillRect(x,y,GameboardCell.width,GameboardCell.height);
        rc.rectangle(x, y, GameboardCell.width, GameboardCell.height, {
            fill: "#0E8203",
            roughness: 2.5,
            bowing: 1
        });
    }
    GameboardContext.fillStyle="#000000";
    GameboardContext.font = "30px Calibri";
    GameboardContext.fillText(CellValue == 0   || CellValue == -1 ? "" : CellValue,x+GameboardCell.width/2,y+GameboardCell.height/2);


    LastHitX = x;

    LastHitY = y;

    LastCellValue = CellValue;
    
}
