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

	const start = [0, 0];
	const finish = [cave.width - 1, cave.height - 1];
	let step_i = 0;


	const path = await Grid.a_star(start, finish,
		(_from, [x, y]) => cave.at(x, y),
		(a, b) => Navigation.manhattan(a, b),
		([x, y]) => cave.neighbors(x, y, false));

	path.shift();
	log(JSON.stringify(path));
	showAnswer(sum(path.map(([x, y]) => cave.at(x, y))));

}