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
			const bagName = rawName.match(/(\d+) (.+) bags?\.?/);
			if (bagName === null) throw new Error(`cannot find bagName in rawName '${rawName}'`);
			bagNames.push({bagName: bagName[2], quantity: bagName[1]});
		}
		return bagNames.map( bn => ({containerName: containerName, bagName: bn.bagName, quantity: bn.quantity}));
	}

}

async function solve2(input, step){
	let graph = {};
	for (line of input.split("\n")){
		const rules = parseRule(line);
		gauge(`parsing rules ${JSON.stringify(rules)}`);
		for (rule of rules){
			if (graph[rule.containerName] === undefined)
				graph[rule.containerName] = [{bagName: rule.bagName, quantity: rule.quantity}];
			else
				graph[rule.containerName].push({bagName: rule.bagName, quantity: rule.quantity})
		}
		await step();
	}
	log(`parsed ${Object.keys(graph).length} containing bags.`);

	let queue = [{quantity: 1, contains: graph['shiny gold'], name: 'shiny gold'}];
	let total = 0;  
	while (queue.length){
		let next = queue.pop();
		let semitotal = 0;
		for (const nextBag of next.contains){
			if (nextBag.bagName === 'shiny gold'){
				throw new Error("infinite cycle!");
			}
			semitotal += nextBag.quantity * next.quantity;
			log(`each of ${next.quantity} ${next.name} contains ${nextBag.quantity} ${nextBag.bagName}s, so ${semitotal}`);
			if (graph[nextBag.bagName] !== undefined){
				queue.push({quantity: nextBag.quantity*next.quantity, contains:graph[nextBag.bagName], name: nextBag.bagName});
			}
		}
		gauge(`after ${next.name} added ${semitotal}, ${queue.length} items in queue.`);
		total += semitotal;
		await step();
	}
	showAnswer(total);
}