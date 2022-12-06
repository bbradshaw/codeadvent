async function solve2(input, step){
	let [crateInput, moveInput] = input.split("\n\n", 2);
	let crates = parseCrates(crateInput);
	let moves = parseMoves(moveInput);

	for (let move of moves){
		apply_move2(crates, move);
		await step(1);
	}
	showAnswer(getTop(crates));
}

function apply_move2(crates, move){
	let [times, from, to] = move;
	let buf = [];
	for (let i = 0; i < times; i++)
		buf.push(crates[from-1].pop());
	log(`moving ${buf.join('')} from ${from} to ${to}`);
	
	for (let i = 0; i < times; i++)
		crates[to-1].push(buf.pop())
}