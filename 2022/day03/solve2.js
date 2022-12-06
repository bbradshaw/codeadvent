async function solve2(input, step){
	let score = 0; 

	for (const [line1, line2, line3] of grouped(input)){
		const letter = Array.from(set_intersect(line1, set_intersect(line2, line3)))[0];
		assert(letter !== undefined, `${line1} and ${line2} and ${line3} have no intersecting letter`);
		score += scoreItem(letter);
		await step(3);
	}
	showAnswer(score);
}

function* grouped(input){
	let buf = [];

	for (const line of input.split("\n")){
		if (line === "") continue;

		buf.push(line);
		if (buf.length === 3){
			yield buf;
			buf = [];
	}
	}
}	