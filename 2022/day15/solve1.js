async function solve1(input, step){
	const TARGET_ROW = 2000000;
	let sensors = input.split('\n').map(parseSensor);
	
	let [maxX, minX] = [-Infinity, Infinity];

	sensors.forEach (s => {
		let sMinX = sensorMaxExtent(-1, s);
		let sMaxX = sensorMaxExtent(1, s);
		if (sMinX < minX)
			minX = sMinX;
		if (sMaxX > maxX)
			maxX = sMaxX;
	});

	const clipped_sensors = sensors.filter( s => {
		let rowDistance = Math.abs(s.beacon.y - TARGET_ROW);
		return (rowDistance <= s.distance)
	});

	const clipped_beacons = sensors.reduce( (acc, s) => {
		if (s.beacon.y === TARGET_ROW)
			acc.push(s.beacon);
		return acc;
	}, []);
	log(`computing from x=${minX} to x=${maxX}`);
	log(`for row ${TARGET_ROW}, there are ${clipped_sensors.length} out of ${sensors.length} sensors to consider.`);

	let answer = 0;
	let steps = Math.abs(minX) + maxX;
	for (let i = minX; i <= maxX; i++){
		let checkPoint = new Point(i, TARGET_ROW);
		if (clipped_beacons.some( b => b.eq(checkPoint))){
			log(`skipping ${checkPoint} because it is also a beacon!`);
			continue;
		}

		let withinRange = false;
		for (const sens of clipped_sensors){
			let distance = Navigation.manhattan(sens.sensor.asArray(), checkPoint.asArray());
			if (distance <= sens.distance){
				gauge(`Point ${checkPoint} is too close to ${sens.sensor} to have beacon!`);
				withinRange = true;
				answer++;
				break;
			}
		}
		await step(1, steps, 10000);
	}
	showAnswer(answer);
}

function sensorMaxExtent(sign, sensor){
	if (sign < 0)
		return sensor.sensor.x - sensor.distance;
	else
		return sensor.sensor.x + sensor.distance;
}

class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	eq(o){
		return o.x === this.x && o.y === this.y;
	}

	asArray(){
		return [this.x, this.y];
	}

	toString(){
		return `(${this.x}, ${this.y})`;
	}
}

const sensorRegex = /Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/;
function parseSensor(line){
	let m = sensorRegex.exec(line);
	if (m == null) throw new Error(`Invalid sensor line ${line}`);

	let [_l, sX, sY, bX, bY] = m;
	let sensor = new Point(parseInt(sX), parseInt(sY));
	let beacon = new Point(parseInt(bX), parseInt(bY));
	
	return {beacon, sensor, distance: Navigation.manhattan(sensor.asArray(), beacon.asArray())}
}