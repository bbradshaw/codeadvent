async function run(instructions, step) {
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
			case 'end':
				log(`program end reached! at ${ip}`);
				return [acc, seen];
		}
		if (seen.has(ip)) {
			log(`Loop detected from '${last_ip}: ${instructions[last_ip].instruction} ${instructions[last_ip].value}'` +
				` -> '${ip}: ${code.instruction} ${code.value}'`);
			return [null, seen];
		}
	}
}

async function solve2(input, step) {
	let instructions = [];
	let lines = input.split("\n");
	let i = 0;
	for (i=0; i<lines.length; i++) {
		let [instruction, val] = lines[i].split(" ");
		instructions.push({ instruction, value: parseInt(val)});
	}
	log(`parsed ${i} instructions.`);
	let [_, usedPath] = await run(instructions, step);
	log(`pristine run path of ${usedPath.size} instructions`);
	instructions.push({ instruction: 'end', value: 0});

	for (i=0; i<instructions.length; i++) {
		const code = instructions[i];
		if (code.instruction === 'acc' || code.instruction === 'end') continue;
		if (!usedPath.has(i)) continue;
		let new_code;
		if (code.instruction === 'nop') {
			new_code = Object.assign({}, code, { instruction: 'jmp' });
			log(`replacing nop with jmp at ${i}`);
		}
		else {
			new_code = Object.assign({}, code, { instruction: 'nop' });
			log(`replacing jmp with nop at ${i}`);
		}
		const result = await run([...instructions.slice(0, i), new_code, ...instructions.slice(i + 1)], step);
		await step();
		if (result[0] !== null) {
			showAnswer(result[0]);
			break;
		}
	}
}