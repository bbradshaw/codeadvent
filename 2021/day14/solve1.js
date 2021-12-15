async function solve(input, step, max_steps) {
	let rules = input.split("\n");
	let template = Array.from(rules.shift());
	const JS = JSON.stringify;
	rules.shift();

	rules = rules.map(l => {
		const [pair, insert] = l.split(" -> ");
		return [...Array.from(pair), insert];
	});

	const produceNew = (pair) => {
		for (const [p1, p2, ins] of rules) {
			if (pair[0] === p1 && pair[1] === p2)
				return ins;
		}
	};
	const lastLetter = template[template.length - 1];
	const sumElements = (pairCount) => {
		let eleCount = newCounter();
		for (const [pair, pc] of Object.entries(pairCount)) {
			eleCount[pair[0]] += pc;
		}
		eleCount[lastLetter]++;
		return eleCount;
	}

	count = newCounter();

	for (let i = 0; i < template.length - 1; i++) {
		count[template[i] + template[i + 1]]++;
	}
	log(JS(Object.entries(count)));
	log(JS(Object.entries(sumElements(count))));

	nextCount = newCounter();
	for (let step_i = 1; step_i <= max_steps; step_i++) {
		for (let [pair, n] of Object.entries(count)) {
			if (n > 0) {
				const next_letter = produceNew(pair);
				nextCount[pair[0] + next_letter] += n;
				nextCount[next_letter + pair[1]] += n;
			}
		}
		count = nextCount;
		nextCount = newCounter();

		log(`Step ${step_i}: ${sum(Object.values(sumElements(count)))} polymers`);
		log(JS(Object.entries(sumElements(count))));
		log(JS(Object.entries(count)));
		await step(1, max_steps);

	}

	let sorted = Object.entries(sumElements(count)).sort((a, b) => a[1] - b[1]);

	log(JS(sorted));

	most_common = sorted[sorted.length - 1][1];
	least_common = sorted[0][1];

	showAnswer(most_common - least_common);
}

async function solve1(input, step) {
	await solve(input, step, 10);
}