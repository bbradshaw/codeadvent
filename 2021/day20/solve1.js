function surrounding(x, y) {
	let area = [];
	for (const [dx, dy] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]])
		area.push([dx + x, dy + y]);
	return area;
}
const pos = (x, y) => `${x},${y}`;

function getOffset(x, y, pixelMap, assumed) {
	let offset = 0;
	for (let [px, py] of surrounding(x, y)) {
		let rs = pixelMap.get(pos(px, py));
		if (rs == undefined) rs = assumed;
		offset = offset | rs;
		offset <<= 1;
	}
	return offset >> 1;
}

async function solve(input, step, applied) {
	let lines = input.split("\n");

	const algo = lines.shift();
	lines.shift();
	lines.pop();

	let current = new Map();
	let y = 0;
	for (const line of lines) {
		Array.from(line).forEach((c, x) => c === "#" ? current.set(pos(x, y), 1) : void 0);
		y++;
	}

	for (let i = 1; i < applied + 1; i++) {
		let next = new Map();
		buffer = [];
		for (y = -1 - i; y < lines.length + i + 1; y++) {
			for (let x = -1 - i; x < lines[0].length + i + 1; x++) {
				let offset = getOffset(x, y, current, i % 2 === 0);
				algo[offset] === "#" ? next.set(pos(x, y), 1) : next.set(pos(x,y), 0);
				buffer.push(algo[offset]);
			}
			buffer.push("\n");
		}
		current = next;
		log("<pre>" + buffer.join("") + "</pre>");
		await step(1, applied)
	}

	showAnswer(sum(Array.from(current.values())))
}

async function solve1(input, step){
	await solve(input, step, 2);
}
