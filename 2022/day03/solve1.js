async function solve1(input, step){
	let score = 0;
	for (const line of input.split("\n")){
		if (line === "") continue;

		let [set1, set2] = splitEvenly(line);

		const letter = Array.from(set_intersect(set1, set2))[0];
		assert(letter !== undefined, `${set1} and ${set2} have intersecting letter`);

		log(`${set1} and ${set2} have intersecting letter ${letter} worth ${scoreItem(letter)}`);

		score += scoreItem(letter);
		await step(1);
	}
	showAnswer(score);
}


function splitEvenly(line){
	const half = line.length / 2;
	return [line.slice(0, half), line.slice(half, line.length)];
}

function scoreItem(letter){
	if (letter === letter.toUpperCase())
		return letter.charCodeAt() - 64 + 26;
	else
		return letter.charCodeAt() - 96;
}