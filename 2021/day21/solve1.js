function get_die(){
	let pos = 1;

	return function roll(){
		let total;
		if (pos < 98)
			total = pos*3 + 3;
		else
			switch (pos){
				case 98: 
					total = 297; break;
				case 99:
					total = 200; break;
				case 100:
					total = 103; break;
			}
		pos = ((pos + 2) % 100) + 1;
		return total;
	}

}

async function solve1(input, step){
	let lines = input.split("\n");
	let player = {};
	player[2] = parseInt(lines.pop().split(": ")[1]);
	player[1] = parseInt(lines.pop().split(": ")[1]);

	let scores = new Map();
	scores.set(1, 0);
	scores.set(2, 0);
	let p = 1;
	let roll = get_die();
	let turns = 0;
	while (scores.get(1) < 1000 && scores.get(2) < 1000){
		let nextSpace = (player[p] + roll() - 1) % 10 + 1;
		player[p] = nextSpace;
		turns++;
		p = p % 2 + 1;
		scores.set(p, scores.get(p) + nextSpace);
	}
	log(`${turns*3} die rolls, losing player ${scores.get(p % 2 + 1)}, winning player ${scores.get(p)}`);

	showAnswer(turns*3*scores.get(p % 2 + 1));

}