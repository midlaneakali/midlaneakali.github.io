function getcolourforid(cid){
    switch(cid){
        case 1:
            return '#CCCCFF';
            break;
        case 2:
            return '#FFCCFF';
            break;
        case 3:
            return '#FFCCCC';
            break;
        case 4:
            return '#660066';
            break;
    }
}
class PlayerColourIdentifiers{
    constructor(){
        this.kNone = 0;
        this.kBlue = 1;
        this.kBlack = 2;
        this.kRed = 3;
        this.kGreen = 4;
        this.kNoMoreColours = 5;
    }
    
}
class PacketIdentifiers{
    constructor(){
        this.kNothing = 0;
        this.kNop1 = 1;
        this.kNop2 = 2;
        this.kNop3 = 3;
        this.kUuid = 4;
        this.kMove = 5;
        this.kInQue = 6;
        this.kInLobby = 7;
        this.kQueLeave = 8;
        this.kInGame = 8;
        this.kTurn = 9;
        this.kMyId = 10;
        this.kAllPlayers = 11;
        this.kGameTerminated = 12;
        this.kGameOver = 13;
        this.kSaveState = 14;
        this.kToggleRequests = 15;
    }
}
class IdentifierConstants{
    constructor(){
        this.packet = new PacketIdentifiers();
        this.colours = new PlayerColourIdentifiers();
    }
}