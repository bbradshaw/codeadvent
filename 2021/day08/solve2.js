/*
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
 */


// this was... not the best way to do this
function build_translator(input_str) {
	let leds = input_str.split(" ");
	let raw_mapping = new Map();
	let sort_mapping = new Map();
	let n_to_idx = {};
	let guesses = { 5: [], 6: [] };

	for (let i in leds) {
		let led = leds[i];
		sort_mapping.set(Array.from(led).sort().join(""), i);

		switch (led.length) {
			case 2:
				n_to_idx[1] = i;
				raw_mapping.set(led, "1");
				break;
			case 3:
				n_to_idx[7] = i;
				raw_mapping.set(led, "7");
				break;
			case 4:
				n_to_idx[4] = i;
				raw_mapping.set(led, "4");
				break;
			case 5:
				guesses[5].push(i);
				break;
			case 6:
				guesses[6].push(i)
				break;
			case 7:
				n_to_idx[8] = i;
				raw_mapping.set(led, "8");
				break;
		}
	}

	const n_to_set = n => new Set([...Array.from(leds[n_to_idx[n]])]);
	const set_to_i = s => sort_mapping.get([...s].sort().join(""));

	const top_bar = set_diff(n_to_set(7), n_to_set(1)).keys().next().value;
	let mid_bar, bot_bar;
	const four_with_top = new Set([top_bar, ...n_to_set(4)]);
	guesses[6] = guesses[6].filter(i => {
		const guess = new Set([...Array.from(leds[i])]);
		const diff = set_diff(guess, four_with_top);
		if (diff.size == 1) {  // [9], 6, 0 
			n_to_idx[9] = i;
			raw_mapping.set(leds[i], "9");
			bot_bar = diff.keys().next().value;
			return false;
		}
		return true;
	});

	const one_with_top_and_bot = new Set([top_bar, bot_bar, ...n_to_set(1)]);

	guesses[5] = guesses[5].filter(i => {
		const guess = new Set([...Array.from(leds[i])]);
		const diff = set_diff(guess, one_with_top_and_bot);
		if (diff.size == 1) {  // 2, [3], 5
			n_to_idx[3] = i;
			raw_mapping.set(leds[i], "3");
			mid_bar = diff.keys().next().value;
			return false;
		}
		return true;
	});

	const zero_set = set_diff(n_to_set(8), [mid_bar]);
	const zero_i = set_to_i(zero_set);
	raw_mapping.set(leds[zero_i], "0");
	n_to_idx[0] = zero_i;

	const six_i = guesses[6].filter(i => i != zero_i)[0];
	raw_mapping.set(leds[six_i], "6");
	n_to_idx[6] = six_i;

	let count = newCounter();
	let bot_r_bar;
	for (let word of leds) {
		for (let letter of word)
			count[letter] += 1;
	}
	for (let letter of Object.keys(count)) {
		if (count[letter] == leds.length - 1) { //appears in every number but '2'
			bot_r_bar = letter;
			break;
		}
	}

	guesses[5] = guesses[5].filter(i => {
		if (!Array.from(leds[i]).includes(bot_r_bar)) { // [2], 5
			raw_mapping.set(leds[i], "2");
			return false;
		}
		return true;
	});

	const five_i = guesses[5][0];
	raw_mapping.set(leds[five_i], "5");

	return function translate(input_led){
		const sorted_in = Array.from(input_led).sort().join("");
		const idx = sort_mapping.get(sorted_in);
		return raw_mapping.get(leds[idx]);
	}
}


async function solve2(input, step) {
	const displays = input.split("\n");
	let total = 0;
	for (const line of displays) {
		const [input, output] = line.split(" | ");
		let translate = build_translator(input);
		let digits = [];
		for (const led of output.split(" ")) {
			digits.push(translate(led));
		}
		let transl_out = parseInt(digits.join(""));
		log(`${output}   ==   ${transl_out}`);
		total += transl_out;

		await step(1);
	}

	showAnswer(total);

}