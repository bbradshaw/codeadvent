async function solve1(input, step) {
	let ocean = Grid.from_input(input);

	let time = 1;

	while (true) {
		let nmoved = 0;

		const eastocean = ocean.map((x, y, c) => {
			if (c === "." && ocean.at(modulo(x - 1, ocean.width), y) === ">") {
				nmoved++;
				return ">"
			}
			if (c === ">" && ocean.at(modulo(x + 1, ocean.width), y) === ".") {
				return ".";
			}
			return c;
		});

		const southocean = eastocean.map((x, y, c) => {
			if (c === "." && eastocean.at(x, modulo(y - 1, ocean.height)) === "v") {
				nmoved++;
				return "v";
			}
			if (c === "v" && eastocean.at(x, modulo(y + 1, ocean.height)) === ".") {
				return ".";
			}
			return c;
		});

		if (nmoved === 0)
			break;
		ocean = southocean;
		time++;
		await step(null);
	}
	showAnswer(time);
}