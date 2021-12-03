async function solve1(input, step) {
	const lines = input.split("\n");
	const length = lines[0].length;
	let counter = Array(length).fill(0);

	for (const line of lines) {
		for (const i in line.split("")) {
			counter[i] += parseInt(line[i]);
		}
		await step(1);
	}

	let answer = Array(length).fill(0);
	const bitmask = Math.pow(2, length) - 1;

	counter.forEach((val, i) => answer[i] = val > lines.length / 2 ? 1 : 0);

	answer = parseInt(answer.join(""), 2);

	showAnswer(answer * (~answer & bitmask));		//javascript bitwise stuff is limited to 32-bit so beware

}