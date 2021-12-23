function create_state(input) {
	const lines = input.split("\n");
	let state = Array(19).fill('.');
	state[3] = lines[2][3];
	state[4] = lines[3][3];
	state[7] = lines[2][5];
	state[8] = lines[3][5];
	state[11] = lines[2][7];
	state[12] = lines[3][7];
	state[15] = lines[2][9];
	state[16] = lines[3][9];
	return state;
}
/*
#############
#012569adehi#
###3#7#b#f###
  #4#8#c#g#
  #########

WINNINGSTATE = ...AA..BB..CC..DD..
  */

const ABOVE_ROOM = [2, 6, 10, 14];
const TOP_ROOM = [3, 7, 11, 15];
const BOT_ROOM = [4, 8, 12, 16];

const LEFT_HALL = [0, 1];
const MID_HALL = [5, 9, 13];
const RIGHT_HALL = [17, 18];

const DEST_ROOM = {
	A: [3, 4],
	B: [7, 8],
	C: [11, 12],
	D: [15, 16]
}


const HALL_PATH = [...LEFT_HALL, ...MID_HALL, ...ABOVE_ROOM, ...RIGHT_HALL].sort((a, b) => a - b);

const print_state = (state) => {
	let buffer = [];
	for (let p of HALL_PATH) buffer.push(state[p]);
	buffer.push(`\n  ${state[3]} ${state[7]} ${state[11]} ${state[15]}`);
	buffer.push(`\n  ${state[4]} ${state[8]} ${state[12]} ${state[16]}`);
	return buffer.join("");
}

const is_occupied = c => c !== ".";

function get_movable(state) {
	let movable = [];
	for (let p of BOT_ROOM) {
		if (is_occupied(state[p - 1]))
			movable.push({ shr: state[p - 1], cur: p - 1, isin: 'room' });
		else {
			if (is_occupied(state[p]) && !DEST_ROOM[state[p]].includes(p))
				movable.push({ shr: state[p], cur: p, isin: 'room' });
		}
	}

	for (let p of [...LEFT_HALL, ...MID_HALL, ...RIGHT_HALL]) {
		movable.push({ shr: state[p], cur: p, isin: 'hall' });
	}

	return movable.filter(inf => is_occupied(inf.shr));
}

function* trace_path(from, to) {
	let cur = from;
	let additional_steps = [];
	let hall_target = to;

	if (BOT_ROOM.includes(from)) {
		yield TOP_ROOM[BOT_ROOM.indexOf(from)];
		yield ABOVE_ROOM[BOT_ROOM.indexOf(from)];
		cur = ABOVE_ROOM[BOT_ROOM.indexOf(from)];
	}
	else if (TOP_ROOM.includes(from)) {
		yield ABOVE_ROOM[TOP_ROOM.indexOf(from)];
		cur = ABOVE_ROOM[TOP_ROOM.indexOf(from)];
	}

	if (BOT_ROOM.includes(to)) {
		additional_steps = [TOP_ROOM[BOT_ROOM.indexOf(to)], to]
		hall_target = ABOVE_ROOM[BOT_ROOM.indexOf(to)];
	}
	else if (TOP_ROOM.includes(to)) {
		additional_steps = [to];
		hall_target = ABOVE_ROOM[TOP_ROOM.indexOf(to)];
	}
	let curIdx = HALL_PATH.indexOf(cur);
	while (cur != hall_target) {
		if (hall_target < cur)
			curIdx--;
		else
			curIdx++
		cur = HALL_PATH[curIdx];
		yield cur;
	}
	for (const step of additional_steps)
		yield step;

}

function is_blocked(state, from, to) {
	for (const pos of trace_path(from, to)) {
		if (is_occupied(state[pos]))
			return true;
	}
	return false;
}

function calc_cost(shr, from, to) {
	let steps = 0;
	for (const _pos of trace_path(from, to))
		steps++;
	return { A: 1, B: 10, C: 100, D: 1000 }[shr] * steps;
}

function get_options(state, moveable) {
	let dests = [];
	for (let p of BOT_ROOM) {
		if (!DEST_ROOM[moveable.shr].includes(p)) // can only move to room if right type
			continue;
		if (!is_occupied(state[p]))				  // can only move if room free
			dests.push({ dest: 'room', to: p });
		else if (!is_occupied(state[p - 1])) {	// otherwise look at top slot
			if ((DEST_ROOM[state[p]]).includes(p)) // and bot occupant matches
				dests.push({ dest: 'room', to: p - 1 });
		}
	}

	if (moveable.isin !== 'hall') {
		for (let hallpos of [...LEFT_HALL, ...MID_HALL, ...RIGHT_HALL])
			dests.push({ dest: 'hall', to: hallpos });
	}

	dests = dests.filter(d => !is_blocked(state, moveable.cur, d.to));
	return dests.map(d => Object.assign(d,
		{ cost: calc_cost(moveable.shr, moveable.cur, d.to) },
		moveable));
}

function apply_state(prev, chosen_move) {
	let state = prev.slice();
	state[chosen_move.cur] = ".";
	state[chosen_move.to] = chosen_move.shr;
	return state;
}

function next_moves(state) {
	let movables = get_movable(state);
	let nextmoves = [];
	for (const movable of movables) {
		for (let move of get_options(state, movable)) {
			Object.assign(move, { score: score_state(apply_state(state, move)) });
			nextmoves.push(move);
		}
	}
	return nextmoves;
}

const score_state = (state) => {
	let score = 0;
	for (const [shr, dests] of Object.entries(DEST_ROOM)) {
		if (state[dests[0]] === shr)
			score++;
		if (state[dests[1]] === shr)
			score++
	}
	return score;
}

async function solve1(input, step) {
	let current = { state: create_state(input), energy: 0, history: [] };

	let winner = Infinity;
	let winning_path = null;
	let bestscore = 0;
	let seen_state = new Map();

	let stack = [current];
	let turns = 0;
	while (stack.length) {
		current = stack.pop();
		let candidates = next_moves(current.state).sort((m1, m2) => m1.score - m2.score);
		gauge(`${candidates.length} moves from current considered state, ${stack.length} moves to evaluate`);
		for (const candidate of candidates) {
			let energy = current.energy + candidate.cost;
			let newState = apply_state(current.state, candidate);

			if (energy > winner)
				continue;
			if (candidate.score > bestscore) {
				log(`new best score ${candidate.score}`);
				bestscore = candidate.score;
			}
			if (candidate.score === 8) {
				log(`found a solution with cost ${energy}!`);
				winner = Math.min(energy, winner);
				winning_path = [newState.join(""), current.state.join(""), ...current.history].map(p => print_state(p));
				continue;
			}
			if (seen_state.get(newState.join("")) <= energy)
				continue;
			seen_state.set(newState.join(""), energy);
			stack.push({ state: apply_state(current.state, candidate), energy, history: [current.state.join(""), ...current.history] });
		}
		if (turns++ % 1000 === 0) await step(null)
	}
	log(`winning path is <pre>${winning_path.join("\n\n")}</pre>`);
	showAnswer(winner);
}

function test() {
	let state = create_state(`#############
#...B.......#
###B#C#.#D###
  #A#D#C#A#
  #########`);
	state[5] = 'B';

	assert(!is_blocked(state, 3, 0));
	assert(is_blocked(state, 3, 18));

	let next_move = get_movable(state).find(m => m.shr === 'C' && m.cur == 7)
	assert(next_move);
	get_options(state, next_move).some(m => m.to === 11);
	assert(calc_cost('C', 7, 11) === 400);

	state[9] = 'C';
	assert(is_blocked(state, 11, 7));

	console.log('unit tests pass');
}

test()