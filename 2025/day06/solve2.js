async function solve1(input, step) {
	let columns = [];
	let n_cols = null;
	for (const line of input.split("\n")) {
		let row = line.split("");
		if (n_cols === null) {
			n_cols = row.length;
			for (let i = 0; i < n_cols; i++) {
				columns.push([]);
			}
		}
		for (let i = 0; i < n_cols; i++) {
			columns[i].push(row[i]);
		}
	}
	let left_boundaries = {};
	for (let i = 0; i < columns.length; i++) {
		const col = columns[i];
		const last_char = col[col.length - 1];
		if (last_char === "+" || last_char === "*") {
			left_boundaries[i] = { op: last_char, values: [] };
		}
	}
	let cur_boundary = Math.min(...Object.keys(left_boundaries));
	for (let i = cur_boundary; i < columns.length; i++) {
		if (i in left_boundaries) {
			cur_boundary = i;
		}
		let col = columns[i];

		let subtotal = 0;
		let power = 0;
		for (let j = col.length - 1; j >= 0; j--) {
			const char = col[j];
			if (char === "+" || char === "*" || char === " " || char == undefined) {
				continue;
			}
			subtotal += parseInt(char) * (10 ** power);
			power++;
		}
		if (!power) {
			left_boundaries[cur_boundary].values.push(subtotal);
		}
		await step(1, columns.length + 1);
	}

	let answer = 0;
	for (const rb of Object.values(left_boundaries)) {
		switch (rb.op) {
			case "+":
				answer += rb.values.reduce((a, b) => a + b);
				break;
			case "*":
				answer += rb.values.reduce((a, b) => a * b);
				break;
		}
	}
	await step(1);
	showAnswer(answer);
}
