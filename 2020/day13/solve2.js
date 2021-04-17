async function solve2(input, step) {
	const [_, bus_input, _start] = input.split("\n");
	let requirements = [];
	const buses = bus_input.split(',');
	const first = parseInt(buses[0]);

	for (let i = 1; i < buses.length; i++) {
		if (buses[i] === 'x') continue;
		requirements.push({ n: parseInt(buses[i]), offset: i });
	}
	let N = requirements.reduce((acc, r) => n*acc, 1);
	


	showAnswer(ts);
}