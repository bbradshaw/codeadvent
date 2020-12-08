async function solve1(input, step) {
	let ids = [];
	for (const line of input.split("\n")){
		let row = 0;
		for (let i = 0; i < 7; i++){
			let n = line[i] == "F" ? 0 : 1;
			row = row << 1;
			row += n;
		}
		let col = 0;
		for (let i = 7; i < 10; i++){
			let n = line[i] == "L" ? 0 : 1;
			col = col << 1;
			col += n;
		}
		const id = row*8 + col;
		ids.push(id)
		await step();
		log(`${line}: row ${row}, col ${col}, id: ${id}`);
	}

	showAnswer(Math.max(...ids));
}