var ws;
var MyPlayerId;

function Connect() {
  //
  if ("WebSocket" in window) {


    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = function () {

        new Game('beginner');
    };
    //RecordingStream test! 
    ws.onmessage = function (evt) {
      var received_msg = evt.data;
        console.log(received_msg);
    

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