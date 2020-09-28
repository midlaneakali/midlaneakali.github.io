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
        this.MOVE = 1;
        this.TURN = 2;
        this.IN_GAME = 3;
        this.REJOIN = 4;
        this.TIME = 5;
        this.MYID = 6;
        this.GAME_OVER = 7;
        this.GAME_TERMINATED = 8;
        this.LEAVE_GAME = 9;
        this.LOAD_PAST_GAME = 10;
        this.ALERT = 11;
        this.CHALLENGE_REQUEST = 12;
        this.TOGGLE_REQUESTS = 13;
        this.ALL_PLAYERS = 14;
        this.SERVER_REQUEST_INFO = 15;
        this.STRING_MESSAGE = 16;
        this.SPECTATE = 17;
        this.STOP_SPECTATE = 18;
        this.SPECTATE_STARTED = 19;
        this.SPECTATE_STOPPED = 20;
    }
}
class IdentifierConstants{
    constructor(){
        this.packet = new PacketIdentifiers();
        this.colours = new PlayerColourIdentifiers();
    }
}