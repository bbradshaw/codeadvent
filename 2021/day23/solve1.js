class ScudState {
	ROOM_CONNECTIONS = [2, 4, 6, 8];

	constructor(rooms, hall) {
		this.room = rooms;
		this.hall = Array.from(hall);
	}

	apply_move(move) {
		let next = new ScudState(this.room.map(r => r.slice()), this.hall.slice());
		const [fRoom, fOffset] = move.from;
		const [tRoom, tOffset] = move.to;

		if (fRoom === 'H')
			next.hall[fOffset] = ".";
		else
			next.room[fRoom][fOffset] = ".";

		if (tRoom === 'H')
			next.hall[tOffset] = move.scud;
		else
			next.room[tRoom][tOffset] = move.scud;
		return next;
	}

	toString() {
		let buffer = [];
		for (let p in this.hall) buffer.push(this.hall[p]);
		for (let c in this.room[0])
			buffer.push(`\n  ${this.room[0][c]} ${this.room[1][c]} ${this.room[2][c]} ${this.room[3][c]}`);
		return buffer.join("");
	}

	is_occupied([room, offset]) {
		if (room === "H")
			return this.hall[offset] !== ".";
		else
			return this.room[room][offset] !== ".";
	}

	get_mobile() {
		let mobile = [];
		for (let roomN = 0; roomN < this.room.length; roomN++) {
			let scud;
			for (let offset = 0; offset < this.room[roomN].length; offset++) {
				if (this.is_occupied([roomN, offset])) {
					scud = { scud: this.room[roomN][offset], from: [roomN, offset] };
					break;
				}
			}
			if (scud) {
				if (this.room_match(roomN, scud)) {
					for (let i = scud.from[1]; i < this.room[roomN].length; i++)
						if (!this.room_match(roomN, this.room[roomN][i])) {
							mobile.push(scud);
							break;
						}
				}
				else
					mobile.push(scud);
			}
		}

		for (let h = 0; h < this.hall.length; h++) {
			if (this.is_occupied(["H", h]))
				mobile.push({ scud: this.hall[h], from: ["H", h] });
		}

		return mobile;
	}

	trace_path(from, to) {
		let path = [];
		const path_push = (a) => {
			path.push(a);
			if (path.length > 15) debugger;
		}
		const [fRoom, fOffset] = from;
		const [tRoom, tOffset] = to;
		let cur = fOffset;
		let dest = tOffset;

		if (fRoom === tRoom)
			throw new Error(`illegal move from ${fRoom} to ${tRoom}`);

		if (fRoom !== "H") {
			for (let i = fOffset - 1; i >= 0; i--) {
				path_push([fRoom, i]);
			}
			cur = this.ROOM_CONNECTIONS[fRoom];
			path_push(["H", cur]);
		}

		if (tRoom === "H" && this.ROOM_CONNECTIONS.includes(tOffset))
			throw new Error(`illegal move to hall ${tOffset}`);

		if (tRoom !== "H") {
			dest = this.ROOM_CONNECTIONS[tRoom];
		}
		let dir = cur > dest ? -1 : 1;
		while (cur != dest) {
			cur += dir;
			path_push(["H", cur]);
		}
		if (tRoom !== "H") {
			for (let i = 0; i <= tOffset; i++)
				path_push([tRoom, i]);
		}
		return path;
	}

	room_match(room, scud) {
		let r = { A: 0, B: 1, C: 2, D: 3 }[scud];
		return room === r;
	}
	can_move_to_room(room, scud) {

		if (!this.room_match(room, scud))
			return false;

		return this.room[room].every(spot => spot == scud || spot == ".");
	}

	get_destinations(mobile) {
		let dests = [];

		for (let r = 0; r < this.room.length; r++) {
			if (mobile.from[0] === r) continue;
			let target;
			for (let i = this.room[r].length; i >= 0; i--) {
				if (!this.is_occupied([r, i]) && this.can_move_to_room(r, mobile.scud)) {
					target = [r, i];
					break;
				}
			}
			if (target)
				dests.push(target);
		}

		if (mobile.from[0] !== 'H') {
			for (let h = 0; h < this.hall.length; h++)
				if (!this.ROOM_CONNECTIONS.includes(h))
					dests.push(['H', h]);
		}

		dests = dests.filter(d => !this.is_blocked(mobile.from, d));
		return dests.map(d => ({ ...mobile, to: d, cost: this.calc_cost(mobile.scud, mobile.from, d) }));
	}

	is_blocked(from, to) {
		for (let space of this.trace_path(from, to)) {
			if (this.is_occupied(space))
				return true;
		}
		return false;
	}

	get score() {
		let score = 0;
		let matching = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' };
		for (let r = 0; r < this.room.length; r++) {
			this.room[r].filter(spot => spot === matching[r]).forEach(() => score++);
		}
		return score;
	}

	next_options() {
		let options = [];
		for (const mobile of this.get_mobile())
			for (let move of this.get_destinations(mobile)) {
				options.push(move);
			}
		return options.map(move => ({ move, nextstate: this.apply_move(move) }));
	}

	calc_cost(scud, from, to) {
		let steps = 0;

		for (let _p of this.trace_path(from, to))
			steps++;

		return { A: 1, B: 10, C: 100, D: 1000 }[scud] * steps;
	}
}

function parseScudState1(input) {
	const lines = input.split("\n");
	let hall = /#([^#]+)#/.exec(lines[1])[1];
	let top_room = /[ #]+([ABCD.])#([ABCD.])#([ABCD.])#([ABCD.])[ #]+/.exec(lines[2]).slice(1, 5);
	let bot_room = /[ #]+([ABCD.])#([ABCD.])#([ABCD.])#([ABCD.])[ #]+/.exec(lines[3]).slice(1, 5);
	let rooms = top_room.map((k, i) => [k, bot_room[i]]);
	let state = new ScudState(rooms, hall);
	return state;
}

async function solve1(input, step) {
	let current = { state: parseScudState1(input), energy: 0, history: [] };

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
			if (candidate.nextstate.score === 8) {
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

function test() {
	let state = parseScudState1(`#############
#...B.......#
###B#C#.#D###
  #A#D#C#A#
  #########`);

	assert(!state.is_blocked([0, 0], ["H", 0]))
	assert(state.is_blocked([0, 0], ["H", 10]))

	let next_move = state.get_mobile().find(m => m.scud == 'C' && m.from[0] == 1 && m.from[1] == 0);
	assert(next_move);
	assert(state.get_destinations(next_move).some(m => m.to[0] == "H" && m.to[1] == 10));
	assert(state.get_mobile().length === 5)

	assert(state.calc_cost("C", [1, 0], ["H", 7]) === 400);
	console.log('unit tests pass');

	state = parseScudState1(`#############
	#...A.......#
	###.#B#C#D###
	  #A#B#C#D#
	  #########`);

	next_move = state.get_mobile().find(m => m.scud === 'A' && m.from[0] === 'H');
	assert(next_move);
	assert(state.get_destinations(next_move).some(m => m.to[0] === 0 && m.to[1] === 0));
	assert(state.score === 7);

}

test()