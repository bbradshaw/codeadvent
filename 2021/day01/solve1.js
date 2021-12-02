async function solve1(input, step) {
	let last = null;
	let count = 0;

	for (const line of input.split("\n")) {
		const thisInt = parseInt(line);

		if (last != null) {
			if (thisInt > last) {
				log(`${thisInt} > ${last}`);
				count++;
			} else {
				log(`${thisInt} <= ${last}`);
			}
		}

		last = thisInt;
		await step(1);
	}
	showAnswer(count);
}