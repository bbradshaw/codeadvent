async function solve2(input, step) {
	const [_, bus_input, _start] = input.split("\n");

	let divisors = [];
	let remainders = [];
	let pos = 0;
	for (const bus_id of bus_input.split(",")){
		if (bus_id !== 'x'){
			divisors.push(parseInt(bus_id))
			remainders.push(pos)
		}
		pos++;
	}

	
}