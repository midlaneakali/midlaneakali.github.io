
$(document).ready(function() {

    let game = new Gameboard(xtilecount,ytilecount);
    function renderloop(tick){
        requestAnimationFrame(renderloop);

       // window.ctx.clearRect(0,0,window.trueCanvas.width,window.trueCanvas.height);
        window.ctx.fillStyle = '#bdc3c7';
        window.ctx.fillRect(0,0,window.trueCanvas.width,window.trueCanvas.height);
        //window.ctx.fillStyle  = 'rgba(255,0,200,0.2)';
        game.draw(tick);
    }
    requestAnimationFrame(renderloop);
   // renderloop(0);
});