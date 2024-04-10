import "./styles/styles.scss";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import $ from "jquery";

import { GridStack } from "gridstack";
import "../node_modules/gridstack/dist/gridstack.css";
import "../node_modules/gridstack/dist/gridstack-extra.css";

import "../node_modules/ContentTools/build/content-tools.min.js";
import "../node_modules/ContentTools/build/content-tools.min.css";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

import { uuid, wrap } from "./scripts/helper";
import "./scripts/ganttt";

// declare global {
declare global {
	interface Window {
		app: {};
	}
}
// }
window.app = window.app || {};

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyB29EhMVIWQuGCSvv4lfwP9kJAgCjri_0Q",
	authDomain: "lapiz-surge.firebaseapp.com",
	projectId: "lapiz-surge",
	storageBucket: "lapiz-surge.appspot.com",
	messagingSenderId: "991683097787",
	appId: "1:991683097787:web:5dddf9438f54414a8be59e",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const firestore = getFirestore(firebaseApp);

// import "./gantt/dhtmlxgantt.js";

let grid;
// single object when one gridstack only
// becomes an array when in kanban

function save() {
	// window.alert("save");
	console.log(`pagename: ${window.app.pageName}`);

	console.log("SAVING");
	if (window.app.pageName == "dashboard") {
		let gantt_json = gantt.serialize();
		let gridstack_json = { grids: grid.save() };

		console.log(`GRID: ${grid}`);

		let gantt_ = doc(firestore, "mil/gantt");
		let gridstack_ = doc(firestore, "mil/gridstack");

		setDoc(gantt_, gantt_json);
		setDoc(gridstack_, gridstack_json);

		// setTimeout(() => {
		// 	console.log("TE");
		// }, 2000);

		console.log(JSON.stringify(gantt_json));
		console.log(JSON.stringify(gridstack_json));
	} else if (window.app.pageName == "submission") {
		let kanbanstack_json = {
			Tasks: grid[0].save(),
			Progress: grid[1].save(),
			Checking: grid[2].save(),
			Done: grid[3].save(),
		};
		let kanbanStack_ = doc(firestore, "mil/kanban");
		setDoc(kanbanStack_, kanbanstack_json);
		console.log(kanbanstack_json);
	}
	console.log("DONE SAVING");

	// just do something when finish so that we will wait for the promise
}

async function loadGantt() {
	let gantt_ = doc(firestore, "mil/gantt");
	let gantt_snapshot = await getDoc(gantt_);

	let gantt_json;
	if (gantt_snapshot.exists()) {
		let data_ = gantt_snapshot.data();

		//manage this promise and manage it using ".then"
		gantt_json = JSON.stringify(data_);
		console.log(gantt_json);
	}

	let pre = {
		data: [
			{
				id: 1,
				text: "Project #1",
				start_date: null,
				duration: null,
				parent: 0,
				progress: 0,
				open: true,
			},
			{
				id: 2,
				text: "Task #1",
				start_date: "2019-08-01 00:00",
				duration: 5,
				parent: 1,
				progress: 1,
			},
			{
				id: 3,
				text: "Task #2",
				start_date: "2019-08-06 00:00",
				duration: 2,
				parent: 1,
				progress: 0.5,
			},
			{
				id: 4,
				text: "Task #3",
				start_date: null,
				duration: null,
				parent: 1,
				progress: 0.8,
				open: true,
			},
			{
				id: 5,
				text: "Task #3.1",
				start_date: "2019-08-09 00:00",
				duration: 2,
				parent: 4,
				progress: 0.2,
			},
			{
				id: 6,
				text: "Task #3.2",
				start_date: "2019-08-11 00:00",
				duration: 1,
				parent: 4,
				progress: 0,
			},
		],
		links: [
			{ id: 1, source: 2, target: 3, type: "0" },
			{ id: 2, source: 3, target: 4, type: "0" },
			{ id: 3, source: 5, target: 6, type: "0" },
		],
	};

	let gantt_data =
		gantt_json === null || gantt_json === undefined ? pre : gantt_json;

	console.log(gantt_data);
	// gantt.parse(data);
	return gantt_data;
	// return json;
	// console.log(prom);
}

async function loadGrid() {
	let grid_ = doc(firestore, "mil/gridstack");
	let grid_snapshot = await getDoc(grid_);

	let grid_json;
	if (grid_snapshot.exists()) {
		let data_ = grid_snapshot.data();

		grid_json = JSON.stringify(data_);
		console.log(grid_json);
	}

	var items = [
		{
			x: 0,
			y: 0,
			w: 12,
			h: 1,
			content: new TextCard({
				title: { name: "Projec Title", tag: "h3" },
			}).str(),
		},
		{
			x: 0,
			y: 1,
			w: 8,
			h: 3,
			content: new TextCard({
				title: { name: "Announcements", tag: "h5" },
			}).str(),
		},
		{
			x: 8,
			y: 1,
			w: 4,
			h: 3,
			content: new TextCard({
				title: { name: "Pinned Links", tag: "h5" },
			}).str(),
		},
	];

	let grid_data =
		grid_json === null || grid_json === undefined
			? items
			: JSON.parse(grid_json).grids;
	console.log(grid_data);

	return grid_data;
}

async function loadKanban() {
	let grid_ = doc(firestore, "mil/kanban");
	let grid_snapshot = await getDoc(grid_);

	let grid_json;
	if (grid_snapshot.exists()) {
		let data_ = grid_snapshot.data();

		grid_json = JSON.stringify(data_);
		console.log(grid_json);
	}

	let headerCss = "board-title center strong";
	let headerSettings = { noResize: true, noMove: true, locked: true };

	var items = {
		Tasks: [
			{
				x: 0,
				y: 0,
				w: 1,
				h: 1,
				content: new TextCard({
					title: { name: "Tasks", tag: "h5", cls: headerCss },
					noPlaceholder: true,
				}).str(),
				...headerSettings,
			},
			{
				x: 0,
				y: 1,
				w: 3,
				h: 3,
				content: new TextCard({
					title: { name: "Sample task", tag: "h6", cls: "board-title strong" },
				}).str(),
			},
		],
		Progress: [
			{
				x: 0,
				y: 0,
				w: 3,
				h: 1,
				content: new TextCard({
					title: { name: "Progress", tag: "h5", cls: headerCss },
					noPlaceholder: true,
				}).str(),
				...headerSettings,
			},
		],
		Checking: [
			{
				x: 0,
				y: 0,
				w: 1,
				h: 1,
				content: new TextCard({
					title: { name: "Checking", tag: "h5", cls: headerCss },
					noPlaceholder: true,
				}).str(),
				...headerSettings,
			},
		],
		Done: [
			{
				x: 9,
				y: 0,
				w: 3,
				h: 1,
				content: new TextCard({
					title: { name: "Done", tag: "h5", cls: headerCss },
					noPlaceholder: true,
				}).str(),
				...headerSettings,
			},
		],
	};

	let grid_data =
		grid_json === null || grid_json === undefined
			? items
			: JSON.parse(grid_json);
	console.log(grid_data);

	return grid_data;
}

class TextCard {
	title_: string;
	body_: string;

	internal_content: string; // inside the textcard
	content: string; // including the outer div with id
	id: string;

	closeButton: string; // declaration string

	constructor(contents: {
		title: { name: string; tag: string; cls?: string };
		body?: { name: string; cls?: string };
		noPlaceholder?: boolean;
		addCloseButton?: boolean;
	}) {
		let c = contents;

		c.addCloseButton = c.addCloseButton || true;
		/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ Default Arg ━━━━━━━━━━━━━━━━━━━━━━━━━━ */

		this.title_ = wrap(
			c.title.name,
			c.title.tag,
			"",
			`${c.title.cls} tc-title`
		);
		if (c.body === undefined) {
			c.body = { name: "", cls: "" };
		}

		this.body_ = wrap(
			c.body.name || wrap(c.noPlaceholder ? "" : "Placeholder", "p"),
			"div",
			"",
			`${c.body.cls || ""} tc-body`
		);
		this.id = uuid();

		this.internal_content = wrap(
			`${this.title_}\n${this.body_}`,
			"div",
			"",
			"tc-internal-content"
		);
		this.closeButton = '<div class="tc-delete-card"></div>';
		this.content =
			wrap(`${this.internal_content}`, "div", `textcard="${this.id}"`) +
			`${c.addCloseButton ? "\n" + this.closeButton : ""}`;
		// this.title_ = wrap(title, "h4");
		// let ct;
		// if (noplaceholder) {
		// 	ct = wrap("");
		// } else {
		// 	ct = wrap(content == "" ? "Placeholder" : content, "p");
		// }
		// this.body_ = ct;

		// this.id = uuid();
	}

	str(): string {
		return this.content;
	}

	json() {
		// implement exportation to json
		// {title: str, body: str}
		// need to add wrap the content of a card within a div, and add it
		// 1. "text-card" attribute
		// 2. custom id of this text card
	}
}

function changeContent(pagename: string): void {
	function dashboardSetup() {
		console.log("changing contents");

		if ($("#gantt_here").length > 0) {
			console.log("updating gantt");
			// console.log(recover);
			let recover = loadGantt();
			recover.then((a) => {
				console.log(`RECOVER GANTT: \n${a}`);
				gantt.init("gantt_here");
				gantt.parse(a);
			});
		}

		if ($(".grid-stack").length > 0) {
			let recover = loadGrid();
			recover.then((a) => {
				console.log(`RECOVER GRID: \n${a}`);

				grid = GridStack.init({
					cellHeight: "4.5em",
					float: true,
					// disableDrag: true,
					resizable: {
						handles: "n,e,se,s,sw,w",
					},
				});
				grid.load(a);

				$(".grid-stack-item-content").attr("data-editable", "true");
				$(".grid-stack-item-content").attr("data-name", "heading");
			});
		}

		// if ($("[data-editable]")) {
		var editor;
		editor = ContentTools.EditorApp.get();
		editor.init("*[data-editable]", "data-name");

		editor.addEventListener("start", () => {
			console.log("EDITOR STARTING");
			grid.disable();
		});

		$(".save").on("click", save);

		editor.addEventListener("stop", () => {
			console.log("EDITOR STARTING");
			grid.enable();
		});
	}

	function submissionSetup() {
		if ($(".grid-stack").length > 0) {
			let recover = loadKanban();
			recover.then((a) => {
				console.log(`RECOVER GRID: \n${a}`);

				grid = GridStack.initAll({
					cellHeight: "4em",
					float: true,
					column: 1,
					// disableDrag: true,
					resizable: {
						handles: "n,e,se,s,sw,w",
					},
					minRow: 5,
					acceptWidgets: true,
				});
				console.log(`GRIDS: ${grid[0]}`);
				grid[0].load(a.Tasks);
				grid[1].load(a.Progress);
				grid[2].load(a.Checking);
				grid[3].load(a.Done);

				$(".grid-stack-item-content").attr("data-editable", "true");
				$(".grid-stack-item-content").attr("data-name", "heading");
			});
		}

		// if ($("[data-editable]")) {
		var editor;
		editor = ContentTools.EditorApp.get();
		editor.init("*[data-editable]", "data-name");

		editor.addEventListener("start", () => {
			console.log("EDITOR STARTING");
			grid.disable();
		});

		$(".save").on("click", save);

		editor.addEventListener("stop", () => {
			console.log("EDITOR STARTING");
			grid.enable();
		});
	}
	// }

	$.get(`./pages/${pagename}.html`, function (data) {
		$(".contents")
			.html($(data))
			.ready(() => {
				window.app.pageName = pagename;
				if (pagename == "dashboard") dashboardSetup();
				else if (pagename == "submission") submissionSetup();
			});
	});
}

window.onload = () => {
	changeContent("submission");
	// changeContent("dashboard");

	window.addEventListener("NavChanged", (e) => {
		console.log(e.pageName);
		changeContent(e.pageName);
		// console.log("NAV CHANGED");
	});
};
