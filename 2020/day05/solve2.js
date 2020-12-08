async function solve2(input, step) {
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
		ids.push(id);
		log(`${line}: row ${row}, col ${col}, id: ${id}`);
		await step();
	}
	let max = Math.max(...ids);
	let check = new Set(ids);
	for (let i=max; i > 0; i--){
		if (!check.has(i))
			return showAnswer(i);
		gauge(`checking ${i}`);
		await step();
	}
}