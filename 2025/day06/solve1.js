async function solve1(input, step) {
	let columns = [];
	let n_cols = null;
	for (const line of input.trim().split("\n")) {
		let row = line.trim().split(/ +/);
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
	let answer = 0;
	for (const col of columns) {
		let op = col.pop();
		switch (op) {
			case "+":
				answer += col.map(x => parseInt(x)).reduce((a, b) => a + b);
				break;
			case "*":
				answer += col.map(x => parseInt(x)).reduce((a, b) => a * b);
				break;
		}
		await step(1, columns.length);
	}
	showAnswer(answer);
}
