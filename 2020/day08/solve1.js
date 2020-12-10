async function solve1(input, step) {
	let instructions = [];
	let lines = input.split("\n");
	let i = 0;
	for (i=0; i<lines.length; i++) {
		let [instruction, val] = lines[i].split(" ");
		instructions.push({ instruction, value: parseInt(val), addr: i });
	}
	log(`parsed ${i} instructions.`);

	let acc = 0;
	let seen = new Set();
	let ip = 0;
	let last_ip = 0;
	while (true) {
		code = instructions[ip];
		gauge(`running '${code.instruction} ${code.value}'`);
		seen.add(ip);
		last_ip = ip;
		switch (code.instruction) {
			case 'acc':
				acc += code.value;
				ip++;
				break;
			case 'jmp':
				ip += code.value;
				break;
			case 'nop':
				ip++;
				break;
		}
		await step();
		if (seen.has(ip)) {
			log(`Loop detected from '${last_ip}: ${instructions[last_ip].instruction} ${instructions[last_ip].value}'` +
				` -> '${ip}: ${code.instruction} ${code.value}'`);
			break;
		}
	}

	showAnswer(acc);
}