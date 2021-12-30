
const pos = (x, y, z) => `${x},${y},${z}`;

const transform = (raw) => {
	let m = /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(raw);
	return {
		state: m[1],
		x1: parseInt(m[2]), x2: parseInt(m[3]),
		y1: parseInt(m[4]), y2: parseInt(m[5]),
		z1: parseInt(m[6]), z2: parseInt(m[7])
	}
};

const region = (ins) => {
	for (const dim of ['x', 'y', 'z'])
		for (const m of ['1', '2']){
			if (ins[dim+m] > 50)
				return false;
			if (ins[dim+m] < -50)
				return false;
		}
	return true;
}

async function solve1(input, step) {
	let cubes = new Map();

	let instructions = input.split("\n").map(transform).filter(region);

	for (let instruction of instructions) {
		for (let x = instruction.x1; x <= instruction.x2; x++)
			for (let y = instruction.y1; y <= instruction.y2; y++)
				for (let z = instruction.z1; z <= instruction.z2; z++)
					cubes.set(pos(x, y, z), instruction.state);
		await step(1);
	}

	showAnswer(sum([...cubes.values()].map(v => v === 'on' ? 1 : 0)));

}