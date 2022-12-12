

async function solve2(input, step) {

	let monkeys = [];

	for (const monkey_data of input.split('\n\n')) {
		let monkey = Monkey.from_raw(monkey_data);
		monkeys.push(monkey);
	}
	let common_multiple = monkeys.reduce( (acc, m) => m.test_mod * acc, 1);
	log(`common multiple of all monkey mod quotient is ${common_multiple}`);
	monkeys.forEach( m => {
		m.worry_divider = (worry) => worry % common_multiple
	});
	const n_monkeys = monkeys.length;
	let examineCounter = new Array(n_monkeys).fill(0);
	for (let round = 0; round < 10000; round++) {
		-
		log(`round ${round}`);
		for (let mi = 0; mi < n_monkeys; mi++) {
			let monkey = monkeys[mi];
			//log(`monkey ${mi} has ${monkey.items.length}`);
			examineCounter[mi] += monkey.items.length;
			next_items = monkey.takeTurn(n_monkeys);
			for (let i = 0; i < n_monkeys; i++) {
				if (next_items[i].length > 0) {
					monkeys[i].items = [...monkeys[i].items, ...next_items[i]];
					log(`items ${next_items[i]} passed to monkey ${i}`);
				}
			}
		}
		await step(1, 10000, 100);
	}

	examineCounter.sort((a, b) => a - b);
	showAnswer(examineCounter.pop() * examineCounter.pop());
}