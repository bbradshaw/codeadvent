async function solve1(input, step){
	let [crateInput, moveInput] = input.split("\n\n", 2);
	let crates = parseCrates(crateInput);
	let moves = parseMoves(moveInput);

	for (let move of moves){
		apply_move1(crates, move);
		await step(1);
	}
	showAnswer(getTop(crates));
}

function parseCrates(input){
	let lines = input.split("\n").reverse();
	let nCrates = Math.ceil(lines[0].length / "[X] ".length);
	let crates = new Array(nCrates).fill(null).map(() => new Array());
	for (let line of lines){
		let craten = 0;
		for (let i = 1; i < line.length; i += 4){
			if (isLetter(line[i]))
				crates[craten].push(line[i])
			craten++;
		}
	}
	return crates;
}


function getTop(crates){
	return crates.map( crate => crate[crate.length - 1]).join("");
}

function apply_move1(crates, move){
	let [times, from, to] = move;
	let buf = [];

	for (let i = 0; i < times; i++)
		buf.push(crates[from-1].pop());
	buf.reverse();
	log(`moving ${buf.join('')} from ${from} to ${to}`);
	for (let i = 0; i < times; i++)
		crates[to-1].push(buf.pop())
}

function parseMoves(input){
	let moves = [];
	for (line of input.split("\n")){
		let rs = /move (\d+) from (\d+) to (\d+)/.exec(line);
		if (rs)
			moves.push([rs[1], rs[2], rs[3]].map(x => parseInt(x) ));
	}
	return moves;
}
const isLetter = (l) => (/[A-Z]/).test(l)