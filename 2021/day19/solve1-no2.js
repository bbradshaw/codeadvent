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
		return `(${this.x},${this.y},${this.z})`;
	}

	static parse(s) {
		let m = /\(([^,]+),([^,]+),([^,]+)\)/.exec(s);
		return new Vec3D(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
	}
}

function getAllRotations() {
	return [[[1, 0, 0], [0, 0, 1], [0, -1, 0]],
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
	[[0, -1, 0], [0, 0, -1], [1, 0, 0]],
	/*[[1, 0, 0], [0, 1, 0], [0, 0, 1]]*/];
}


class KnownBeacons {

	constructor(scanners) {
		this.scanners = scanners;

		this.deltas = new Map();
		this.known_beacons = new Map();
		this.known_scanners = new Set();
	}

	add_known(scanner_idx, beacon_idx, abs_beacon) {
		this.known_scanners.add(scanner_idx);
		if (!this.known_beacons.has(abs_beacon.toString()))
			this.known_beacons.set(abs_beacon.toString(), [[scanner_idx, beacon_idx]]);
		else
			this.known_beacons.get(abs_beacon.toString()).push([scanner_idx, beacon_idx]);
	}

	find_diff(diff) {
		let results = [];
		for (const [k1, entries1] of this.known_beacons.entries()) {
			let beacon1 = this.scanners[entries1[0][0]][entries1[0][1]];
			for (const [k2, entries2] of this.known_beacons.entries()) {
				if (k1 === k2) continue;
				let beacon2 = this.scanners[entries2[0][0]][entries2[0][1]];
				let s = `${beacon1}->${beacon2}`;
				if (this.deltas.has(s)) {
					if (diff === this.deltas.get(s))
						results.push([beacon1, beacon2]);
				}
				else {
					const newdiff = beacon1.sub(beacon2).toString();
					this.deltas.set(s, newdiff);
					if (diff === newdiff)
						results.push([beacon1, beacon2]);
				}
			}
		}
		return results;
	}
}

async function solve1(input, step) {

	const allRotations = getAllRotations();
	let scanner = {};
	let scanner_i;
	let unknown_scanners = new Set();

	for (const line of input.split("\n")) {
		if (line === "") continue;
		let m = /--- scanner (\d+) ---/.exec(line);
		if (m !== null) {
			scanner_i = parseInt(m[1]);
			scanner[scanner_i] = [];
			unknown_scanners.add(scanner_i);
			continue;
		}
		let coords = line.split(",").map(i => parseInt(i));
		scanner[scanner_i].push(new Vec3D(...coords));
	}

	let known_beacons = new KnownBeacons(scanner);
	log(`finished parsing`);

	for (let i = 0; i < scanner[0].length; i++)
		known_beacons.add_known(0, i, scanner[0][i]);

	let lastSize = unknown_scanners.size;
	unknown_scanners.delete(0);
	log(`set scanner 0 to solved.`);

	while (unknown_scanners.size > 0) {
		if (unknown_scanners.size === lastSize) {
			showAnswer("failure :(");
			break;
		}
		lastSize = unknown_scanners.size;
		for (const uk_scanner_id of unknown_scanners) {
			await step(null);
			log(`analyzing scanner ${uk_scanner_id}`);

			for (const rotation of allRotations) {
				await step(null);
				let matching_beacons = new Set();
				let candidates = [];
				for (const unknown_pair of permute2(scanner[uk_scanner_id])) {
					let [uk1, uk2] = unknown_pair.map(b => b.transformBy(rotation));
					for (let diff of [uk1.sub(uk2).toString(), uk2.sub(uk1).toString()]) {
						known_beacons.find_diff(diff)
							.map(
								([k1, k2]) =>
									({ known: [k1, k2], unknown: [uk1, uk2], trans: [k1.sub(uk1), k2.sub(uk2)] })
							)
							.filter(candidate => {
								if (!candidate.trans[0].equals(candidate.trans[1])) {
									log(`candidate rejected bc translation failed between pt matches`);
									return false;
								}
								return true;
							})
							.forEach(candidate => {
								matching_beacons.add(candidate.unknown[0].toString());
								matching_beacons.add(candidate.unknown[1].toString());
								candidates.push(candidate);
							});
					}
				}

				if (matching_beacons.size > 0)
					log(`${matching_beacons.size} unique points matched with rotation ${JSON.stringify(rotation)}`);
				if (matching_beacons.size >= 12) {
					log(`match found for beacon ${uk_scanner_id}`);
					if (candidates.some(can => !can.trans[0].equals(candidates[0].trans[1])))
						throw new Error("uh oh spaghettios");
					let sensor_translation = candidates[0].trans[0];
					for (let i = 0; i < scanner[uk_scanner_id].length; i++)
						known_beacons.add_known(uk_scanner_id, i, scanner[uk_scanner_id][i].transformBy(rotation).add(sensor_translation));
					unknown_scanners.delete(uk_scanner_id);
				}
			}
		}
	}
}
