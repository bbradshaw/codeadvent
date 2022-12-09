async function solve2(input, step) {
	let trees = Grid.from_input(input).map((x, y, v) => parseInt(v));
	let scores = new Heap((x, y) => x.score > y.score);

	await gridForEach(trees, async (x, y, height) => {
		drawTrees(trees, x, y);
		let right = treeViewFrom(trees, x, y, height, (x, y) => [x + 1, y]);
		let left = treeViewFrom(trees, x, y, height, (x, y) => [x - 1, y]);
		let up = treeViewFrom(trees, x, y, height, (x, y) => [x, y + 1]);
		let down = treeViewFrom(trees, x, y, height, (x, y) => [x, y - 1]);
		let score = left * right * up * down;
		log(`considering (${x},${y}) ${JSON.stringify({left, right, up, down})} score = ${score}`);
		scores.push({ x, y, score });
		await step(1, trees.height*trees.width, 100);
	});
	showAnswer(scores.pop().score);
}

function treeViewFrom(trees, x, y, startHeight, rayFn) {
	let treesSeen = 0;
	let minHeight = -1;
	for (let [_x, _y, height] of trees.raycast(x, y, rayFn)) {
		treesSeen += 1
		if (height >= startHeight || height < minHeight) {
			return treesSeen;
		}
	}
	return treesSeen;
}

async function gridForEach(grid, fn) {
	for (let y = 0; y < grid.height; y++) {
		for (let x = 0; x < grid.width; x++) {
			await fn(x, y, grid.at(x, y));
		}
	}
}
