function solve_packet(p){
	if (p.typeId === 4)
		return p.data;
	let fn;
	switch (p.typeId) {
		case 0:
			fn = sum; break;
		case 1:
			fn = arr => arr.reduce((a, v) => a * v, 1); break;
		case 2:
			fn = arr => Math.min(...arr); break;
		case 3:
			fn = arr => Math.max(...arr); break;
		case 5:
			fn = arr => arr[0] > arr[1]; break;
		case 6:
			fn = arr => arr[0] < arr[1]; break;
		case 7:
			fn = arr => arr[0] === arr[1]; break;
	}
	return fn(p.subpackets.map(sp => solve_packet(sp)));
}

async function solve2(input, step) {

	let bs = new Bitstream(input);
	const top = readPacket(bs);

	let answer = solve_packet(top);
	showAnswer(answer);
}