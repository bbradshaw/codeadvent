function union(setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function solve1(input, step){
    let groups = [];
    let persons = [];
    for (const line of input.split("\n")){
        if (line.length === 0){
            groups.push(persons);
            persons = [];
        } else {
            persons.push(new Set(line.split('')));
			gauge(`parsing ${Array.from(persons)}`);
			await step();
		}
	}
    groups.push(persons);
    let answer = 0;
    for (const group of groups){
        if (!group.length) continue;
        let yeses = group.reduce((acc, p) => union(acc,p));
        answer += yeses.size;
    }
   showAnswer(answer);
}