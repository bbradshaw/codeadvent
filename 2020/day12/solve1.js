function direction_from_heading(heading){
	switch (heading){
		case 0: 
			return Navigation.NORTH;
		case 90:
			return Navigation.EAST;
		case 180:
			return Navigation.SOUTH;
		case 270:
			return Navigation.WEST;
		default:
			throw new Error(`non manhattan heading of '${heading}'`);
	}
}

async function solve1(input, step){
	const ocean = new Navigation();
	let heading = 90;

	const boat = ocean.new_actor("B");
	
	for (const line of input.split("\n")){
		let cmd = line.substring(0,1);
		let amount = line.substring(1);
		amount = parseInt(amount);
		if (cmd === 'R'){
			heading = modulo((heading + amount), 360);
			continue;
		}
		if (cmd === 'L'){
			heading = modulo((heading - amount), 360);
			continue;
		}
		let dir;
		switch(cmd){
			case 'N': dir = Navigation.NORTH; break;
			case 'E': dir = Navigation.EAST; break;
			case 'S': dir = Navigation.SOUTH; break;
			case 'W': dir = Navigation.WEST; break;
			case 'F': dir = direction_from_heading(heading); break;
		}
		ocean.move_by_vec(boat, {direction: dir, magnitude: amount});
		log(`after '${line}', boat = '${ocean.get_position(boat)}'`);
		await step();
	}
	showAnswer(ocean.manhattan(boat, Navigation.ORIGIN));
}