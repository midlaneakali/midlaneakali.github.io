var Game = function(level) {
   var els = els || {};
//    this.levels = {
//       beginner: {
//          dimension: 9,
//          mineCount: 10
//       },
//       intermediate: {
//          dimension: 16,
//          mineCount: 40
//       },
//       advanced: {
//          dimension: 21,
//          mineCount: 80
//       }
//    }
   

   var elBoard = els.screen || '.game-board';
   var elTimer = els.timer || '.game-time';
   var elMine = els.mine || '.game-mines-count';
   var elMyId = els.myId || '.game-id-mine';
   var elMyScore = els.myScore || '.game-score-mine';
   var elOpponent = els.opponentScore || '.game-score-opponent';
   //var elTurn = els.playerTurn || 'game-player-turn';
//   var elRestartButton = els.restartButton || '.game-restart-button';
//    var elLevel = els.level || '.game-level';

   this.els = {}
   this.els.board = document.querySelector(elBoard);
   this.els.time = document.querySelector(elTimer);
   this.els.mine = document.querySelector(elMine);
   this.els.myId = document.querySelector(elMyId);
   this.els.myScore = document.querySelector(elMyScore);
   this.els.opponentScore = document.querySelector(elOpponent);
   //this.els.playerTurn = document.querySelector(elTurn);
//   this.els.restartButton = document.querySelector(elRestartButton);
//    this.els.level = document.querySelector(elLevel);

   this.dimension = 16;
   this.mineCount = 51;
   this.timer = null;
   this.myScore = 0;
   this.opponentScore = 0;

//    this.setLevel(level);

   this.isGameOver = false;
   this.initialize = false;
   this.time = 0;
   this.leftMineCount = this.mineCount;
   this.board = new Board(this.els.board);

   this.init();
}
Game.prototype.setTurn = function(turn){
    //this.els.playerTurn.textContent = "test";
    document.getElementById("game-player-turn-id").textContent = turn;
}
Game.prototype.setSelfId = function(identification){
    this.els.myId.textContent = identification;
}
Game.prototype.updateSelfScore = function(){
    ++this.myScore;
    this.els.myScore.textContent = this.myScore;
}
Game.prototype.updateOpponentScore = function(){
    ++this.opponentScore;
    this.els.opponentScore.textContent = this.opponentScore;
}
Game.prototype.setLevel = function(level) {
//    var option;

//    this.dimension = this.levels[level].dimension;
//    this.mineCount = this.levels[level].mineCount

//    option = this.els.level.querySelector('option[value="'+ level +'"]');
//    option.selected = true;
}

Game.prototype.startTimer = function() {
   this.timer = setInterval(function() {
      ++this.time;
      this.els.time.textContent = this.time;
   }.bind(this), 1000);
}

Game.prototype.stopTimer = function() {
   clearInterval(this.timer);
}

Game.prototype.init = function() {
   this.isGameOver = false;
   this.time = 0;
   this.els.time.textContent = 0;
   this.els.mine.textContent = this.mineCount;
   this.leftMineCount = this.mineCount;

   this.stopTimer();
   this.board.init(this.dimension, this.mineCount);
   
   if (! this.initialize) {
      this.listen();
   }

   this.initialize = true;
}

Game.prototype.isWin = function() {
   return this.board.getNotReleavedZones().length <= this.mineCount;
}

Game.prototype.gameover = function(isWin) {
   var win = isWin || false;

   this.stopTimer();
   this.isGameOver = true;
   this.board.reveal();

   if (win) {
      alert('You win!');
   }
}

Game.prototype.listen = function() {
//   this.els.restartButton.addEventListener('click', this.restartClickHandler.bind(this));
//    this.els.level.addEventListener('change', this.levelChangeHandler.bind(this));
   this.board.element.addEventListener('click', this.leftClickHandler.bind(this));
   this.board.element.addEventListener('contextmenu', this.rightClickHandler.bind(this));
}

Game.prototype.restartClickHandler = function() {
//    this.init();
}

Game.prototype.levelChangeHandler = function(event) {
//    this.setLevel(event.target.value);
//    this.init();
}

Game.prototype.leftClickHandler = function(event) {
//    if (this.isGameOver || ! event.target.classList.contains('zone')) {
//       return;
//    }
   if (!event.target.classList.contains('zone')) {
      return;
   }
   let zone = this.findZoneByEvent(event);
   send({PacketId:2,YPosition:parseInt(zone.y),XPosition:parseInt(zone.x)});
//    if (this.time == 0) {
//       this.startTimer();
//    }

//    if (zone.isFlagged) {
//       return;
//    }

//    if (zone.isMine) {
//       zone.element.classList.add('is-clicked');
//       return this.gameover();
//    }

//  zone.reveal();

//    if (zone.isEmpty) {
//       this.board.revealZoneNeighbors(zone);
//    }

//    if (this.isWin()) {
//       return this.gameover(true);
//    }
}

Game.prototype.rightClickHandler = function(event) {
   event.preventDefault();

//    if (this.isGameOver || ! event.target.classList.contains('zone')) {
//       return;
//    }

//    var zone = this.findZoneByEvent(event);

//    if (zone.isFlagged) {
//       this.increaseLeftMineCount();
//       zone.setUnflagged();
//    } else {
//       this.decreaseLeftMineCount();
//       zone.setFlagged();
//    }
}

Game.prototype.findZoneByEvent = function(event) {
   var x = event.target.getAttribute('x');
   var y = event.target.getAttribute('y');
   return this.board.zones[y][x];
}

Game.prototype.decreaseLeftMineCount = function() {
   this.leftMineCount--;
   this.els.mine.textContent = this.leftMineCount;
}

Game.prototype.increaseLeftMineCount = function() {
//    this.leftMineCount++;
//    this.els.mine.textContent = this.leftMineCount;
}