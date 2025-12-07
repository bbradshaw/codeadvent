async function solve1(input, step) {
	let grid = Grid.from_input(input);
	let starting;
	let visual = new Visualizer(grid);
	for (const [x, y, v] of grid) {
		if (v === 'S') {
			starting = { x, y };
			break;
		}
	}

	let splits = 0;
	let time = 0;
	let beams = [{ ...starting }];
	while (beams.length > 0) {
		let newBeams = [];
		for (const beam of beams) {
			let nextBeam = { x: beam.x, y: beam.y + 1 };
			if (grid.outofbounds(nextBeam.x, nextBeam.y)) {
				continue;
			}
			let below = grid.at(nextBeam.x, nextBeam.y);
			if (below === '^') {
				const leftBeam = { x: beam.x - 1, y: beam.y + 1 };
				const rightBeam = { x: beam.x + 1, y: beam.y + 1 };
				if (!grid.outofbounds(leftBeam.x, leftBeam.y)) {
					newBeams.push(leftBeam);
				}
				if (!grid.outofbounds(rightBeam.x, rightBeam.y)) {
					newBeams.push(rightBeam);
				}
				splits++;
				continue;
			}
			newBeams.push(nextBeam);

		}
		let uniqueBeams = new Set(newBeams.map(asStr));
		newBeams = Array.from(uniqueBeams).map(str => {
			let [x, y] = str.split(',').map(Number);
			return { x, y };
		});
		visual.draw_beams(newBeams);
		beams = newBeams;
		time++;
		await step(1, null);
	}
	showAnswer(splits);
}

function asStr(beam) {
	return `${beam.x},${beam.y}`;
}


class Visualizer {
	constructor(grid) {
		init();
		this.visual_div = document.getElementById('canvas');
		grid.d2array.forEach((row, y) => {
			const rowDiv = document.createElement('div');
			row.forEach((v, x) => {
				const cellSpan = document.createElement('span');
				cellSpan.id = `cell-${x}-${y}`;
				cellSpan.innerText = v;
				rowDiv.appendChild(cellSpan);
			});
			this.visual_div.appendChild(rowDiv);
		});
	}

	draw_beams(beams) {
		for (const beam of beams) {
			const cellSpan = document.getElementById(`cell-${beam.x}-${beam.y}`);
			cellSpan.innerHTML = '|';
			let heat = Math.floor(Math.log2(beam.count || 1) * 6);
			let color = `#25${(255 - Math.min(255, heat)).toString(16).padStart(2, '0')}00`;
			cellSpan.style.backgroundColor = color;
		}
	}
}

function init() {
	let canvas = document.getElementById('canvas');
	let parent = canvas.parentElement;
	parent.removeChild(canvas);
	let newDiv = document.createElement('div');
	newDiv.id = 'canvas';
	parent.appendChild(newDiv);
	newDiv.style.fontFamily = 'monospace';
}