async function solve1(input, step) {
	let counts = [];
	let val = 0;
	let idx = 0;
	let best = {idx: 0, val: 0};

	function pushTotal(){
		counts.push(val);
		if (val > best.val)
			best = {val, idx};
		val = 0;
	}

	for (const line of input.split("\n")) {
		if (line === ""){
			pushTotal();
		}
		else {
			val += parseInt(line);
		}
		idx++;
		await step(1);
	}
	if (val > 0)
		pushTotal();

	showAnswer(best.val);
}