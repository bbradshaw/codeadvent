class ALU {
	constructor(code) {
		this.code = code.split("\n").map(l => l.split(" "));
	}

	reset(input) {
		this.w = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.ip = 0;
		this.input = input;
		this.input_i = 0;
		this.done = false;
	}

	run_instruction() {
		const [cmd, lval, rval] = this.code[this.ip++];
		switch (cmd) {
			case 'inp':
				this.setreg(lval, this.readinput()); break;
			case 'add':
				this.setreg(lval, this.val(rval) + this.val(lval));
				if (cmd === 'add' && lval === 'z')
					log(`x=${this.x} y=${this.y} z=${this.z} w=${this.w}`);
				break;
			case 'mul':
				this.setreg(lval, this.val(rval) * this.val(lval)); break;
			case 'div':
				this.setreg(lval, Math.floor(this.val(lval) / this.val(rval))); break;
			case 'mod':
				this.setreg(lval, this.val(lval) % this.val(rval)); break;
			case 'eql':
				this.setreg(lval, this.val(lval) === this.val(rval) ? 1 : 0); break;
			default:
				throw new Error(`parse failed ${cmd}`);
		}

		if (this.ip >= this.code.length)
			this.done = true;
	}

	setreg(reg, val) {
		this[reg] = val;
	}

	val(val) {
		if (['w', 'x', 'y', 'z'].includes(val))
			return this[val];
		else
			return parseInt(val);
	}

	readinput() {
		return parseInt(this.input[this.input_i++]);
	}
}

const input_reduction = (try_num) => {
	const nth = (n) => parseInt(try_num[n]);
	let converted = [
		nth(0),
		nth(1),
		nth(2),
		nth(2) + 5,
		nth(3),
		nth(3) - 3,
		nth(4),
		nth(4) + 7,
		nth(5),
		nth(6),
		nth(6) - 1,
		nth(5) + 3,
		nth(1) + 6,
		nth(0)
	]
	if (converted.some(n => n < 1 || n > 9))
		return null;
	return parseInt(converted.join(""));
}
/*
const input_reduction = (try_num) => {
	const nth = (n) => parseInt(try_num[n]);
	let converted = [
		nth(0),
		nth(1),
		nth(2),
		nth(3),
		nth(3) - 3,
		nth(4),
		nth(4) - 8,
		nth(5),
		nth(5) + 7,
		nth(2) - 1,
		nth(6),
		nth(6) + 8,
		nth(1) - 6,
		nth(0) + 4
	]
	if (converted.some(n => n < 1 || n > 9))
		return null;
	return parseInt(converted.join(""));
}*/

async function solve1(input, step) {
	const alu = new ALU(input);
	let i = 9999999 + 1;
	let steps = 0;
	let solution;
	while (i > 1111111) {
		i--;
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

function test() {
	const binary = new ALU(`inp w
mul x 0
add x z
mod x 26
div z 1
add x 13
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 14
mul y x
add z y`);

	binary.reset([13]);
	while (!binary.done) binary.run_instruction();
	assert(binary.w === 1);
	assert(binary.x === 1);
	assert(binary.y === 0);
	assert(binary.z === 1);

}
test();