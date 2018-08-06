var Direction = {
    Right: true,
};
var ball;
var Context;
var Canvas;

var VelocityX = 0.01;
var VelocityY = -0.01;

function KeyboardHandler(event){
	if(event.code == "Space"){
		if(Direction.Right == true)
            Matter.Body.applyForce(ball,{x:ball.position.x,y:ball.position.y},{x:VelocityX,y:VelocityY})
        else
            Matter.Body.applyForce(ball,{x:ball.position.x,y:ball.position.y},{x:-VelocityX,y:VelocityY})
	}

	if(event.code == "ArrowRight"){
		Direction.Right = true;

	}
	if(event.code == "ArrowLeft"){
		Direction.Right = false;

	}
}

function GetTranslateCoordinates(XPosition,YPosition)
{
	var TranslateTo = {
		TranslateX : Canvas.width / 2  - 20/ 2 - XPosition,
		TranslateY : Canvas.height / 2 - YPosition
    };
	return TranslateTo;
}
function BeforeRender()
{
	var TranslateTo = GetTranslateCoordinates(ball.position.x,ball.position.y);
	Context.translate(TranslateTo.TranslateX,TranslateTo.TranslateY);
	
}
function AfterRender()
{
	Context.resetTransform();
}

function Init() {

    Canvas = document.getElementById("PhysicsTest");
    Context = Canvas.getContext("2d");
    window.addEventListener('keydown',KeyboardHandler,false);

    var engine = Matter.Engine.create();
    var world = engine.world;

    var render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    });



    ball = Matter.Bodies.circle(2500, 280, 20, {
        restitution: 1.0,
    });
    var ground = Matter.Bodies.rectangle(2500, 800, 5000, 100, {
        isStatic: true
    });

    Matter.World.add(world, ball);
    Matter.World.add(world, ground);
    Matter.Render.run(render);
    Matter.Engine.run(engine);

    Matter.Events.on(render,"beforeRender",BeforeRender);
    Matter.Events.on(render,"afterRender",AfterRender);
    

}