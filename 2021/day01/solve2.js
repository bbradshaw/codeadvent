function sum(arr) {
	return arr.reduce((acc, n) => acc + n, 0);
}

async function solve2(input, step) {
	let last = [];
	let window = [];
	let count = 0;

	for (const line of input.split("\n")) {
		const thisInt = parseInt(line);
		window.push(thisInt);
		if (window.length > 3) {
			window = window.slice(1, 4);
		}

		if (last.length == 3) {

			const sumw = sum(window);
			const suml = sum(last);
			if (sumw > suml) {
				gauge(`${JSON.stringify(window)} > ${JSON.stringify(last)}`);
				count++;
			} else {
				gauge(`%${JSON.stringify(window)} <= ${JSON.stringify(last)}`);
			}
		}

		last = window.slice(0);
		await step(1);
	}
	showAnswer(count);
}