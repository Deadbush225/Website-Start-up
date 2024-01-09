import "./styles/styles.scss";
import Matter from "matter-js";

var Example = Example || {};

// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite;

// create an engine
var engine = Engine.create({
	gravity: { y: 5 },
});

// create a renderer
var render = Render.create({
	// element: document.body,
	element: document.body.querySelector(".canvas-outer"),
	engine: engine,
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
// var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true }); //walls

// add all of the bodies to the world
// Composite.add(engine.world, [boxA, boxB, ground]);
Composite.add(engine.world, [boxA, boxB]);

Composite.add(engine.world, [
	// walls
	Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
	Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
	Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
	Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
]);

/* ------------------------------------------------------------------------- */
// add mouse control
var mouse = Matter.Mouse.create(render.canvas),
	mouseConstraint = Matter.MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
			stiffness: 0.2,
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
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
