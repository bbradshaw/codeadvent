
async function solve2(input, step) {
	let score = 0;
	for (const line of input.split("\n")){
		let move = parseLine2(line);
		score += scoreMove(move);

		gauge(`${move.me} vs. ${move.opp}`);

		await step(1);
	}
	showAnswer(score);
}

function chooseRPS(resultRock, resultPaper, resultScissors, choice){
	return {[MOVES.ROCK]: resultRock, 
		[MOVES.PAPER]: resultPaper, 
		[MOVES.SCISSORS]: resultScissors}[choice];
}

function parseLine2(line){
	let move = { me: null, opp: null }
	for (let c of line.split('')){
		switch (c){
			case 'A':
				move.opp = MOVES.ROCK; break;
			case 'B':
				move.opp = MOVES.PAPER; break;
			case 'C':
				move.opp = MOVES.SCISSORS; break;
			case 'X':
				move.me = chooseRPS(MOVES.SCISSORS, MOVES.ROCK, MOVES.PAPER, move.opp); break
			case 'Y':
				move.me = chooseRPS(MOVES.ROCK, MOVES.PAPER, MOVES.SCISSORS, move.opp); break;
			case 'Z':
				move.me = chooseRPS(MOVES.PAPER, MOVES.SCISSORS, MOVES.ROCK, move.opp); break;
		}
	}
	if (move.opp === null || move.me === null)
		throw new Error(`Invalid move for line '${line}'`);
	return move;
}