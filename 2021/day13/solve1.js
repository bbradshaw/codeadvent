class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	changedCopy({ x, y }) {
		if (x == null)
			x = this.x;
		if (y == null)
			y = this.y;

		return new Point(x, y);
	}

	equal(other) {
		return other.x === this.x && other.y === this.y;
	}

	get str() {
		return `${this.x},${this.y}`;
	}
}

function reflectAround(pt, axis, foldCoord) {
	let newCoord = -(pt[axis] - foldCoord) + foldCoord; // or 2f - p but this seems easier to understand
	let newPoint = pt.changedCopy({ [axis]: newCoord })
	return newPoint;
}

async function solve(input, step, doAllFolds) {
	let pts = [];
	const folds = [];

	let getPts = true;
	for (const line of input.split("\n")) {
		if (line === "") {
			getPts = false;
			continue;
		}
		if (getPts)
			pts.push(new Point(...line.split(",").map(c => parseInt(c))))
		else {
			let [axis, coord] = line.split("=");
			axis = Array.from(axis).slice(-1)[0];
			coord = parseInt(coord);
			folds.push({ axis, coord });
			if (!doAllFolds) break;
		}
	}

	log(`parsed ${pts.length} points and ${folds.length} instructions`);

	for (const i in folds) {
		const fold = folds[i];
		let uniqueNewPoints = {};

		for (const pt of pts) {
			if (pt[fold.axis] > fold.coord) {
				const newPt = reflectAround(pt, fold.axis, fold.coord);
				uniqueNewPoints[newPt.str] = newPt;
				gauge(`old: ${pt.str} --> new: ${newPt.str}`);
			}
			else
				uniqueNewPoints[pt.str] = pt;
		}

		pts = Object.values(uniqueNewPoints);
		log(`After fold #${parseInt(i) + 1}, there are ${pts.length}`);
		await step(1, folds.length);
	}
	pts.sort((a, b) => {
		const dx = a.x - b.x;
		if (dx) return dx;
		else return a.y - b.y;
	});

	if (doAllFolds){
		let max_x = Math.max(...pts.map( p => p.x));
		let max_y = Math.max(...pts.map( p => p.y));
		let arr = [...Array(max_y+2)].map(x => Array(max_x+2).fill('.'));
		let viz = new Grid(arr);
		for (let pt of pts) {
			viz.set(pt.x, pt.y, '#');
		};
		log(`<pre>${viz.printable()}</pre>`);
	}
	showAnswer(pts.length);

}

async function solve1(input, step){
	solve(input, step, false);
}