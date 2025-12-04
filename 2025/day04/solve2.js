async function solve2(input, step) {
	const data = Grid.from_input(input.trim());
	let oldval = 0;
	let prevVersion = data.map((x, y, value) => {
		let count = 0;
		if (value == '.') {
			return '.';
		}
		oldval++;
		for (const [nx, ny] of data.neighbors(x, y, true)) {
			if (data.at(nx, ny) !== '.') {
				count++;
			}
		}
		return count.toString();
	});
	const visualizer = new Visualizer(data);
	await visualizer.animate_solution(prevVersion);
	let lastRemoved = -1;
	let removed = 0;
	while (lastRemoved !== 0) {
		lastRemoved = 0;
		nextVersion = prevVersion.map((x, y, value) => {
			let count = 0;
			if (value == '.') {
				return '.';
			}
			for (const [nx, ny] of prevVersion.neighbors(x, y, true)) {
				if (prevVersion.at(nx, ny) !== '.') {
					count++;
				}
			}
			if (count < 4) {
				lastRemoved++;
				return '.';
			}
			return count.toString();
		});
		prevVersion = nextVersion;
		removed += lastRemoved;
		await visualizer.animate_solution(nextVersion);
	}
	showAnswer(removed);
}