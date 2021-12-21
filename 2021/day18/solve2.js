function getMagnitudeOfCombo(one, two) {
	let newTop = new SNum(one, two, 0, null);
	one.parent = newTop;
	two.parent = newTop;
	increaseAllDepth([one, two]);
	reduce(newTop);
	let mag = newTop.magnitude();
	return mag;
}

async function solve2(input, step) {
	let lines = input.split("\n");
	let best = 0;
	let [besti, bestj] = [null, null];
	for (let i = 0; i < lines.length - 1; i++) {
		for (let j = i + 1; j < lines.length; j++) {
			let one = parseAndGetTop(lines[i]);
			let two = parseAndGetTop(lines[j]);
			let mag1 = getMagnitudeOfCombo(one, two);
			one = parseAndGetTop(lines[i]);
			two = parseAndGetTop(lines[j]);
			let mag2 = getMagnitudeOfCombo(two, one);
			if (best < Math.max(best, mag1, mag2)) {
				best = Math.max(best, mag1, mag2);
				besti = i;
				bestj = j;
			}

		}
		log(`trying all combinations with line ${i}`);
		await step(1);
	}
	log(`best was ${lines[besti]} with ${lines[bestj]}`);
	showAnswer(best);
}