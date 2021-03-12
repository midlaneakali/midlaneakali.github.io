window.addEventListener('DOMContentLoaded', (event) => {
    // let con = null;
    let con = new Connection(packethandler);
    var game = null;
    generateboard();
    function setminefortile(xposition, yposition, owner) {
        ++minecount;
        let myingamepid = localStorage.getItem('ingamepid');
        if (owner == myingamepid) {
            document.querySelectorAll('.you p').innerText++;
        } else {
            document.querySelectorAll('.them p').innerText++;
        }
        document.getElementById('mine-count').innerText = minecount;
        let tile = game.tiles[xposition][yposition];
        tile.setowner(owner);
        tile.setmine();
        tile.disable();
    }
    function setvaluefortile(xposition, yposition, owner, value) {
        let tile = game.tiles[xposition][yposition];
        tile.setowner(owner);
        tile.setvalue(value);
        tile.disable();
    }
    function packethandler(packet) {
        console.log(packet);
        switch (packet.pid) {
            case con.identifiers.packet.kMove: {

                if (packet.ismine) {
                    setminefortile(packet.xposition, packet.yposition, packet.player);

                } else {
                    for (let e of packet.tiles) {
                        setvaluefortile(e.xposition, e.yposition, packet.player, e.value);


                    }
                }
            }
                break;
            case con.identifiers.packet.kMyId: {
                localStorage.setItem('playerid', packet.playerid);
                document.getElementById('pid').innerText = 'Player id: ' + packet.playerid;
            }
                break;
            case con.identifiers.packet.kUuid: {
                localStorage.setItem('selfid', packet.selfid);

            }
                break;
            case con.identifiers.packet.kAllPlayers: {
                document.getElementById('player-count').innerText = 'Player Count: ' + packet.count;
            }
                break;
            case con.identifiers.packet.kInGame:


                localStorage.setItem('gameid', packet.gameid);
                localStorage.setItem('selfid', packet.selfid);
                localStorage.setItem('ingamepid', packet.player);
                document.getElementById('session-id').innerText = 'Session Id: '+packet.gameid;
                if (packet.playerturn == packet.player) {
                    document.getElementById('player-turn').innerText = 'You';
                } else {
                    document.getElementById('player-turn').innerText = 'Them';
                }
                //document.getElementById('score-you').innerText = 0;
                //document.getElementById('score-them').innerText = 0;
                generateboard();
                document.querySelectorAll('.them p').innerText = 0;
                document.querySelectorAll('.you p').innerText = 0;
                if (packet.tiles) {
                    for (let e of packet.tiles) {
                        if (e.ismine) {
                            setminefortile(e.xposition, e.yposition, e.owner);
                        } else {
                            setvaluefortile(e.xposition, e.yposition, e.owner, e.value);
                        }
                    }
                }
                break;
            case con.identifiers.packet.kGameOver:
            case con.identifiers.packet.kInLobby:
            case con.identifiers.packet.kGameTerminated: {


                localStorage.setItem('gameid', null);
                localStorage.setitem('ingamepid', null);
            }
                break;
            case con.identifiers.packet.kTurn: {
                let ingameid = localStorage.getItem('ingamepid');
                if (packet.playerturn == ingameid) {
                    document.getElementById('player-turn').innerText = 'You';
                } else {
                    document.getElementById('player-turn').innerText = 'Them';
                }
            }
                break;
        }
    }
    function generateboard() {
        //destroy old
        //create new
        var rows = document.querySelectorAll('.row');
        rows.forEach(e => {
            let cells = e.querySelectorAll('.cell');
            cells.forEach(c => {
                c.remove();
            });
            e.remove();
        });
        game = new Gameboard(xtilecount, ytilecount);
        rows = document.querySelectorAll('.row');
        rows.forEach(e => {
            let cells = e.querySelectorAll('.cell');
            cells.forEach(c => {
                c.addEventListener('click', cellclickevent);
            })
        })
    }
    function cellclickevent(e) {
        let cell = e.target;
        x = cell.getAttribute('x');
        y = cell.getAttribute('y');
        con.send({ pid: con.identifiers.packet.kMove, xposition: x, yposition: y });
    }
    function queclickevent(e) {
        con.send({ pid: con.identifiers.packet.kQueLeave });
    }
    function toggleclickevent(e) {
        con.send({ pid: con.identifiers.packet.kToggleRequests });
    }
    function leaveclickevent(e) {
        con.send({ pid: con.identifiers.packet.kQueLeave });
    }
    function challengeclickevent(e) {

    }
    // generateboard();

    document.getElementById('que-button').addEventListener('click', queclickevent);
    document.getElementById('toggle-button').addEventListener('click', toggleclickevent);
    document.getElementById('leave-button').addEventListener('click', leaveclickevent);
    document.getElementById('challenge-button').addEventListener('click', challengeclickevent);
});