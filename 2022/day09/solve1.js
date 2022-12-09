const coord = (p) => `${p[0]},${p[1]}`;

async function solve1(input, step) {
	let answer = null;

	let nav = new Navigation();
	let head = Navigation.ORIGIN;
	let tail = Navigation.ORIGIN;
	let history = { head: [], tail: [] };

	for (const line of input.split('\n')) {
		let move = parseMove(line);
		for (let i = 0; i < move.times; i++) {
			history.head.push(head);
			history.tail.push(tail);
			head = nav.move_by_vec(head, move.vec);
			let tailvec = shouldMoveTail(head, tail);
			tail = nav.move_by_vec(tail, tailvec);
		}
		history.head.push(head);
		history.tail.push(tail);
		//await step(1);
	}

	showAnswer((new Set(history.tail.map(coord))).size);
	await animate(nav, history, step);
}

function parseMove(line) {
	let m = /(.) (\d+)/.exec(line);
	let direction;
	switch (m[1]) {
		case 'R': direction = Navigation.EAST; break;
		case 'L': direction = Navigation.WEST; break;
		case 'U': direction = Navigation.NORTH; break;
		case 'D': direction = Navigation.SOUTH; break;
	}

	return { vec: direction, times: parseInt(m[2]) };
}

function shouldMoveTail(head, tail) {
	let distance = Navigation.chebyshev(head, tail);
	if (distance < 2)
		return [0, 0];
	let difference = Navigation.relative_vec(tail, head);
	difference = Navigation.clamped_pos(difference);
	return difference;
}

async function animate(nav, history, step) {

	for (let i = 0; i < history.head.length; i++) {

		let headpos = history.head[i];
		let tailpos = history.tail[i];
		let txt = nav.createTextRepresentationFromBounds((x, y) => {
			if (headpos[0] == x && headpos[1] == y)
				return 'H';
			else if (tailpos[0] == x && tailpos[1] == y)
				return 'T';
			else
				return '.';
		});
		gauge(txt);
		await step(0);
	}
}
