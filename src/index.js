"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./styles/styles.scss");
const matter_js_1 = __importDefault(require("matter-js"));
var Example = Example || {};
// module aliases
var Engine = matter_js_1.default.Engine, Render = matter_js_1.default.Render, Runner = matter_js_1.default.Runner, Bodies = matter_js_1.default.Bodies, Composite = matter_js_1.default.Composite;
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
var mouse = matter_js_1.default.Mouse.create(render.canvas), mouseConstraint = matter_js_1.default.MouseConstraint.create(engine, {
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
