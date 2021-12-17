function score(crabPos, from){
	return sum(crabPos.map(p => triangular_n(Math.abs(p-from))));
}

async function solve2(input, step){
	let crabPos = input.split(',').map( n => parseInt(n));

	crabPos.sort( (a,b) => a - b);

	const avg = Math.floor(sum(crabPos) / crabPos.length);

	log(`The average position is ${avg}`);

	let currentGuess = avg;
	let move;

	const center = score(crabPos, currentGuess);
	const left = score(crabPos, currentGuess - 1);
	const right = score(crabPos, currentGuess + 1);

	if (center < right && center < left){
		log("it was the average");
		showAnswer(center);
		return;
	}
	else if (left < right) {
		move = -1;
	}
	else if (right < left){
		move = 1
	}
	else{
		log(`Don't know which way to go!!!`);
		return;
	}

	let lastScore = score(crabPos, currentGuess);

	for (let i = 1; i < 100; i++){
		log(`guess of ${currentGuess} gives ${lastScore}`);
		currentGuess += move;

		thisScore = score(crabPos, currentGuess);

		if (thisScore > lastScore){
			currentGuess -= move;
			showAnswer(lastScore);
			return;
		}
		lastScore = thisScore;
	}
	log("Failed to find!");

}