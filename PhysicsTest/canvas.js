var GameEngine;
function GetTranslateCoordinates(XPosition,YPosition)
{
	var TranslateTo = {
		TranslateX : Canvas.width / 2  - 20/ 2 - XPosition,
		TranslateY : Canvas.height / 2 - YPosition
	};
	return TranslateTo;
}
function OnGround(YPosition){
	if(YPosition > 955.0 && YPosition < 955.4)
		return true;
	return false;
}
var Ball;
var Floor;
function KeyboardHandler(event){
	if(event.code == "Space"){
		Matter.Body.applyForce(Ball,{x:Ball.position.x,y:Ball.position.y},{x:0.0,y:-2.0})

	}
	if(event.code == "ArrowRight"){
		Matter.Body.applyForce(Ball,{x:Ball.position.x,y:Ball.position.y},{x:1.0,y:0.0})

	}
	if(event.code == "ArrowLeft"){
		Matter.Body.applyForce(Ball,{x:Ball.position.x,y:Ball.position.y},{x:-1.0,y:0.0})

	}
}

function BeforeRender()
{
	var TranslateTo = GetTranslateCoordinates(Ball.position.x,Ball.position.y);
	Context.translate(TranslateTo.TranslateX,TranslateTo.TranslateY);
	
}
function AfterRender()
{
	Context.resetTransform();
}
function Init() {


	window.addEventListener('keydown',KeyboardHandler,false);
	// create an engine
	GameEngine = Matter.Engine.create();

	var GameRender = Matter.Render.create({
		canvas: GameboardCanvas,
		engine: GameEngine,
		options: {
		  width: Canvas.width,
		  height: Canvas.height,
		  background: 'transparent',
		  wireframes: false,
		  showAngleIndicator: false
		}
	  });
	  Matter.World.ListOfBodies = new Array();
	
	Floor = Matter.Bodies.rectangle(2500-25, 1000, 5000, 50, {
		
		friction: 0.0,
		isStatic: true,
		GameRender: {
		  visible: false
		}
	  });
	  Floor.label = "Ground";
	  Matter.World.add(GameEngine.world, Floor);
	  Matter.World.ListOfBodies.push(Floor);

	  var WallLeft = Matter.Bodies.rectangle(25, 500, 100, 1000, {
		
		friction: 0.0,
		isStatic: true,
		GameRender: {
		  visible: false
		}
	  });
	  Matter.World.add(GameEngine.world, WallLeft);
	  Matter.World.ListOfBodies.push(WallLeft);

	  var WallRight = Matter.Bodies.rectangle(5000-75, 500, 100, 1000, {
		
		friction: 0.0,
		isStatic: true,
		GameRender: {
		  visible: false
		}
	  });
	  Matter.World.add(GameEngine.world, WallRight);
	  Matter.World.ListOfBodies.push(WallRight);

	  var XPositionInitial = 800;
	  var BlockWidth = 100;
	
	  var BlockHeightInitial = 100;

	  for(var x = 0; x < 5; ++x)
	  {
		  
	  var Obstacle = Matter.Bodies.rectangle(XPositionInitial+(x*BlockWidth), 1000 - ((x*BlockHeightInitial)/2),BlockWidth , x*BlockHeightInitial, {
		
		friction: 0.0,
		isStatic: false,
		GameRender: {
		  visible: false
		}
	  });

	  Matter.World.add(GameEngine.world, Obstacle);
	  Matter.World.ListOfBodies.push(Obstacle);
	  }

	  Ball = Matter.Bodies.circle(500,0, 20, {
		density: 0.04,
		friction: 0.0,
		restitution: 0.5,
		isStatic: false,
		GameRender: {
		  fillStyle: '#F35e66',
		  strokeStyle: 'black',
		  lineWidth: 1
		}
	  });
	Matter.World.add(GameEngine.world, Ball);
	Matter.World.ListOfBodies.push(Ball);
	  Matter.Engine.run(GameEngine);
	  Matter.Render.run(GameRender);
	  Matter.Events.on(GameRender,"beforeRender",BeforeRender);
	  Matter.Events.on(GameRender,"afterRender",AfterRender);
}
