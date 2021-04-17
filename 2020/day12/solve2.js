function rotate_waypoint_around(ocean, waypoint, boat, deg){
	let rel_vec = ocean.relative_vec(waypoint, boat);
	const rad = deg * Math.PI/180;

	let x = rel_vec.direction[0] * Math.round(Math.cos(rad)) - rel_vec.direction[1]* Math.round(Math.sin(rad));
	let y = rel_vec.direction[0] * Math.round(Math.sin(rad)) + rel_vec.direction[1]* Math.round(Math.cos(rad));
	
	const boat_position = ocean.get_position(boat);
	let new_waypoint_pos = [x + boat_position[0], y + boat_position[1]];
	ocean.set_position(waypoint, new_waypoint_pos);
}

async function solve2(input, step) {
	const ocean = new Navigation();

	const boat = ocean.new_actor("B");
	const waypoint = ocean.new_actor("W");

	ocean.set_position(waypoint, [10,1]);

	for (const line of input.split("\n")) {
		let cmd = line.substring(0, 1);
		let amount = line.substring(1);
		amount = parseInt(amount);
		if (cmd === 'R') {
			rotate_waypoint_around(ocean, waypoint, boat, 360-amount);
		}
		else if (cmd === 'L') {
			rotate_waypoint_around(ocean, waypoint, boat, amount);
		}
		else if (cmd === 'F') {
			let vec = ocean.relative_vec(waypoint, boat);
			vec.magnitude *= amount;
			ocean.move_by_vec(waypoint, vec);
			ocean.move_by_vec(boat, vec);
		}
		else {
			let dir;
			switch (cmd) {
				case 'N': dir = Navigation.NORTH; break;
				case 'E': dir = Navigation.EAST; break;
				case 'S': dir = Navigation.SOUTH; break;
				case 'W': dir = Navigation.WEST; break;
			}
			ocean.move_by_vec(waypoint, { direction: dir, magnitude: amount });
		}
		log(`after '${line}', boat = '${ocean.get_position(boat)}'`+
		`, waypoint = '${ocean.get_position(waypoint)}' relative = '${ocean.relative_vec(waypoint, boat).direction}'`);
		await step();
	}
	showAnswer(ocean.manhattan(boat, Navigation.ORIGIN));
}