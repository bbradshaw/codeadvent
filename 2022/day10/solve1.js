async function solve1(input, step) {
	let answer = 0;
	let instructions = input.split('\n').map(parseInstruction);
	let cpu = new CPU(instructions);

	for (let cycle = 1; cycle <= 220; cycle++) {
		if (cycle % 40 == 20)
			answer += (cycle * cpu.rx);
		cpu.process();
		await step(1, 220);
	}

	showAnswer(answer);

}

class CPU {
	constructor(instructions) {
		this.instructions = instructions;
		this.rx = 1;
		this.ip = 0;
		this.processtime = this.getProcessTime(this.instructions[0]);
	}

	process() {
		this.processtime--;
		if (this.processtime > 0)
			return;
		let thisInstruction = this.instructions[this.ip % this.instructions.length];
		this.executeInstruction(thisInstruction);
		this.ip++;
		this.processtime = this.getProcessTime(this.instructions[this.ip % this.instructions.length]);
	}

	getProcessTime(instruction) {
		switch (instruction.name) {
			case 'noop':
				return 1;
			case 'addx':
				return 2;
		}
	}

	executeInstruction(instruction) {
		switch (instruction.name) {
			case 'addx':
				this.rx += instruction.val1;
		}
	}
}

function parseInstruction(line) {
	if (line.startsWith('noop'))
		return { name: 'noop' }
	else if (line.startsWith('addx'))
		return { name: "addx", val1: parseInt(line.split(' ')[1]) }
}