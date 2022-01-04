class Vec3D {
	constructor(x, y, z) {
		Object.assign(this, { x, y, z });
	}

	transformBy(rotateMatrix) {
		let x, y, z;
		x = this.x * rotateMatrix[0][0] + this.y * rotateMatrix[0][1] + this.z * rotateMatrix[0][2];
		y = this.x * rotateMatrix[1][0] + this.y * rotateMatrix[1][1] + this.z * rotateMatrix[1][2];
		z = this.x * rotateMatrix[2][0] + this.y * rotateMatrix[2][1] + this.z * rotateMatrix[2][2];
		return new Vec3D(x, y, z);
	}

	sub(other) {
		let x, y, z;
		x = this.x - other.x;
		y = this.y - other.y;
		z = this.z - other.z;
		return new Vec3D(x, y, z);
	}

	add(other) {
		return new Vec3D(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	equals(other) {
		return this.x === other.x && this.y === other.y && this.z === other.z;
	}

	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}

	static parse(s) {
		let m = /\(([^,]+),([^,]+),([^,]+)\)/.exec(s);
		return new Vec3D(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
	}
}

function getAllRotations() {
	return [[[1, 0, 0], [0, 1, 0], [0, 0, 1]],
	[[1, 0, 0], [0, 0, 1], [0, -1, 0]],
	[[1, 0, 0], [0, -1, 0], [0, 0, -1]],
	[[1, 0, 0], [0, 0, -1], [0, 1, 0]],
	[[0, 0, -1], [0, 1, 0], [1, 0, 0]],
	[[0, 0, -1], [1, 0, 0], [0, -1, 0]],
	[[0, 0, -1], [0, -1, 0], [-1, 0, 0]],
	[[0, 0, -1], [-1, 0, 0], [0, 1, 0]],
	[[-1, 0, 0], [0, 1, 0], [0, 0, -1]],
	[[-1, 0, 0], [0, 0, -1], [0, -1, 0]],
	[[-1, 0, 0], [0, -1, 0], [0, 0, 1]],
	[[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
	[[0, 0, 1], [0, 1, 0], [-1, 0, 0]],
	[[0, 0, 1], [-1, 0, 0], [0, -1, 0]],
	[[0, 0, 1], [0, -1, 0], [1, 0, 0]],
	[[0, 0, 1], [1, 0, 0], [0, 1, 0]],
	[[0, 1, 0], [-1, 0, 0], [0, 0, 1]],
	[[0, 1, 0], [0, 0, 1], [1, 0, 0]],
	[[0, 1, 0], [1, 0, 0], [0, 0, -1]],
	[[0, 1, 0], [0, 0, -1], [-1, 0, 0]],
	[[0, -1, 0], [1, 0, 0], [0, 0, 1]],
	[[0, -1, 0], [0, 0, 1], [-1, 0, 0]],
	[[0, -1, 0], [-1, 0, 0], [0, 0, -1]],
	[[0, -1, 0], [0, 0, -1], [1, 0, 0]]];
}

function manhattan3d(a, b) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

function common_points(s1, s2, scan1, scan2) {
	let uniq_s1 = new Set(s1.map(p => p.toString()));
	for (rotation of getAllRotations()) {
		let new_s2 = s2.map(v => v.transformBy(rotation));

		for (let p1 of s1) {
			for (let p2 of new_s2) {
				if (p1.equals(p2)) continue;
				dist = p1.sub(p2);
				let translated_s2 = new_s2.map(p => p.add(dist));
				let unique_tr_s2 = new Set(translated_s2.map(p => p.toString()));
				if (set_intersect(unique_tr_s2, uniq_s1).size >= 12) {
					log(`scanners ${scan1} and ${scan2} match: distance ${dist} rotation ${JSON.stringify(rotation)}`);
					return [translated_s2, dist];
				}
			}
		}
	}
	return [null, null];
}

async function solve1(input, step) {

	let scanners = [];
	let scanner_i = 0;
	distances = [new Vec3D(0, 0, 0)];
	let unknown_scanners = new Set();
	for (const line of input.split("\n")) {
		if (line === "") continue;
		let m = /--- scanner (\d+) ---/.exec(line);
		if (m !== null) {
			scanner_i = parseInt(m[1]);
			scanners[scanner_i] = [];
			unknown_scanners.add(scanner_i);
			continue;
		}
		let coords = line.split(",").map(i => parseInt(i));
		scanners[scanner_i].push(new Vec3D(...coords));
	}

	let matched = { 0: scanners[0] };

	lastSize = unknown_scanners.size;
	while (unknown_scanners.size > 0) {

		for (let i = 0; i < scanners.length; i++) {
			if (!unknown_scanners.has(i) || !matched.hasOwnProperty(i))
				continue;

			for (let j = 0; j < scanners.length; j++) {
				if (matched.hasOwnProperty(j) || i === j)
					continue;
				log(`checking ${i} against ${j}`);
				await step(null);
				let [common, dist] = common_points(matched[i], scanners[j], i, j);

				if (common !== null) {
					matched[j] = common;
					distances.push(dist);
				}
			}

			unknown_scanners.delete(i);
		}
		if (unknown_scanners.size === lastSize){
			showAnswer(":(");
			break;
		}
		lastSize = unknown_scanners.size;
	}
	let all_points = new Set(Object.values(matched).flat().map(v => v.toString()))
	showAnswer(all_points.size);

}