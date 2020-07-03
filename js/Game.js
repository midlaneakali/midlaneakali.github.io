

class Game{
   constructor(colour){
      this.minecount = 51;
      this.selfscore = 0;
      this.apponentscore = 0;
      this.colour = colour;
      
      this.board = new Board(document.getElementsByClassName("game-board")[0]);
      this.board.init(16,this.minecount);
      this.board.element.addEventListener('click',e=>{
         if (!event.target.classList.contains('zone')) {
            return;
         }
         let zone = this.findzonebyevent(e);
         send({PacketId:2,YPosition:parseInt(zone.y),XPosition:parseInt(zone.x)});
      });
   }
   findzonebyevent(event) {
      var x = event.target.getAttribute('x');
      var y = event.target.getAttribute('y');
      return this.board.zones[y][x];
   }
   
   setturn(turn){
      document.getElementById("turn-value-id").textContent = turn;
   }
   incrementselfscore(){

      ++this.selfscore;

      document.getElementById("my-score-value-id").textContent = this.selfscore;
   }
   incrementapponentscore(){
      
      ++this.apponentscore;
      document.getElementById("apponent-score-value-id").textContent = this.apponentscore;
   }
   decreaseminecount(){
      --this.minecount;
      document.getElementById("mine-count-value-id").textContent = this.minecount;
   }
   getselfscore(){
      return this.selfscore;
   }
   getapponentscore(){
      return this.apponentscore;
   }
   getminecount(){
      return this.minecount;
   }
   getcolour(){
      return this.colour;
   }
   initgamestats(){
      let gameheader = document.getElementsByClassName("game-header")[0];
      var divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Mines";
      var valchild = document.createElement("div");
      valchild.setAttribute("id","mine-count-value-id");
      valchild.innerText = 0;
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));
//
      divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Turn";
      valchild = document.createElement("div");
      valchild.setAttribute("id","turn-value-id");
      valchild.innerText = "You";
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));

      divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "You";
      valchild = document.createElement("div");
      valchild.setAttribute("id","my-score-value-id");
      valchild.innerText = 0;
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));

      divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Them";
      valchild = document.createElement("div");
      valchild.setAttribute("id","apponent-score-value-id");
      valchild.innerText = 0;
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));

      divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Time";
      valchild = document.createElement("div");
      valchild.setAttribute("id","time-value-id");
      valchild.innerText = 0;
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));
   }
   initspectatorstats(){

      let gameheader = document.getElementsByClassName("game-header")[0];
      var divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Mines";
      var valchild = document.createElement("div");
      valchild.setAttribute("id","mine-count-value-id");
      valchild.innerText = 0;
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));

      divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Turn";
      valchild = document.createElement("div");
      valchild.setAttribute("id","turn-value-id");
      valchild.innerText = "Blue";
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));

      divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Blue";
      valchild = document.createElement("div");
      valchild.setAttribute("id","my-score-value-id");
      valchild.innerText = 0;
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));

      divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Black";
      valchild = document.createElement("div");
      valchild.setAttribute("id","apponent-score-value-id");
      valchild.innerText = 0;
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));

      divchild = document.createElement("div");
      divchild.setAttribute("style","color: black");
      divchild.innerText = "Time";
      valchild = document.createElement("div");
      valchild.setAttribute("id","time-value-id");
      valchild.innerText = 0;
      divchild.appendChild(valchild);
      gameheader.appendChild(divchild);
      gameheader.appendChild(document.createElement("hr"));
   }
   destroystats(){
      let gameheader = document.getElementsByClassName("game-header")[0];
      while(gameheader.firstChild){
         gameheader.removeChild(gameheader.firstChild);
      }
   }


}
                    /*
Game.prototype.SpawnGameStats = function(){


   let gamegheader = document.getElementsByClassName("game-header")[0];
   
   divchild.className = "game-mines";
   
   var innerdivchild = document.createElement("div");
   innerdivchild.className = "game-mines-count";
   innerdivchild.innerText = 0;
   var valuedivchild = document.createElement("div");
   valuedivchild.innerText = "Mines";
   divchild.appendChild(valuedivchild);
   divchild.appendChild(innerdivchild);

   gamegheader.appendChild(divchild);
   let hr = document.createElement("hr");
   gamegheader.appendChild(hr);
  // this.els.mine.textContent = this.mineCount;



   divchild = document.createElement("div");
   divchild.className = "game-timer";
   divchild.setAttribute("style","color: black");
   divchild.innerText = 0;
   innerdivchild = document.createElement("div");
   innerdivchild.innerText = "Time";
   divchild.appendChild(innerdivchild);
   gamegheader.appendChild(divchild);
   gamegheader.appendChild(hr);
   this.els.time.textContent = 0;

   
}
Game.prototype.DespawnGameState = function(){

}
*/