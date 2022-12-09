async function solve2(input, step){
	let nav = new Navigation();
	let parts = new Array(10).fill(null).map( () => Navigation.ORIGIN);
	let history = {};
	parts.forEach( (_v, i) => history[i] = []);

	for (const line of input.split('\n')){
		let move = parseMove(line);
		for (let i =0; i < move.times; i++){
			parts.forEach( (v, i) => history[i].push(v));

			parts[0] = nav.move_by_vec(parts[0], move.vec);
			for (let p = 1; p < 10; p++){
				let tailvec = shouldMoveTail(parts[p-1], parts[p]);
				parts[p] = nav.move_by_vec(parts[p], tailvec);
			}
		}
		parts.forEach( (v, i) => history[i].push(v));
		await step(1);
	}
	
	showAnswer((new Set(history[9].map(coord))).size);
	await animate2(nav, history, step);
}

async function animate2(nav, history, step){
	for (let h = 0; h < history[0].length; h++){
		let txt = nav.createTextRepresentationFromBounds( (x, y) => {
			if (history[0][h][0] == x && history[0][h][1] == y) return 'H';
			for (let i=1; i < 10; i++)
				if (history[i][h][0] == x && history[i][h][1] == y) return i;
			return '.';
		});
		gauge(txt);
		await step(0);
	}
}