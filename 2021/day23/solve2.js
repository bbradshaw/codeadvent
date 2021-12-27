
function parseScudState2(input) {
	const lines = input.split("\n");
	const linereader = /[ #]+([ABCD.])#([ABCD.])#([ABCD.])#([ABCD.])[ #]+/;
	let hall = /#([^#]+)#/.exec(lines[1])[1];
	let row = [];
	row.push(linereader.exec(lines[2]).slice(1, 5));
	row.push(linereader.exec("	#D#C#B#A#").slice(1, 5));
	row.push(linereader.exec("	#D#B#A#C#").slice(1, 5));
	row.push(linereader.exec(lines[3]).slice(1, 5));
	let rooms = row[0].map((_, i) => {
		let zip = [];
		row.forEach(r => zip.push(r[i]));
		return zip;
	});
	let state = new ScudState(rooms, hall);
	return state;
}

async function solve2(input, step) {
	let current = { state: parseScudState2(input), energy: 0, history: [] };

	let winner = Infinity;
	let winning_path = null;
	let bestscore = 0;
	let seen_state = new Map();

	let stack = [current];
	let turns = 0;
	while (stack.length) {
		current = stack.pop();
		let candidates = current.state.next_options().sort((m1, m2) => m1.nextstate.score - m2.nextstate.score);
		gauge(`${candidates.length} moves from current considered state, ${stack.length} moves to evaluate`);
		for (const candidate of candidates) {
			let energy = current.energy + candidate.move.cost;

			if (energy > winner)
				continue;
			if (candidate.nextstate.score > bestscore) {
				log(`new best score ${candidate.nextstate.score}`);
				bestscore = candidate.nextstate.score;
			}
			if (candidate.nextstate.score === 16) {
				log(`found a solution with cost ${energy}!`);
				winner = Math.min(energy, winner);
				winning_path = [candidate.nextstate.toString(), ...current.history];
				continue;
			}
			if (seen_state.get(candidate.nextstate.toString()) <= energy)
				continue;
			seen_state.set(candidate.nextstate.toString(), energy);
			stack.push({ state: candidate.nextstate, energy, history: [candidate.nextstate.toString(), ...current.history] });
		}
		if (turns++ % 5000 === 0) await step(null);

	}
	log(`winning path is <pre>${winning_path.join("\n\n")}</pre>`);
	showAnswer(winner);
}