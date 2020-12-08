function parseRule(ruleText) {
	let match = ruleText.match(/(.+) bags contain (.+)/);
	if (match === null) return [];
	if (match[2] === 'no other bags.'){
		return [];
	}
	else{	
		const containerName = match[1];
		let bagNames = [];
		let raw = match[2].split(', ');
		for (let rawName of raw){
			const bagName = rawName.match(/\d+ (.+) bags?\.?/);
			if (bagName === null) throw new Error(`cannot find bagName in rawName '${rawName}'`);
			bagNames.push(bagName[1]);
		}
		return bagNames.map( bn => ({containerName: containerName, bagName: bn}));
	}

}

async function solve1(input, step){
	let graph = {};
	for (line of input.split("\n")){
		const rules = parseRule(line);
		gauge(`parsing rules ${JSON.stringify(rules)}`);
		for (rule of rules){
			if (graph[rule.bagName] === undefined)
				graph[rule.bagName] = [rule.containerName];
			else
				graph[rule.bagName].push(rule.containerName)
		}
		await step();
	}
	log(`parsed ${Object.keys(graph).length} container bags.`);

	let queue = graph['shiny gold'];
	let lastName = 'shiny gold';
	let containers = new Set();
	while (queue.length){
		let next = queue.pop();
		containers.add(next);
		if (graph[next] !== undefined){
			queue.push(...graph[next]);
			graph[next].forEach(n => log(`'${lastName}' -> '${n}'`));
		}
		gauge(`after ${next}, ${queue.length} items in queue.`);
		lastName = next;
		await step();
	}
	log(`Final answer: ${Array.from(containers)}.`);
	showAnswer(containers.size);
}