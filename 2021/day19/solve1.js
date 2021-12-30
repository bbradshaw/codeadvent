const JS = JSON.stringify;

class BeaconMatcher {
	constructor() {
		this.transformationMatrices = new Map();
		this.beacons = new Map();
		this.deltas = new Map();
	}

	setTransformMatrix(scanner_id, matrix) {
		this.transformationMatrices.set(scanner_id, matrix);
	}

	add_beacons(scanner_id, beacons) {
		const scanner_matrix = this.transformationMatrices.get(scanner_id);

		let i = this.beacons.size;
		for (let beacon of beacons) {
			for (const knownBeaconIdx of Array.from(this.beacons.keys())) {
				const knownBeacon = this.beacons.get(knownBeaconIdx);
				beacon = beacon.transform(scanner_matrix);
				this.deltas.set(beacon.sub(knownBeacon).s, [i, knownBeaconIdx]);
				i++;
				this.beacons.set(i, beacon);
			}
		}
	}

	find_matching_delta(delta) {
		return this.deltas.get(delta.s);
	}
}

class Vec3D {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	transform(tm) {
		let x, y, z;
		x = this.x * tm[0][0] + this.y * tm[0][1] + this.z * tm[0][2] + tm[0][3];
		y = this.x * tm[1][0] + this.y * tm[1][1] + this.z * tm[1][2] + tm[1][3];
		z = this.z * tm[2][0] + this.y * tm[2][1] + this.z * tm[2][2] + tm[2][3];
		return new Vec3D(x, y, z);
	}

	static identityTransform() {
		return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]];
	}

	static allRotations() {
		let rots = [];
		for (let i = -2; i < 3; i++)
			for (let j = -2; j < 3; j++)
				for (let k = -2; k < 3; k++) {
					if (Math.abs(i) === Math.abs(j) || Math.abs(i) === Math.abs(k) || Math.abs(j) == Math.abs(k)) continue;
					let blank = [...Array(3)].map(a => Array(4).fill(0));
					blank[0][Math.abs(i)] = i === 0 ? 1 : i / Math.abs(i);
					blank[1][Math.abs(j)] = j === 0 ? 1 : j / Math.abs(j);
					blank[2][Math.abs(k)] = k === 0 ? 1 : k / Math.abs(k);
					rots.push(blank);
				}
		return rots;
	}

	static findInverse(m, candidates) {
		let i = Vec3D.identityTransform();
		i.push([0,0,0,1]);
		for (let c of candidates) {
			if (JS(multiplyMatrices(m, c)) === JS(i))
				return c;
		}
	}

	get s() {
		return `${this.x},${this.y},${this.z}`;
	}

	sub(other) {
		return new Vec3D(this.x - other.x, this.y - other.y, this.z - other.z);
	}
}

function multiplyMatrices(m1, m2) {
	var result = [];
	for (var i = 0; i < m1.length; i++) {
		result[i] = [];
		for (var j = 0; j < m2[0].length; j++) {
			var sum = 0;
			for (var k = 0; k < m1[0].length; k++) {
				sum += m1[i][k] * m2[k][j];
			}
			result[i][j] = sum;
		}
	}
	return result;
}

function findInverseTransforms() {
	let rots = Vec3D.allRotations();
	rots.forEach(m => m.push([0,0,0,1]));
	let inv = {};
	for (let r of rots) {
		let i = Vec3D.findInverse(r, rots);
		if (!i)
			throw new Error(`cannot find inverse for rot matrix ${JS(r)}`);
		inv[r] = i;
	}
	return i;
}

async function solve1(input, step) {
	let scanner = new Map();
	let matcher = new BeaconMatcher();
	let scanner_i;
	for (const line of input.split("\n")) {
		if (line === "") continue;
		let m = /--- scanner (\d+) ---/.exec(line);
		if (m !== null) {
			scanner_i = parseInt(m[1]);
			scanner.set(scanner_i, []);
			continue;
		}
		let coords = line.split(",").map(i => parseInt(i));
		scanner.get(scanner_i).push(new Vec3D(...coords));
	}

	matcher.setTransformMatrix(0, Vec3D.identityTransform());
	let inverses = findInverseTransforms();

	let beacons = scanner.get(0);
	matcher.add_beacons(0, beacons);

	let beacons2 = scanner.get(1);
	rotationLoop:
	for (let rotationMatrix of Vec3D.allRotations()) {
		let hits = 0;
		for (let i = 0; i < beacons2.length - 1; i++) {
			for (let j = i + 1; j < beacons2.length; j++) {
				let match = matcher.find_matching_delta(beacons[i].sub(beacons[j]).transform(rotationMatrix));
				if (match != undefined) {
					hits++;
					log(`${JS(beacons[i])} -> ${JS(beacons[j])} is the same as ${JS(match[0])} -> ${JS(match[1])}`);
				}
			}
		}
	}
	showAnswer("lol");


}