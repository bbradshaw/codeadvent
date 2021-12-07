async function solve1(input, step){
	let crabPos = input.split(',').map( n => parseInt(n));

	crabPos.sort( (a,b) => a - b);

	const medPoint = Math.floor(crabPos.length / 2);

	const median = crabPos[medPoint];

	log(`The median position is ${median}`);

	const total = sum(crabPos.map(p => Math.abs(p-median)));

	showAnswer(total);

}