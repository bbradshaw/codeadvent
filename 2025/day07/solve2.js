async function solve2(input, step) {
	let grid = Grid.from_input(input);
	let starting;
	let visual = new Visualizer(grid);
	for (const [x, y, v] of grid) {
		if (v === 'S') {
			starting = { x, y, count: 1 };
			break;
		}
	}


	let beams = [{ ...starting }];
	const final_beams = [];
	while (beams.length > 0) {
		let newBeams = [];
		for (const beam of beams) {
			let nextBeam = { x: beam.x, y: beam.y + 1, count: beam.count };
			if (grid.outofbounds(nextBeam.x, nextBeam.y)) {
				final_beams.push(beam);
				continue;
			}
			let below = grid.at(nextBeam.x, nextBeam.y);
			if (below === '^') {
				const leftBeam = { x: beam.x - 1, y: beam.y + 1, count: beam.count };
				const rightBeam = { x: beam.x + 1, y: beam.y + 1, count: beam.count };
				if (!grid.outofbounds(leftBeam.x, leftBeam.y)) {
					newBeams.push(leftBeam);
				}
				if (!grid.outofbounds(rightBeam.x, rightBeam.y)) {
					newBeams.push(rightBeam);
				}

				continue;
			}
			newBeams.push(nextBeam);
		}
		let nBeams = newCounter();
		for (const beam of newBeams) {
			const s = asStr(beam);
			nBeams[s] += beam.count || 1;
		}
		newBeams = Object.entries(nBeams).map(([str, count]) => {
			let [x, y] = str.split(',').map(Number);
			return { x, y, count };
		});
		visual.draw_beams(newBeams);
		beams = newBeams;
		await step(1, null);
	}
	let sum = final_beams.reduce((acc, beam) => acc + (beam.count || 1), 0);
	showAnswer(sum);
}

