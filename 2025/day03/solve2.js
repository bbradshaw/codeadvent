async function solve2(input, step) {
	init();
	const data = input.trim().split("\n").map(line => line.split("").map(Number));
	let joltage = 0;
	let visualizer = new Visualizer();
	for (const row of data) {
		visualizer.begin_row(row);
		let remaining_digits = 12;
		let selected_digits = [];
		let start_idx = 0;
		while (remaining_digits > 0) {
			let end_idx = -remaining_digits + 1;
			if (end_idx === 0) {
				end_idx = undefined;
			}
			const idx = firstHighestDigitIdx(row.slice(start_idx, end_idx));
			visualizer.mark_digit(start_idx, start_idx + idx);
			selected_digits.push(row[start_idx + idx]);
			start_idx += idx + 1;
			remaining_digits--;
		}
		const this_joltage = selected_digits.reduce((acc, val) => {
			return acc * 10 + val;
		}, 0);
		gauge(`this_joltage: ${this_joltage}, total joltage: ${joltage}`);
		joltage += this_joltage;
		await step(1, data.length);
		await visualizer.finish_row();
	}
	showAnswer(joltage);
}