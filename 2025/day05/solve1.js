async function solve1(input, step) {
	let ranges = [];
	let ids = [];
	let mode = 'ranges';
	input.trim().split("\n").forEach(line => {
		if (line === "") {
			mode = 'ids';
			return;
		}
		if (mode === 'ranges') {
			const [start, end] = line.split("-").map(x => parseInt(x));
			ranges.push({ start, end });
		} else {
			ids.push(parseInt(line));
		}
	});
	let fresh = 0;
	for (const id of ids) {
		for (const range of ranges) {
			if (id >= range.start && id <= range.end) {
				fresh++;
				break;
			}
		}
		await step(1, ids.length);
	}
	showAnswer(fresh);
}