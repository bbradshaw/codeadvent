async function solve1(input, step) {
	let octomap = Grid.from_input(input).map((x, y, v) => parseInt(v));
	let total_flashes = 0;

	for (let timestamp = 1; timestamp <= 100; timestamp++) {
		let pending_flashes = [];
		let flashed_this_step = new Set();
		const pos = (x, y) => `${x},${y}`;

		octomap = octomap.map((x, y, val) => {
			val += 1;
			if (val == 10) {
				pending_flashes.push([x, y]);
			}
			return val;
		});
		while (pending_flashes.length) {
			let [fx, fy] = pending_flashes.pop();
			if (flashed_this_step.has(pos(fx, fy)))
				continue;
			octomap.set(fx, fy, 0);
			flashed_this_step.add(pos(fx, fy))
			total_flashes++;

			for (let [nx, ny] of octomap.neighbors(fx, fy, true)) {
				if (flashed_this_step.has(pos(nx, ny)))
					continue;
				let val = octomap.at(nx, ny);
				val += 1;
				if (val >= 10) {
					pending_flashes.push([nx, ny]);
				}
				octomap.set(nx, ny, val);
			}
		}

		log(`step ${timestamp}`);
		gauge(`<pre>${octomap.printable()}</pre>`);

		await step(1, 100);
	}

	showAnswer(total_flashes);
}

class AnimatedOctomap {
	constructor(height, width) {
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.x_rect_size = Math.floor(this.canvas.width / width);
		this.y_rect_size = Math.floor(this.canvas.height / height);
		this.t_initial_flashers = [];
		this.t_total_flashers = [];
		this.t_last_flashers = [];
		this.initial_flash_ts = 0;
		this.fade_flash_ts = 0;

		this.flash_colors = ["rgb(255,255,255)", 
							"rgb(210,210, 230)",
							"rgb(10, 10, 40)"];
	}

	init(){
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.canvas.style.display = 'initial';
		}
	
	pending_flashes(arr){
		this.t_initial_flashers = arr.slice();
	}

	flashed_this_step(set){
		for (let [pos, _] of set.entries()){
			let [x, y] = pos.split(",").map( n=> parseInt(n));
			this.t_total_flashers.push([x,y]);
		}
	}

	animate(){
		requestAnimationFrame(this.animateInitialFlash.bind(this));
	}

	drawRect(x, y, color){
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x*this.x_rect_size, y*this.y_rect_size, (x+1)*this.x_rect_size, (y+1)*this.y_rect_size);
	}

	animateInitialFlash(ts){
		this.initial_flash_ts = ts;
		this.t_last_flashers.forEach( ([x, y]) => this.drawRect(x, y, this.flash_colors[2]));
		this.t_initial_flashers.forEach( ([x,y]) => this.drawRect(x, y, this.flash_colors[0]));
		requestAnimationFrame(this.animateSecondaryFlashes.bind(this));
	}

	animateSecondaryFlashes(ts){
		if (ts - this.initial_flash_ts < 300){
			requestAnimationFrame(this.animateSecondaryFlashes.bind(this));
			return;
		}
		this.fade_flash_ts = ts;
		this.t_last_flashers.forEach( ([x, y]) => this.drawRect(x, y, this.flash_colors[2]));
		this.t_total_flashers.forEach( ([x, y]) => this.drawRect(x, y, this.flash_colors[0]));
		this.t_initial_flashers.forEach( ([x, y]) => this.drawRect(x, y, this.flash_colors[1]));
		this.t_last_flashers = this.t_total_flashers.slice();
		requestAnimationFrame(this.animateFadeOut.bind(this));	
	}

	animateFadeOut(ts){
		if (ts - this.fade_flash_ts < 300){
			requestAnimationFrame(this.animateFadeOut.bind(this));
			return;
		}
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.t_last_flashers.forEach( ([x, y]) => this.drawRect(x, y, this.flash_colors[2]));
	}
}
