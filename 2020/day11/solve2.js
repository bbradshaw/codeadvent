function sightline(seats, x, y){
	let occ = 0;
	for (const vec of [[-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0]]){
		let [cx, cy] = [x, y];
		while (true){
			[cx, cy] = [cx+vec[0], cy+vec[1]];
			if (seats.outofbounds(cx, cy)) break;
			const val = seats.at(cx, cy);
			if (val === "#"){
				occ++;
				break;
			}
			if (val === "L") break;
		}
	}
	return occ;
}

async function solve2(input, step){
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
			let occ = sightline(seats, x, y);
			if (value === "#") cur_occupied++;
			if (value === "L" && occ === 0) {
				changes++;
				return '#';
			}

			else if (value === "#" && occ >= 5){
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
