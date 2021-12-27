async function solve2(input, step) {
	const alu = new ALU(input);
	let i = 1111110;
	let steps = 0;
	let solution;
	while (i < 9999999) {
		i++;
		const inputArr = Array.from(i.toString());
		if (inputArr.some(c => c === '0'))
			continue;
		solution = input_reduction(inputArr);
		if (solution) {
			log(`found answer ${solution}`);
			alu.reset(solution.toString().split('').map(i => parseInt(i)));
			while (!alu.done) alu.run_instruction();
			if (alu.z != 0)
				log('oh no');
			else{
				showAnswer(solution);
				break;
			}
		}
		if (steps++ % 10000 === 0) {
			await step(10000, 9999999);
			gauge(i)
		};

	}

}
