SCORE1 = {
	")" : 3,
	"]": 57,
	"}": 1197,
	">": 25137
}

async function solve1(input, step){
	const lines = input.split("\n");
	let total = 0;

	for (const lineno in lines){
		const line = lines[lineno];
		let stack = [];
		const chars = line.split("");
		let illegal = undefined;

		line_loop:
		for (const idx in chars){
			const char = chars[idx];
			switch (char){
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
					if (expected !== char){
						log(`Line ${lineno}: Expected '${expected}' but found '${char}'`);
						illegal = char;
						break line_loop;
					}

			}
		}

		if (illegal != null)
			total +=  SCORE1[illegal];
		await step(1);
	}

	showAnswer(total);
}