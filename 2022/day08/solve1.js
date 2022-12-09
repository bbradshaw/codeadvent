async function solve1(input, step) {

	let trees = Grid.from_input(input).map((x, y, v) => parseInt(v));

	let treesSeen = new Set();

	for (let y = 0; y < trees.height; y++) {
		log(`starting from left`);
		treesSeen = set_union(treesSeen, raycastTreeSight(trees, -1, y, (x, y) => [x+1, y]));
		log(`starting from right`);
		treesSeen = set_union(treesSeen, raycastTreeSight(trees, trees.width, y, (x, y)=> [ x - 1, y]));
		await step(0.5);
	}
	for (let x = 0; x < trees.width; x++){
		log(`starting from bot`);
		treesSeen = set_union(treesSeen, raycastTreeSight(trees, x, -1, (x, y) => [x, y+1]));
		log(`starting from top`);
		treesSeen = set_union(treesSeen, raycastTreeSight(trees, x, trees.height, (x, y) => [x, y-1]));
		await step(0.5);
	}

	showAnswer(treesSeen.size);
}

coord = (x, y) => `${x},${y}`;

function raycastTreeSight(trees, start_x, start_y, rayFn) {
	let treesSeen = new Set();
	let min_tree_height = -1;
	for (let [x, y, height] of trees.raycast(start_x, start_y, rayFn)) {
		if (height > min_tree_height) {
			treesSeen.add(coord(x, y));
			min_tree_height = height;
		}
	}
	log(`Found trees at ${[...treesSeen].join("; ")}`);
	return treesSeen;
}