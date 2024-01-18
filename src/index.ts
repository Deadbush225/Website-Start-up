import "./styles/styles.scss";
import Matter from "matter-js";

let push = false;

function pushBox() {
	push = true;
}

document.body.querySelector(".push").addEventListener("click", pushBox);

// let Example = Example || {};

// module aliases
let Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite,
	Body = Matter.Body,
	Events = Matter.Events;

// create an engine
let engine = Engine.create({
	gravity: { y: 3 },
});

// create a renderer
let render = Render.create({
	// element: document.body,
	element: document.body.querySelector(".canvas-outer"),
	engine: engine,
	options: { showAngleIndicator: true, showCollisions: true },
});

// create two boxes and a ground
// let boxA = Bodies.rectangle(100, 530, 80, 80, { friction: 0, restituiton: 1 });
let boxA = Bodies.circle(100, 530, 40, { friction: 0, restituiton: 1 });
let boxB = Bodies.circle(550, 530, 40, { friction: 0, restitution: 1 });
// let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true }); //walls

// add all of the bodies to the world
// Composite.add(engine.world, [boxA, boxB, ground]);

console.log(engine.world);

Composite.add(engine.world, [boxA, boxB]);

Composite.add(engine.world, [
	// walls
	Bodies.rectangle(400, 0, 800, 50, { isStatic: true, restitution: 1 }),
	Bodies.rectangle(400, 600, 800, 50, { isStatic: true, restitution: 0 }),
	Bodies.rectangle(800, 300, 50, 600, { isStatic: true, restitution: 1 }),
	Bodies.rectangle(0, 300, 50, 600, { isStatic: true, restitution: 1 }),
]);

let lastTime = 0;
let firstrun = true;
let reverse = true;

Events.on(engine, "beforeUpdate", function (event) {
	// let timeScale = (event.delta || 1000 / 60) / 1000;

	// if (event.timestamp - lastTime >= 1500 && firstrun) {
	if (push) {
		console.log(push);
		// Body.setVelocity(bodyB, { x: 0, y: -10 });
		// Body.setAngle(bodyC, -Math.PI * 0.26);
		// Body.setAngularVelocity(boxA, 0.2);
		// Body.setVelocity(boxA, { x: 10, y: 10 });

		// Body.setAngularVelocity(boxB, 0.3);
		Body.setVelocity(boxB, { x: reverse ? -50 : 50, y: 0 });

		// Body.setAngularVelocity(boxC, 0.01);
		// Body.setVelocity(boxC, { x: 10, y: 50 });

		// Body.setAngularVelocity(boxD, 0.1);
		// Body.setVelocity(boxD, { x: 10, y: 10 });

		// Body.setAngularVelocity(boxE, 0.1);
		// Body.setVelocity(boxE, { x: 10, y: 10 });
		// stop scaling
		// scaleRate = 0;

		// update last time
		lastTime = event.timestamp;
		reverse = !reverse;

		push = false;
		// firstrun = false;
		// }
	}
	// console.log(engine.timing.timestamp);
});

/* ------------------------------------------------------------------------- */
// add mouse control
let mouse = Matter.Mouse.create(render.canvas),
	mouseConstraint = Matter.MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
			stiffness: 1,
			damping: 0.1,
			render: {
				visible: false,
			},
		},
	});

Composite.add(engine.world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;
/* ------------------------------------------------------------------------- */

// run the renderer
Render.run(render);

// create runner
let runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// Matter.Body.applyForce(boxA, boxA.position, Matter.Vector.create(0.1, 0));
