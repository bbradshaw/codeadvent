async function solve2(input, step){
	let packets = [[2], [6]];
	for (const line of input.split('\n')){
		if (line === '')
			continue;
		let packet = JSON.parse(line);
		packets.push(packet);
	}

	packets.sort( (a, b) => {
		switch (_compare(a, b)){
			case TRIBOOL.T:	return -1;
			case TRIBOOL.F: return 1;
			case TRIBOOL.I: return 0;
		}
	});

	let idx1 = packets.findIndex( e => e.length == 1 && e[0] == 2) + 1;
	let idx2 = packets.findIndex( e => e.length == 1 && e[0] == 6) + 1;
	showAnswer(idx1 * idx2);
}