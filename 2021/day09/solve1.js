async function solve1(input, step){

	let heightmap = Grid.from_input(input);

	let low_points = [];
	let low_points_coords = [];
	let lastPty = 0;
	for (let [ptx, pty, val] of heightmap){
		let neighbor_vals = heightmap.neighbors(ptx, pty, false).map(([cpx, cpy]) => parseInt(heightmap.at(cpx, cpy)));
		val = parseInt(val);
		if (stepDelay > 10) gauge(`checking ${ptx}, ${pty} = val ${val} vs ${JSON.stringify(neighbor_vals)}`);

		if (neighbor_vals.every(cpval => cpval > val)){
			low_points.push(val);
			low_points_coords.push(`${ptx},${pty}`);
			log(`low point found at ${ptx}, ${pty} with value ${val}`);
		}
		if (lastPty != pty) await step(1);
		lastPty = pty;
	}
	const answer = sum(low_points.map(val => val+1));
	showAnswer(answer);

	let printable_heightmap= heightmap.map( (x, y, val) => low_points_coords.includes(`${x},${y}`) ? `<b>${val}</b>` : `${val}`);
	printable_heightmap.printable().split("\n").forEach(l => log(l));
}