async function solve2(input, step) {
	let ranges = [];
	for (const line of input.trim().split("\n")) {
		if (line === "") {
			break;
		}
		const [start, end] = line.split("-").map(x => parseInt(x));
		ranges.push({ start, end, nullified: false });
	}
	let visual = new Visualizer(ranges);
	let fresh = 0;
	for (let i = 0; i < ranges.length - 1; i++) {
		for (let j = i + 1; j < ranges.length; j++) {
			if (i === j) {
				continue;
			}
			const rangeA = ranges[i];
			const rangeB = ranges[j];
			visual.start_comparison(i, j);
			if (rangeA.nullified || rangeB.nullified) {
				//log(`Skipping nullified range ${i} or ${j}`);
				continue;
			}
			//first case: A and B disjoint
			if (rangeA.end < rangeB.start || rangeB.end < rangeA.start) {
				//log(`Ranges ${i} and ${j} are disjoint`);
				continue;
			}
			//second case: A is superset of B
			if (rangeA.start >= rangeB.start && rangeA.end <= rangeB.end) {
				//log(`Range ${i} is superset of ${j}`);
				rangeA.nullified = true;
				break;
			}
			//third case: B is superset of A
			if (rangeB.start >= rangeA.start && rangeB.end <= rangeA.end) {
				//log(`Range ${j} is superset of ${i}`);
				rangeB.nullified = true;
				continue;
			}
			//fourth case: A contains B start
			if (rangeA.start <= rangeB.start && rangeA.end >= rangeB.start) {
				//log(`Range ${i} contains start of ${j}`);
				rangeB.start = rangeA.end + 1;
				continue;
			}
			//fifth case: A contains B end
			if (rangeA.start <= rangeB.end && rangeA.end >= rangeB.end) {
				//log(`Range ${i} contains end of ${j}`);
				rangeB.end = rangeA.start - 1;
				continue;
			}
		}
		await step(1, ranges.length * ranges.length - 1);
	}
	for (const range of ranges) {
		if (!range.nullified) {
			fresh += range.end - range.start + 1;
		}
	}
	showAnswer(fresh);
}

class Visualizer {
	constructor(ranges) {
		this.ranges = ranges;
		this.rangeA = null;
		this.rangeB = null;

		this.canvas = document.getElementById('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.style.display = 'block';
	}

	start_comparison(rangeA, rangeB) {
		this.rangeA = rangeA;
		this.rangeB = rangeB;
		const rangeAData = this.ranges[rangeA];
		const rangeBData = this.ranges[rangeB];
		const minStart = Math.min(rangeAData.start, rangeBData.start);
		let scale = 900 / ( Math.max(rangeAData.end, rangeBData.end) - minStart + 1);
		const rangeAX = (rangeAData.start - minStart) * scale + 10;
		const rangeBX = (rangeBData.start - minStart) * scale + 10;
		let rangeARect = [rangeAX, 200, (rangeAData.end - rangeAData.start + 1) * scale, 50];
		let rangeBRect = [rangeBX, 300, (rangeBData.end - rangeBData.start + 1) * scale, 50];
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.strokeRect(...rangeARect);
		this.context.strokeRect(...rangeBRect);
		this.context.fillText(`${rangeAData.start} - ${rangeAData.end}`, rangeAX + 5, 210);
		this.context.fillText(`${rangeBData.start} - ${rangeBData.end}`, rangeBX + 5, 310);
	}
}