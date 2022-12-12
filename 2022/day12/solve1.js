async function solve1(input, step){
	let start;
	let grid = Grid.from_input(input).map( (x, y, node) => {
		if (node === 'S'){
			start = [x, y];
			return {value: 1, repr: node};
		}
		else if (node === 'E')
			return {value: 26, repr: node};
		else
			return {value: node.charCodeAt() - 96, repr: node};
	});

	let evaluate = (grid, curx, cury, candx, candy) => {
		let curheight = grid.at(curx, cury).value;
		let candheight = grid.at(candx, candy).value;
		return candheight <= curheight + 1;
	}

	let isDone = (grid, candx, candy) => {
		return grid.at(candx, candy).repr === 'E';
	}

	let path = await bfs(grid, start, evaluate, isDone, step);
	path.reverse();
	log(path.map( c => `${c} ${grid.at(c[0], c[1]).repr}`).join( "-> "));
	showAnswer(path.length);
}

const coord = (x, y) => `${x},${y}`;


async function bfs(grid, start, evaluate, isDone, step){

	let to_visit = [start];
	let visited = new Map();
	visited.set(coord(start[0], start[1]), null);

	while (to_visit.length > 0){
		gauge(`to investigate: ${to_visit.length}`);
		if (step) await step(null, null, 50);
		let [curx, cury] = to_visit.pop();
		for (let neighbor of grid.neighbors(curx, cury)){
			if (visited.has(coord(neighbor[0], neighbor[1])))
				continue;
			if (!evaluate(grid, curx, cury, neighbor[0], neighbor[1]))
				continue;
			visited.set(coord(neighbor[0], neighbor[1]), [curx, cury]);
			if (isDone(grid, neighbor[0], neighbor[1]))
				return generateAnswerPath([], neighbor, visited);
			to_visit = [[neighbor[0], neighbor[1]], ...to_visit];
		}
	}
	throw new Error("no solution found");
}

function generateAnswerPath(path, from, visited){
	let nxt = visited.get(coord(from[0], from[1]));
	if (nxt == null)
		return path;
	path.push(nxt);
	return generateAnswerPath(path, nxt, visited);
}