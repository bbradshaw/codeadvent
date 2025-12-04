async function solve1(input, step) {

	const data = Grid.from_input(input.trim());
	let answer = 0;
	const solutions = data.map((x, y, value) => {
		let count = 0;
		if (value == '.') {
			return '.';
		}
		for (const [nx, ny] of data.neighbors(x, y, true)) {
			if (data.at(nx, ny) == '@') {
				count++;
			}
		}
		if (count < 4) {
			answer++;
		}
		return count.toString();
	});
	const visualizer = new Visualizer(data);
	await visualizer.animate_solution(solutions);
	showAnswer(answer);
}

class Visualizer {
	constructor(start_data) {
		init();
		this.visual_div = document.getElementById('canvas');
		this.cell_grid = {};

		start_data.d2array.forEach((row, y) => {
			const rowDiv = document.createElement('div');
			row.forEach((cell, x) => {
				const cellSpan = document.createElement('span');
				cellSpan.id = `cell-${x}-${y}`;
				cellSpan.innerText = cell;
				rowDiv.appendChild(cellSpan);
				this.cell_grid[`${x},${y}`] = {span: cellSpan, value: cell};
			});
			this.visual_div.appendChild(rowDiv);
		});
	}

	async animate_solution(new_data) {
		const iterator = new_data[Symbol.iterator]();
		let lasty = 0;
		while (true) {
			let nxt = iterator.next();
			if (nxt.done) {
				return;
			}
			let [x, y, value] = nxt.value;
			const cellkey = `${x},${y}`;
			const {span, value: lastValue} = this.cell_grid[cellkey];
			if (value != lastValue) {
				this.cell_grid[cellkey].value = value;
				span.innerText = value;
				if (span.style.animationName === 'fadeBackground1') {
					span.style.animation = 'fadeBackground2 1s';
				}
				else {
					span.style.animation = 'fadeBackground1 1s';
				}
			}

			if (y != lasty) {
				await step(1, new_data.width * new_data.height);
				lasty = y;
			}
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

	// Add animation styles if not already present
	if (!document.getElementById('fade-animation1')) {
		const style = document.createElement('style');
		style.id = 'fade-animation1';
		style.textContent = `
			@keyframes fadeBackground1 {
				0% { background-color: yellow; }
				100% { background-color: white; }
			}
		`;
		document.head.appendChild(style);
	}
		// Add animation styles if not already present
	if (!document.getElementById('fade-animation2')) {
		const style = document.createElement('style');
		style.id = 'fade-animation2';
		style.textContent = `
			@keyframes fadeBackground2 {
				0% { background-color: yellow; }
				100% { background-color: white; }
			}
		`;
		document.head.appendChild(style);
	}
};