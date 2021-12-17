function inverse_triangular(n) {
	return Math.ceil((Math.sqrt(2 * n + 0.25) - 0.5))
}

function doesHitTarget(xvel, yvel, targetInfo) {
	let nav = new Navigation();
	let pos = [0, 0];

	while (!((xvel == 0) && (yvel < 0) && (pos[1] < targetInfo.ymin))) {
		pos = nav.move_by_vec(pos, { direction: [xvel, yvel], magnitude: 1 });

		if (xvel !== 0)
			xvel > 0 ? xvel-- : xvel++;
		yvel--;

		if (pos[0] >= targetInfo.xmin && pos[0] <= targetInfo.xmax && pos[1] >= targetInfo.ymin && pos[1] <= targetInfo.ymax) {
			return { pos, xvel, yvel };
		}

	}
	return null;
}

async function solve(input, step, problem) {
	const [, xmin, xmax, ymin, ymax] = /target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/g.exec(input);
	const targetInfo = { xmin, xmax, ymin, ymax };


	let lowball, highball;
	let hits = 0;

	// x dist traveled is triangular number so compute the inverse needed to reach min
	let xvel = inverse_triangular(xmin);
	for (; xvel <= xmax; xvel++) {
		highball = null;
		lowball = null;
		for (let yvel = ymin - 1; yvel <= Math.abs(ymin); yvel++) {
			let tgt;
			if (tgt = doesHitTarget(xvel, yvel, targetInfo)) {
				if (lowball == null) {
					lowball = yvel;
					log(`lowest yvel = ${yvel}`);
				}
				log(`hit target yvel: ${tgt.yvel} xvel: ${tgt.xvel} at ${JSON.stringify(tgt.pos)} with start yvel ${yvel}`);
				highball = yvel;
				hits++;

			}
		}
		await step(null);
		if (highball) log(`highest yvel = ${highball}`);
		if (problem === 1) return triangular_n(highball);
	}

	if (problem === 2) return (hits);
}




async function solve1(input, step) {
	showAnswer(await solve(input, step, 1));
}