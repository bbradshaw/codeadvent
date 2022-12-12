class Monkey {

	constructor(starting_items, worry_op, test_mod, destT, destF, worry_divider) {
		this.items = starting_items;
		this.worry_op = worry_op;
		this.test_mod = test_mod;
		this.destT = destT;
		this.destF = destF;
		this.worry_divider = worry_divider;
	}

	static from_raw(lines) {
		lines = lines.split('\n');
		const starting_items = lines[1].split(":")[1].split(",").map(i => parseInt(i));
		const worry_op = Monkey.get_worry_op(lines[2]);
		const test_mod = parseInt(lines[3].split(" by ")[1]);
		const destT = parseInt(lines[4].split('monkey ')[1]);
		const destF = parseInt(lines[5].split('monkey ')[1]);
		return new Monkey(starting_items, worry_op, test_mod, destT, destF);
	}

	static get_worry_op(line) {
		let m = /.+old (.) (.+)/.exec(line);
		if (m[2] === 'old')
			return (o) => o * o;
		let operand = parseInt(m[2]);
		switch (m[1]) {
			case '+': return (o) => o + operand;
			case '*': return (o) => o * operand;
		}
		throw new Error(`could not parse ${line}`);
	}

	takeTurn(n_monkeys) {
		let other_monkeys = new Array(n_monkeys).fill(null).map(() => new Array());
		while (this.items.length > 0) {
			let item = this.items.shift();
			let worry = this.worry_op(item);
			worry = this.worry_divider(worry);
			if (worry % this.test_mod == 0)
				other_monkeys[this.destT].push(worry);
			else
				other_monkeys[this.destF].push(worry);
		}
		return other_monkeys;
	}
}

async function solve1(input, step) {

	let monkeys = [];

	for (const monkey_data of input.split('\n\n')) {
		let monkey = Monkey.from_raw(monkey_data);
		monkey.worry_divider = (worry) => Math.floor(worry / 3);
		monkeys.push(monkey);
	}

	const n_monkeys = monkeys.length;
	let examineCounter = new Array(n_monkeys).fill(0);
	for (let round = 0; round < 20; round++) {
		-
		log(`round ${round}`);
		for (let mi = 0; mi < n_monkeys; mi++) {
			let monkey = monkeys[mi];
			log(`monkey ${mi} has ${monkey.items.length}`);
			examineCounter[mi] += monkey.items.length;
			next_items = monkey.takeTurn(n_monkeys);
			for (let i = 0; i < n_monkeys; i++) {
				if (next_items[i].length > 0) {
					monkeys[i].items = [...monkeys[i].items, ...next_items[i]];
					log(`items ${next_items[i]} passed to monkey ${i}`);
				}
			}
		}
		await step(1, 20);
	}

	examineCounter.sort((a, b) => a - b);
	showAnswer(examineCounter.pop() * examineCounter.pop());


}