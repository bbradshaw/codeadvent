async function solve2(input, step) {
	let lines = input.split("\n");
	const nums = lines.shift()
		.split(",")
		.map(s => parseInt(s));

	lines.shift();
	const linesToParse = lines.length;

	let boards = [];
	gauge("parsing board data");
	for (let i = 0; i < linesToParse; i += 6) {
		boards.push(Board.from_input(lines.splice(0, 5), i));
		lines.shift();
		await step(1, linesToParse / 6);
	}


	log('playing BINGO');

	let played_nums = [];
	let num = nums.shift();
	let lastWinner = null;
	while (num !== undefined) {
		gauge(`calling ${num}...`);
		played_nums.push(num);
		let winners = boards.filter( b => b.mark(num)=== Board.WINNER);
		for (const winner of winners){
			log(`${winner.id} won with ${winner.score(num, played_nums)}`);
			lastWinner = winner.score(num, played_nums);
			boards.splice(boards.indexOf(winner), 1);
			if (!boards.length) break;
		}
		await step(null);
		num = nums.shift();
	}
	showAnswer(lastWinner);
}