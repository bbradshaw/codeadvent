async function solve1(input, step) {

	let cave = Grid.from_input(input).map((x, y, val) => parseInt(val));

	const start = [0, 0];
	const finish = [cave.width - 1, cave.height - 1];
	let step_i = 0;


	const path = await Grid.a_star(start, finish,
		(_from, [x, y]) => cave.at(x, y),
		(a, b) => Navigation.manhattan(a, b),
		([x, y]) => cave.neighbors(x, y, false),
		async (coord) => { if (step_i++ % 100 === 0) {
			gauge(`current looking at ${coord.join(",")}`);
			await step(null) }});

	path.shift();
	log(JSON.stringify(path));
	showAnswer(sum(path.map(([x, y]) => cave.at(x, y))));

}