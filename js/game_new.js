Matter.use(
    'matter-wrap'
);

var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events;
     
var engine = Engine.create();

engine.world.gravity.y = 0;

 
var render =  Render.create({
                element: document.body,
                engine: engine,
                options: {
                    width: 800,
                    height: 800,
                    wireframes: false
                }
             });

// add mouse control
    var mouse = Mouse.create(render.canvas),

  mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;
              
var boxA = Bodies.rectangle(400, 200, 80, 80);

Matter.Body.setInertia(boxA, 10000000);

var ballA = Bodies.circle(380, 100, 40, 10);
var ballB = Bodies.circle(460, 150, 40, 10);
var groundLeft = Bodies.rectangle(30, 400, 20, 600, { isStatic: true });
var groundRight = Bodies.rectangle(700, 400, 20, 600, { isStatic: true });
var groundTop = Bodies.rectangle(380, 30, 600, 20, { isStatic: true });
var groundBottom = Bodies.rectangle(380, 770, 600, 20, { isStatic: true });



Matter.Body.applyForce(ballA, ballA.position, Matter.Vector.create(0, + 0.001));

ballA.collisionFilter = {group: 1, category: 2^2, mask: 2^2 };
ballB.collisionFilter = {group: 1, category: 2^2, mask: 2^2 };
boxA.collisionFilter =  {group: 1, category: 2^2, mask: 2^2 };
groundLeft.collisionFilter =  {group: 1, category: 2^2, mask: 2^2 };
groundRight.collisionFilter =  {group: 1, category: 2^2, mask: 2^2 };
groundTop.collisionFilter =  {group: 1, category: 2^2, mask: 2^2 };
groundBottom.collisionFilter =  {group: 1, category: 2^2, mask: 2^2 };

var forceDir ;
var isMoving;

var mouse;

var onMouseMove = (event) => {
    if (event.mouse.button  === 0) {
       // console.log(ballA.position);
       mouse = event.mouse;    
    }
}

var onMouseUp = (event) => {
    forceDir = Matter.Vector.create(0, 0);
    isMoving = false;
}

var onMouseDown = (event) => {
    isMoving = true;
}

var onUpdate = (event) => {
       forceDir = Matter.Vector.create(mouse.absolute.x - ballA.position.x , mouse.absolute.y - ballA.position.y);

       forceDir = Matter.Vector.normalise(forceDir);

       forceDir = Matter.Vector.mult(forceDir, 0.01); 

    if (isMoving) Matter.Body.applyForce(ballA, ballA.position, forceDir);
}

Events.on(engine, "afterUpdate", onUpdate);

Events.on(mouseConstraint, "mouseup", onMouseUp);
Events.on(mouseConstraint, "mousedown", onMouseDown);
Events.on(mouseConstraint, "mousemove", onMouseMove);
 
World.add(engine.world, [boxA, ballA, ballB, groundLeft, groundRight, groundTop, groundBottom]);
 
Engine.run(engine);
Render.run(render);