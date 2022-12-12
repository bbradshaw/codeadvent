async function solve2(input, step){
	let start;
	let grid = Grid.from_input(input).map( (x, y, node) => {
		if (node === 'S')
			return {value: 1, repr: node};
		else if (node === 'E'){
			start = [x, y];
			return {value: 26, repr: node};
		}
		else
			return {value: node.charCodeAt() - 96, repr: node};
	});

	let evaluate = (grid, curx, cury, candx, candy) => {
		let curheight = grid.at(curx, cury).value;
		let candheight = grid.at(candx, candy).value;
		return candheight >= curheight - 1
	}

	let isDone = (grid, candx, candy) => {
		let letter = grid.at(candx, candy).repr
		return letter === 'a' || letter === 'S';
	}

	let path = await bfs(grid, start, evaluate, isDone, step);
	log(path.map( c => `${c} ${grid.at(c[0], c[1]).repr}`).join( "-> "));
	showAnswer(path.length);
}