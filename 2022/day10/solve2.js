async function solve2(input, step) {
	let instructions = input.split('\n').map(parseInstruction);
	let cpu = new CPU(instructions);

	let buf = [];

	const drawPixel = (pixpos, rx) => {
		if (Math.abs(rx - pixpos) > 1)
			buf.push('.');
		else
			buf.push('█');
	};

	for (let cycle = 1; cycle <= 240; cycle++) {
		if (cycle % 40 == 1)
			buf.push('<br />\n');
		drawPixel((cycle - 1) % 40, cpu.rx);
		cpu.process();
		gauge(buf.join(''));
		await step(1, 240);
	}
	showAnswer(0);
	gauge(buf.join(''));

}