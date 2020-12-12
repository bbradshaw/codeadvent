function isValid(nums, target) {
    let paired = new Set();
    for (const thisInt of nums){
        if (paired.has(thisInt)) {
            const matched = target - thisInt;
            return true;
        }
        paired.add(target-thisInt);
	}
	return false;
}

async function solve1(input, step){
	const WINDOW_SIZE = 25;
	let window = [];
	let todo = [];
	for (const line of input.split("\n")){
		const int = parseInt(line);

		if (window.length < WINDOW_SIZE){
			window.push(int);
		}
		else{
			todo.push(int);
		}
	}

	for (const n of todo){
		gauge(`evaluating ${n}`);
		await step();
		if (!isValid(window, n)){
			showAnswer(n);
			return;
		}

		window.shift();
		window.push(n)
	}
}