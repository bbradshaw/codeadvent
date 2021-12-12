class CaveNode {
	constructor(name) {
		this.name = name;
		this.isBig = name.toUpperCase() == name;
		this.special = ['start', 'end'].includes(name) ? name : null;
		this.connections = [];
	}

	static connect(n1, n2) {
		n1.connections.push(n2.name);
		n2.connections.push(n1.name);
	}
}

class CaveGraph {
	constructor(input) {
		this.nodes = {};
		for (let line of input.split("\n")) {
			let theseNodes = [];
			for (let nodename of line.split("-")){
				if (!this.nodes.hasOwnProperty(nodename))
					this.nodes[nodename] = new CaveNode(nodename);
				let node = this.nodes[nodename];
				if (node.special === 'start') this.start = node;
				if (node.special === 'end') this.end = node;
				theseNodes.push(node);
			}
			CaveNode.connect.apply(this, theseNodes);
		}
	}
}

function pathString(path){
	return path.join(",");
}

async function solve1(input, step) {
	let cave = new CaveGraph(input);
	log(`parsed ${Object.keys(cave.nodes).length} nodes`);

	let paths = [];

	let stack = [{node: cave.start, path: []}];

	let pause = 0;
	while (stack.length){
		let {node: currentNode, path: currentPath} = stack.pop();
		currentPath.push(currentNode.name);

		if (pause++ % 30 == 0){
			gauge(`${stack.length} potential paths in queue`);
			await step(null);
		}

		if (currentNode.name == 'end'){
			log(`found a path through: ${pathString(currentPath)}`);
			paths.push(currentPath);
			continue;
		}

		for (connectedNodeName of currentNode.connections){
			let connectedNode = cave.nodes[connectedNodeName];
			if (!connectedNode.isBig && currentPath.includes(connectedNodeName))
				continue;
			
			stack.push({node:connectedNode, path: currentPath.slice()});
		}
	}

	showAnswer(paths.length);

}