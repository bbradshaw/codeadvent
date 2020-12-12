function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

async function solve2(input, step){
    let groups = [];
    let persons = [];
    for (const line of input.split("\n")){
        if (line.length === 0){
			groups.push(persons);
			gauge(`parsing ${persons.map(s => Array.from(s))}`);
            await step();
            persons = [];
        } else {
            persons.push(new Set(line.split('')));
        }
    }
    groups.push(persons);
    let answer = 0;
    for (const group of groups){
        if (!group.length) continue;
		let yeses = group.reduce((acc, p) => intersection(acc,p));
		gauge(`intersection of ${group.map(s=>Array.from(s))} = ${Array.from(yeses)}`);
		await step();
		answer += yeses.size;
    }
    showAnswer(answer);
}