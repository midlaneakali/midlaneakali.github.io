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
        this.kMove = 1;
        this.kTurn = 2;
        this.kInGame = 3;
        this.kQueLeave = 4;
        this.kTime = 5;
        this.kMyId = 6;
        this.kGameOver = 7;
        this.kGameTerminated = 8;

        this.kLoadPastGame = 10;
        this.kAlert = 11;
        this.kChallengeRequest = 12;
        this.kToggleRequest = 13;
        this.kAllPlayers = 14;
        this.kServerRequestInfo = 15;
        this.kStringMessage = 16;
        this.kSpectate = 17;
        this.kStopSpectate = 18;
        this.kSpectateStarted = 19;
        this.kSpectateStopped = 20;
        this.kInQue = 21;
        this.kInLobby = 22;
    }
}
class IdentifierConstants{
    constructor(){
        this.packet = new PacketIdentifiers();
        this.colours = new PlayerColourIdentifiers();
    }
}