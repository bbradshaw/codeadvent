async function solve2(input, step){
	let heightmap = Grid.from_input(input).map( (_x, _y, val) => parseInt(val));
	let in_basin = new Set();
	let basins = [];
	const pos = (x, y) => `${x},${y}`;

	lastY = 0;
	for (let [ptx, pty, val] of heightmap){
		if (val === 9 || in_basin.has(pos(ptx, pty)))
			continue;
		
		let to_check = [[ptx, pty]];
		let this_basin = [];
		while (to_check.length){
			let [cur_x, cur_y] = to_check.pop();
			if (!in_basin.has(pos(cur_x, cur_y)))
				this_basin.push([cur_x, cur_y, heightmap.at(cur_x, cur_y)]);
			in_basin.add(pos(cur_x, cur_y));
			for (let [nx, ny] of heightmap.neighbors(cur_x, cur_y, false)){
				const nval = heightmap.at(nx, ny);
				if (nval === 9 || in_basin.has(pos(nx, ny)))
					continue;
				to_check.push([nx, ny]);
			}
		}
		basins.push(this_basin);
		if (pty !== lastY) await step(1);
		lastY = pty;
	}
	basins.sort( (a, b) => b.length - a.length);

	const answer = basins.slice(0, 3).map( b => b.length).reduce( (a, v) => a*v);
	showAnswer(answer);
	showVisual(heightmap, basins);
}

function selectColor(number) {
	const hue = (number * 137.508) % 360; // use golden angle approximation
	return `hsl(${hue},50%,75%)`;
  }

function showVisual(heightmap, basins){
	const pos = (x, y) => `${x},${y}`;
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	const x_rect_size = Math.floor(canvas.width / heightmap.width);
	const y_rect_size = Math.floor(canvas.height / heightmap.height);

	let basinColors = {};
	let pt2Basin = {};
	for (let i in basins){
		const basin = basins[i];
		basinColors[i] = selectColor(i);
		basin.forEach(([x,y,v]) => pt2Basin[pos(x, y)] = i);
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.style.display = 'initial';

	for (let [x, y, val] of heightmap){
		const color = basinColors[pt2Basin[pos(x,y)]];
			ctx.fillStyle = color;
		ctx.fillRect(x*x_rect_size, y*y_rect_size, (x+1)*x_rect_size, (y+1)*y_rect_size);
	}
}