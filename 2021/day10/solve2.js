SCORE2 = {
	")": 1,
	"]": 2,
	"}": 3,
	">": 4
}

async function solve2(input, step) {
	const lines = input.split("\n");
	let totals = [];

	for (const lineno in lines) {
		const line = lines[lineno];
		let stack = [];
		const chars = line.split("");
		let illegal = undefined;

		line_loop:
		for (const idx in chars) {

			const char = chars[idx];
			switch (char) {
				case "[":
					stack.push("]");
					break;
				case "{":
					stack.push("}");
					break;
				case "(":
					stack.push(")");
					break;
				case "<":
					stack.push(">");
					break;
				case ">":
				case "}":
				case ")":
				case "]":
					let expected = stack.pop();
					if (expected !== char) {
						log(`Line ${lineno}: Expected '${expected}' but found '${char}'`);
						illegal = char;
						break line_loop;
					}
			}
		}
		if (illegal == null) {
			let total = stack.reverse().reduce((total, c) => {
				total *= 5;
				total += SCORE2[c];
				return total;
			}, 0);
			log(`Line ${lineno}: Need '${stack.reverse().join("")}' to complete`);
			totals.push(total);
		}
		await step(1);
	}

	totals.sort((a, b) => a - b);
	let mid = Math.floor(totals.length / 2);
	showAnswer(totals[mid]);
}
