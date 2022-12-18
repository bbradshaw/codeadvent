async function solve2(input, step){

	const MIN = 0;
	const MAX = 4_000_000;

	let sensors = input.split('\n').map(parseSensor);

	let foundPoint = await scan(MIN, MAX, step, sensors);
	log(`Found gap at ${foundPoint}`);
	showAnswer(foundPoint.x * MAX + foundPoint.y);
}

async function scan(MIN, MAX, step, sensors){
	const steps = MAX - MIN;
	for (let row = MIN; row <= MAX; row++){
		gauge(`row ${row}`);
		const sensor_projections = sensors.map( s => {
			let rowDistance = Math.abs(s.sensor.y - row);
			return {rowDistance, ...s};
		}).filter( sp => sp.rowDistance <= sp.distance);

		let ranges = new Heap( (rangeA, rangeB) => rangeA[0] < rangeB[0]);
		for (const projected_sensor of sensor_projections){		//project 2D diamond into 1D row
			const extent = projected_sensor.distance - projected_sensor.rowDistance;
			let extentL = projected_sensor.sensor.x - extent;
			let extentR = projected_sensor.sensor.x + extent;
			extentL = Math.max(MIN, extentL);
			extentR = Math.min(extentR, MAX);
			ranges.push([extentL, extentR])
		}
		let range;
		let last = 0;
		while ( (range = ranges.pop()) != undefined){		// find gaps in sorted range
			if (range[0] > last)
				return new Point(last+1, row);
			last = Math.max(range[1], last);
		}
		await step(1, steps, 10_000);
	}
	throw new Error("no gap found!!");
}