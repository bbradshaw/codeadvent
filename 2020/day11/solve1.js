async function solve1(input, step){
	let seats = Grid.from_input(input);
	let changes = 0;
	let cur_occupied=0;
	let i = 0;
	for (i=0; i < 10000; i++){
		gauge(`changes from last: ${changes}<pre>\n${seats.printable()}</pre>`);
		await step();

		changes = 0;
		cur_occupied = 0;
		seats = seats.map( (x, y, value) => {
			let occ = 0;
			for (const n_pos of seats.neighbors(x, y, true)){
				if (seats.at(...n_pos) === '#') occ++;
			}
			if (value === "#") cur_occupied++;
			if (value === "L" && occ === 0) {
				changes++;
				return '#';
			}

			else if (value === "#" && occ >= 4){
				changes++;
				return 'L';
			}
			if (value === '.') return '.';
			return value;
		});
		if (changes === 0) break;
	}
	log(`<pre>After ${i} iterations:\n${seats.printable()}</pre>`);
	showAnswer(cur_occupied);
}
