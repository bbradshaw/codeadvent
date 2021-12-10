
async function solve1(input, step) {

	function computeSegmentMap(input_str){
		let mapping = new Map();
		for (const led of input_str.split(" ")){
			let segments = led.split("").sort().join("");
			switch (segments.length){
				case 2:
					mapping.set(segments, "1");
					break;
				case 3:
					mapping.set(segments, "7");
					break;
				case 4:
					mapping.set(segments, "4");
					break;
				case 7:
					mapping.set(segments, "8");
					break;
			};
		}
		return {
			translate: function(input_str){
				let translated = [];
				for (const led of input_str.split(" ")){
					let segments = led.split("").sort().join("");
					let result = mapping.get(segments);
					if (result){
						translated.push(result);
					}
					else{
						translated.push("?");
					}
				}
			return translated;
			}
		}
	}

	const displays = input.split("\n");
	let total = 0;
	for (const line of displays) {
		const [_, output] = line.split(" | ");
		let segmentMap = computeSegmentMap(output);
		let transl_out = segmentMap.translate(output);
		total += sum(transl_out.map( c => ['1','4','7','8'].includes(c) ? 1 : 0));

		await step(1);
	}

	showAnswer(total);

}