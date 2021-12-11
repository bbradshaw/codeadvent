async function solve2(input, step) {
	let octomap = Grid.from_input(input).map((x, y, v) => parseInt(v));
	let timestamp = 1;
	let flashed_this_step = new Set();
	const total_octopuses = octomap.height * octomap.width;

	while (flashed_this_step.size !== total_octopuses){
		let pending_flashes = [];
		flashed_this_step = new Set();
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
		log(`step ${timestamp}, ${flashed_this_step.size} flashes`);
		gauge(`<pre>${octomap.printable()}</pre>`);
		timestamp++;
		await step(1, null);
	}

	showAnswer(timestamp - 1);
}