async function solve2(input, step) {
	let little_cave = Grid.from_input(input).map((x, y, val) => parseInt(val));
	let bigArray = new Array(5 * little_cave.height).fill(0).map(() => new Array(5 * little_cave.width));
	little_cave.map((x, y, val) => {
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				bigArray[i*little_cave.height + y][j*little_cave.width + x] = (val + i + j - 1) % 9 + 1;
			}
		}
	});

	let cave = new Grid(bigArray);

	await solve(cave, step);

}