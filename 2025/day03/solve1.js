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
	const data = input.trim().split("\n").map(line => line.split("").map(Number));
	let joltage = 0;
	for (const row of data) {
		const idx = firstHighestDigitIdx(row.slice(0, -1));
		const nextidx = firstHighestDigitIdx(row.slice(idx+1));
		const this_joltage = row[idx]*10 + row[idx + nextidx + 1];
		log(`Current joltage: ${joltage}, this_joltage: ${this_joltage}`);
		joltage += this_joltage;
		await step(1, data.length);
	}
	showAnswer(joltage);
}