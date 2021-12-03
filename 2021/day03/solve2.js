async function solve2(input, step) {
	const lines = input.split("\n");
	const length = lines[0].length;
	let numbers = [];

	for (const line of lines) {
		numbers.push(parseInt(line, 2));
		await step(1);
	}

	log(`parsed ${lines.length} numbers with ${length} digits`);

	getCommon = arr => {
		let cutoff = Math.ceil( arr.length / 2);
		let common = 0;
		for (let place = 0; place < length; place++){
			const mask = Math.pow(2, place);
			const total_ones = sum(arr.map(n => mask & n)) >> place;
			if (total_ones >= cutoff) 
				common += mask;
		}
		return common;
	}

	let oxygen = numbers.slice();
	for (let searchBit = Math.pow(2, length); searchBit ; searchBit >>= 1){	// the best for loop i have ever written
		const is_common = getCommon(oxygen);
		oxygen = oxygen.filter( n => searchBit & (is_common ^ ~n));
		if (oxygen.length < 2) break;
		await step(undefined);
	}

	log(`final survivor of oxygen is 0b${oxygen[0].toString(2)}`);

	let co2 = numbers.slice();
	for (let searchBit = Math.pow(2, length-1); searchBit ; searchBit >>= 1) {
		const is_common = getCommon(co2);
		co2 = co2.filter( n => searchBit & (is_common ^ n));
		if (co2.length <2 ) break;
		await step(undefined);
	}
	log(`final survivor of co2 is 0b${co2[0].toString(2)}`);

	showAnswer(co2[0]*oxygen[0]);
}