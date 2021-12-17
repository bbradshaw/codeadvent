async function solve(cave, step) {

	const start = [0, 0];
	const finish = [cave.width - 1, cave.height - 1];
	let step_i = 0;
	const stepper_fn = async (coord) => { if (step_i++ % 1000 === 0) {
		gauge(`current looking at ${coord.join(",")}`);
		await step(null) }};

	const path = await Grid.a_star(start, finish,
		(_from, [x, y]) => cave.at(x, y),
		(a, b) => Navigation.manhattan(a, b),
		([x, y]) => cave.neighbors(x, y, false),
		stepper_fn);

	path.shift();
	showAnswer(sum(path.map(([x, y]) => cave.at(x, y))));

}

async function solve1(input, step){
	
	let cave = Grid.from_input(input).map((x, y, val) => parseInt(val));
	await solve(cave, step);
}