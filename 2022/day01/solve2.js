async function solve2(input, step) {
	let counts = new Heap((x,y) => x.val > y.val);
	let idx = 0;
	let val = 0;

	function pushTotal(){
		counts.push({val, idx});
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

	let top3 = [counts.pop(), counts.pop(), counts.pop()];
	let answer = sum(top3.map(v => v.val));
	showAnswer(answer)
}