const MOVES = {
	ROCK: "🗿",
	PAPER: "📃",
	SCISSORS: "✂️"
};

async function solve1(input, step) {
	let score = 0;
	for (const line of input.split("\n")){
		let move = parseLine(line);
		score += scoreMove(move);

		gauge(`${move.me} vs. ${move.opp}`);

		await step(1);
	}
	showAnswer(score);
}

function parseLine(line){
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
				move.me = MOVES.ROCK; break;
			case 'Y':
				move.me = MOVES.PAPER; break;
			case 'Z':
				move.me = MOVES.SCISSORS; break;
		}
	}
	if (move.opp === null || move.me === null)
		throw new Error(`Invalid move for line '${line}'`);
	return move;
}

function scoreMove(move){
	let score = 0;
	switch (move.me){
		case MOVES.ROCK:
			score = 1 + {[MOVES.ROCK]: 3, [MOVES.PAPER]: 0, [MOVES.SCISSORS]: 6}[move.opp]; break;
		case MOVES.PAPER:
			score = 2 + {[MOVES.ROCK]: 6, [MOVES.PAPER]: 3, [MOVES.SCISSORS]: 0}[move.opp]; break;
		case MOVES.SCISSORS:
			score = 3 + {[MOVES.ROCK]: 0, [MOVES.PAPER]: 6, [MOVES.SCISSORS]: 3}[move.opp]; break;
	}
	return score;
}