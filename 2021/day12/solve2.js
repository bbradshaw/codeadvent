
async function solve2(input, step) {

	const STEP_INTERVAL = 1000;

	let cave = new CaveGraph(input);
	log(`parsed ${Object.keys(cave.nodes).length} nodes`);

	let paths = [];

	let stack = [{ node: cave.start, path: [] }];

	let pause = 0;
	while (stack.length) {
		let { node: currentNode, path: currentPath } = stack.pop();
		currentPath.push(currentNode.name);

		if (pause++ % STEP_INTERVAL == 0) {
			gauge(`${stack.length} potential paths in queue`);
			await step(null);
		}

		if (currentNode.name == 'end') {
			//log(`found a path through: ${pathString(currentPath)}`);
			paths.push(currentPath);
			continue;
		}

		canVisitSmallCaveGivenPath = (nn, path) => {
			small = path.filter(pn => !cave.nodes[pn].isBig);
			if (!small.includes(nn)) return true;
			let count = newCounter();
			for (let pn of small) {
				if (++count[pn] > 1)
					return false;
			}
			return true;
		}

		for (connectedNodeName of currentNode.connections) {
			let connectedNode = cave.nodes[connectedNodeName];
			if (connectedNode.special == 'start' ||
				!canVisitSmallCaveGivenPath(connectedNodeName, currentPath)) {
				continue;
			}

			stack.push({ node: connectedNode, path: currentPath.slice() });
		}
	}

	showAnswer(paths.length);

}