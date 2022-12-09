const coord = (p) => `${p[0]},${p[1]}`;

async function solve1(input, step){
	let answer = null;

	let nav = new Navigation();
	let head = Navigation.ORIGIN;
	let tail = Navigation.ORIGIN;
	let history = {head: [], tail: []};

	for (const line of input.split('\n')){
		let move = parseMove(line);
		for (let i =0; i < move.times; i++){
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

function parseMove(line){
	let m = /(.) (\d+)/.exec(line);
	let direction;
	switch (m[1]){
		case 'R': direction = Navigation.EAST; break;
		case 'L': direction = Navigation.WEST; break;
		case 'U': direction = Navigation.NORTH; break;
		case 'D': direction = Navigation.SOUTH; break;
	}

	return {vec: {direction, magnitude: 1}, times: parseInt(m[2])};
}

function shouldMoveTail(head, tail){
	let distance = Navigation.chebyshev(head, tail);
	if (distance < 2)
		return {direction: [0, 0], magnitude: 0}
	let difference = Navigation.relative_vec(tail, head);
	difference.direction = clamp(difference.direction);
	return difference;
}

function clamp(p){
	return [p[0] / (Math.abs(p[0]) || 1), p[1] / (Math.abs(p[1]) || 1) ];
}

async function animate(nav, history, step){
	
	for (let i = 0; i < history.head.length; i++){
		let buf = [];
		for (let y = nav.bounds_y[1]; y >= nav.bounds_y[0]; y--){
			buf.push([]);
			let bufpos = Math.abs(y - nav.bounds_y[1]);
			for (let x = nav.bounds_x[0]; x <= nav.bounds_x[1]; x++){
				let headpos = history.head[i];
				let tailpos = history.tail[i];

				if (headpos[0] == x && headpos[1] == y)
					buf[bufpos].push("H");
				else if (tailpos[0] == x && tailpos[1] == y)
					buf[bufpos].push("T");
				else
					buf[bufpos].push(".");
			}
			buf[bufpos] = buf[bufpos].join('');
	}
		gauge(buf.join('<br />\n'));

		await step(0);
	}
}