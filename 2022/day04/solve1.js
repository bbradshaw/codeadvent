async function solve1(input, step) {
	let count = 0;
	for (const line of input.split('\n')) {

		let [seg1, seg2] = parseSegments(line);

		if (containedSeg(seg1, seg2) || containedSeg(seg2, seg1))
			count++;

		await step(1);
	}
	showAnswer(count);
}

function parseSegments(line) {
	let segs = [];
	for (const frag of line.split(",")) {
		let parts = frag.split("-").map(x => parseInt(x));
		segs.push([parts[0], parts[1]]);
	}
	return segs;
}

function containedSeg(seg1, seg2){
	return seg1[0] <= seg2[0] && seg1[1] >= seg2[1]
}