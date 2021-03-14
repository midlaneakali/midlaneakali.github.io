window.addEventListener('DOMContentLoaded', (event) => {
    // let con = null;
    let con = new Connection(packethandler);
    var game = null;
    generateboard();
    var minecount = 0;
    function setminefortile(xposition, yposition, owner) {
        ++minecount;
        let myingamepid = localStorage.getItem('ingamepid');
        let img = document.createElement('img');
        if (owner == myingamepid) {
            //document.querySelectorAll('.you p').innerText++;
            let p = document.querySelectorAll('.you p');
            p.forEach(e => {
                e.innerText++;
            })
            img.setAttribute('src', 'assets/flagblue.png');
        } else {
            let p = document.querySelectorAll('.them p');
            p.forEach(e => {
                e.innerText++;
            })
            img.setAttribute('src', 'assets/flagblack.png');
        }
        if (minecount < 9)
            document.getElementById('mine-count').innerText = '0' + minecount;
        else
            document.getElementById('mine-count').innerText = minecount;
        let tile = game.tiles[xposition][yposition];
        tile.getelement().classList.add('not-empty');
        //  tile.getelement().setAttribute('style','background-image: url( "assets/flagblue.png" );');


        tile.getelement().appendChild(img);
        tile.setowner(owner);
        tile.setmine();
        tile.disable();
    }
    function setvaluefortile(xposition, yposition, owner, value) {
        let tile = game.tiles[xposition][yposition];
        let e = tile.getelement();
        e.classList.add('not-empty');
        switch (value) {
            case 1:
                e.classList.add('one');
                break;
            case 2:
                e.classList.add('two');
                break;
            case 3:
                e.classList.add('three');
                break;
            case 4:
                e.classList.add('four');
                break;
            case 5:
                e.classList.add('five');
                break;
            case 6:
                e.classList.add('six');
                break;
            case 7:
                e.classList.add('seven');
                break;
            case 8:
                e.classList.add('eight');
                break;
        }
        if (value != 0)
            e.innerText = value;
        tile.setowner(owner);
        tile.setvalue(value);
        tile.disable();
    }
    function packethandler(packetstring) {

        let packet = JSON.parse(packetstring);
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
                let playerid = packet.playerid;
                document.getElementById("pid").innerText = 'Player id: ' + playerid.toSTring(16);
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
                document.getElementById('session-id').innerText = 'Session Id: ' + packet.gameid;
                document.getElementById('que-button').innerText = 'In Game';
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
                localStorage.setItem('ingamepid', null);
                document.getElementById('session-id').innerText = 'Session Id: ';
                document.getElementById('que-button').innerText = 'Que';
                generateboard();
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
                case con.identifiers.packet.kChallenge:{
                    //notify player they are recieving a challenge
                    //allow them to accept/deny
                    
                }
                break;
            case 50: {
                packet.Position.forEach(element => {
                    game.tiles[element.XPosition][element.YPosition].getelement().classList.add('not-empty');
                });
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
                if (c.hasChildNodes()) {
                    c.removeChild(c.firstChild);
                }
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
        let packet = { pid: con.identifiers.packet.kMove, xposition: parseInt(x, 10), yposition: parseInt(y, 10) };
        console.log(packet);
        con.send(packet);
    }
    function queclickevent(e) {
        con.send({ pid: con.identifiers.packet.kQueLeave });
        document.getElementById('que-button').innerText = 'In Que';
    }
    function toggleclickevent(e) {
        con.send({ pid: con.identifiers.packet.kToggleRequests });
    }
    function leaveclickevent(e) {
        con.send({ pid: con.identifiers.packet.kQueLeave });
        generateboard();
        document.getElementById('que-button').innerText = 'Que';
    }
    function challengeclickevent(e) {
        var playerid = document.getElementById('challenge-id').value;
        if (id == "") {
            return;
        }

        send({ pid: con.identifiers.packet.kChallenge, playerid: parseInt(id, 16) });
    }
    // generateboard();
    document.getElementById('que-button').addEventListener('click', queclickevent);
    document.getElementById('toggle-button').addEventListener('click', toggleclickevent);
    document.getElementById('leave-button').addEventListener('click', leaveclickevent);
    document.getElementById('challenge-button').addEventListener('click', challengeclickevent);


    (function () {
        var timestamp = new Date().getTime();

        function checkResume() {
            var current = new Date().getTime();
            if (current - timestamp > 4000) {
                var event = document.createEvent("Events");
                event.initEvent("resume", true, true);
                document.dispatchEvent(event);
            }
            timestamp = current;
        }

        window.setInterval(checkResume, 1000);
    })();
    addEventListener("resume", function () {
        //  alert('Resuming this webapp');
        //location.reload();
    });
});
