async function solve1(input, step) {
	let last = null;
	let count = 0;
	let lineno = 0;

	for (const line of input.split("\n")) {
		const thisInt = parseInt(line);

		if (last != null) {
			if (thisInt > last) {
				gauge(`${thisInt} > ${last}`);
				count++;
			} else {
				gauge(`%${thisInt} <= ${last}`);
			}
		}

		last = thisInt;
		try {
			showLineCompletion(lineno++);
			await step();
		}
		catch {
			log("User cancelled");
			return;
		}
	}
	showAnswer(count);
}