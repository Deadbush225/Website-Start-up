gantt.plugins({
	// multiselect: true,
	export_api: true,
	click_drag: true,
});

gantt.config.columns = [
	{ name: "text", tree: true, width: 175, min_width: 50, resize: true },
	// { name: "start_date", align: "center", resize: true },
	// { name: "duration", align: "center", width: 70, resize: true },
	{ name: "add", width: 44 },
];

gantt.config.grid_resize = true;
gantt.config.fit_tasks = true; //automatically extend the time scale in order to fit all displayed tasks

/* ------------------------------------------------------------------------- */
var hourToStr = gantt.date.date_to_str("%H:%i");
var hourRangeFormat = function (step) {
	return function (date) {
		var intervalEnd = new Date(gantt.date.add(date, step, "hour") - 1);
		return hourToStr(date) + " - " + hourToStr(intervalEnd);
	};
};

gantt.config.min_column_width = 80;
var zoomConfig = {
	// minColumnWidth: 80,
	// maxColumnWidth: 30,
	levels: [
		{
			name: "day-num",
			scale_height: 30,
			min_column_width: 20,
			scales: [{ unit: "day", step: 1, format: "%d" }],
		},
		{
			name: "day",
			scale_height: 30,
			min_column_width: 50,
			scales: [{ unit: "day", step: 1, format: "%d %M" }],
		},
		{
			name: "week",
			scale_height: 30,
			min_column_width: 50,
			scales: [
				{
					unit: "week",
					step: 1,
					format: function (date) {
						var dateToStr = gantt.date.date_to_str("%d %M");
						var endDate = gantt.date.add(date, 6, "day");
						var weekNum = gantt.date.date_to_str("%W")(date);
						return (
							"#" +
							weekNum +
							", " +
							dateToStr(date) +
							" - " +
							dateToStr(endDate)
						);
					},
				},
				{ unit: "day", step: 1, format: "%j %D" },
			],
		},
		{
			name: "month",
			scale_height: 30,
			min_column_width: 120,
			scales: [
				{ unit: "month", format: "%F, %Y" },
				{ unit: "week", format: "Week #%W" },
			],
		},
		// {
		// 	name: "quarter",
		// 	height: 50,
		// 	min_column_width: 90,
		// 	scales: [
		// 		{ unit: "month", step: 1, format: "%M" },
		// 		{
		// 			unit: "quarter",
		// 			step: 1,
		// 			format: function (date) {
		// 				var dateToStr = gantt.date.date_to_str("%M");
		// 				var endDate = gantt.date.add(
		// 					gantt.date.add(date, 3, "month"),
		// 					-1,
		// 					"day"
		// 				);
		// 				return dateToStr(date) + " - " + dateToStr(endDate);
		// 			},
		// 		},
		// 	],
		// },
		// {
		// 	name: "year",
		// 	scale_height: 50,
		// 	min_column_width: 30,
		// 	scales: [{ unit: "year", step: 1, format: "%Y" }],
		// },
	],
	useKey: "ctrlKey",
	trigger: "wheel",
	element: function () {
		return gantt.$root.querySelector(".gantt_task");
	},
};

gantt.ext.zoom.init(zoomConfig);
/* ------------------------------------------------------------------------- */
gantt.config.click_drag = {
	callback: (
		startPosition,
		endPosition,
		startDate,
		endDate,
		tasksBetween,
		rowsBetween
	) => {
		var parentId = gantt.config.root_id;
		if (rowsBetween.length) {
			parentId = rowsBetween[0].id;
		}

		gantt.createTask(
			{
				text: "New task",
				start_date: gantt.roundDate(startDate),
				end_date: gantt.roundDate(endDate),
			},
			parentId
		);
	},
	singleRow: true,
};

// gantt.config.scales = [
// 	{ unit: "month", step: 1, format: "%F, %Y" },
// 	{ unit: "day", step: 1, format: "%j, %D" },
// ];

gantt.config.date_format = "%Y-%m-%d %H:%i";
// gantt.init("gantt_here");
