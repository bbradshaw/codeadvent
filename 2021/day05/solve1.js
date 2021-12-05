const js = JSON.stringify;
async function solve(filterStraight, input, step){

	let nav = new Navigation();
	let vents = [];

	for (const line of input.split("\n")){
		let [start, end] = line.split(" -> ");
		start = start.split(",").map( n => parseInt(n));
		end = end.split(",").map( n=> parseInt(n));
		vents.push([start, end]);
		gauge(`parsing vents`);	
		await step(0.5);
	}
	log(`parsed ${vents.length} vents`);

	if (filterStraight)
		vents = vents.filter( ([st, end]) => st[0] === end[0] || st[1] === end[1]);

	log(`found ${vents.length} straight vents`);

	let overlap = new Map();
	let count = 0;
	for (let [st, end] of vents){
		nav.trace_line(st, end)
			.forEach( pt => {
				key = `${pt[0]}:${pt[1]}`;
				const n = (overlap.get(key) || 0) + 1;
				if (n == 2) count++;
				overlap.set(key, n);
			});
		gauge(`tracing lines`)
		await step(0.5);
	}
	showAnswer(count);
	showVisual(nav, vents);
}

async function solve1(input, step){
	return solve(true, input, step);
}

function showVisual(nav, vents){

	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.style.display = 'initial';
	const x_range = nav.bounds_x[1] - nav.bounds_x[0];
	const y_range = nav.bounds_y[1] - nav.bounds_y[0];
	const x_pix_per_unit = canvas.clientWidth / x_range;
	const y_pix_per_unit = canvas.clientHeight / y_range;
	const transform_pt = pt => [Math.round(pt[0] * x_pix_per_unit), Math.round(pt[1] * y_pix_per_unit)];
	let transformed = vents.map( ([st, end]) => [transform_pt(st), transform_pt(end)]);
	for (let [st, end] of transformed){
		ctx.beginPath();
		ctx.moveTo(...st);
		ctx.lineTo(...end);
		ctx.stroke();
	}
}