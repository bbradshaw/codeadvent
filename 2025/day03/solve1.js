const firstHighestDigitIdx = (arr) => {
	const highestDigit = arr.reduce(
		(prev, curr, idx) => {
			if (curr > prev?.value) {
				return { value: curr, index: idx };
			}
			return prev;
		}, { value: -1, index: -1 });
	return highestDigit.index;
}

async function solve1(input, step) {
	init();
	const data = input.trim().split("\n").map(line => line.split("").map(Number));
	let joltage = 0;
	let visualizer = new Visualizer();
	for (const row of data) {
		visualizer.begin_row(row);
		const idx = firstHighestDigitIdx(row.slice(0, -1));
		visualizer.mark_digit(0, idx);
		const nextidx = firstHighestDigitIdx(row.slice(idx + 1));
		visualizer.mark_digit(idx + 1, idx + nextidx + 1);
		const this_joltage = row[idx] * 10 + row[idx + nextidx + 1];
		gauge(`this_joltage: ${this_joltage}, total joltage: ${joltage}`);
		joltage += this_joltage;
		await step(1, data.length);
		await visualizer.finish_row();
	}
	showAnswer(joltage);
}

class Visualizer {
	constructor() {
		this.visual_div = document.getElementById('canvas');
		this.current_data = null;
		this.animation = { active: [], finished: [], done: null, promise: null };
	}

	begin_row(row) {
		if (this.animation.done) {
			this.animation.done();
			this.animation.done = null;
		}
		this.animation.promise = new Promise((resolve) => {
			this.animation.done = resolve;
			requestAnimationFrame(this.animate.bind(this));
		});
		this.visual_div.appendChild(document.createElement('div'));
		this.visual_div.lastChild.innerHTML = row.map(d => `<span>${d}</span>`).join("");
		this.current_data = this.visual_div.lastChild;
	}

	mark_digit(from, idx) {
		this.animation.active.push({ target: idx, start: from, timing: null });
	}

	async finish_row() {
		if (this.animation.done != null) {
			await this.animation.promise;
		}
		else {
			this.animation.promise = null;
		}
		if (this.current_data.parentElement.children.length > 20) {
			this.visual_div.removeChild(this.visual_div.firstChild);
		}
		this.current_data = null;
	}

	animate(timestamp) {
		const delay = 10; // ms
		this.animation.active = this.animation.active.filter(anim => {
			if (anim.timing === null) {
				anim.timing = timestamp;
			}
			const elapsed = (timestamp - anim.timing);
			const current_pos = Math.min(anim.start + Math.floor(elapsed / delay), this.current_data.children.length - 1);
			if (current_pos >= anim.target) {
				this.current_data.children[anim.target].classList.add('found');
				this.animation.finished.push(anim);
				return false;
			}
			for (let i = anim.start; i <= current_pos; i++) {
				this.current_data.children[i].classList.add('searched');
			}
			return true;
		});
		if (this.animation.active.length > 0) {
			requestAnimationFrame(this.animate.bind(this));
		} else {
			this.animation.done();
			this.animation.done = null;
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
	const myStylesheet = document.styleSheets[0];
	myStylesheet.insertRule(`.searched {
		background-color: yellow;
	}`, myStylesheet.cssRules.length);
	myStylesheet.insertRule(`.found {
		background-color: orange;
	}`, myStylesheet.cssRules.length);
};