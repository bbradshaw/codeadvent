async function solve1(input, step){
	const [ts, bus_input] = input.split("\n");
	const buses = bus_input.split(",").filter(b => b !=='x').map(b => parseInt(b));
	let best_time = Infinity;
	let best_id = null;
	for (let b of buses){
		let wait_time = b - (ts % b);
		log(`Would wait ${wait_time} min for ${b}`);
		if (wait_time < best_time){
			best_time = wait_time;
			best_id = b;
		}
		await step();
	}
	showAnswer(best_time * best_id);
}