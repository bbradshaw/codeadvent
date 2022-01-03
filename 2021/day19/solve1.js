class Vec3D {
	constructor(x, y, z) {
		Object.assign(this, { x, y, z });
	}

	transformBy(rotateMatrix) {
		let x, y, z;
		x = this.x * rotateMatrix[0][0] + this.y * rotateMatrix[0][1] + this.z * rotateMatrix[0][2];
		y = this.x * rotateMatrix[1][0] + this.y * rotateMatrix[1][1] + this.z * rotateMatrix[1][2];
		z = this.z * rotateMatrix[2][0] + this.y * rotateMatrix[2][1] + this.z * rotateMatrix[2][2];
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
	return [/*[[1, 0, 0], [0, 1, 0], [0, 0, 1]],*/
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

function diffsig(vec1, vec2) {
	return JSON.stringify([Math.abs(vec1.x - vec2.x), Math.abs(vec1.y - vec2.y), Math.abs(vec1.z - vec2.z)].sort((a, b) => a - b));
}


class KnownBeacons {

	constructor(scanners) {
		this.scanners = scanners;

		this.deltas = new Map();
		this.known_beacons = new Map();
	}

	add_known(scanner_idx, beacon_idx, abs_beacon) {
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
					const newdiff = diffsig(beacon1, beacon2);
					this.deltas.set(s, newdiff);
					if (diff === newdiff)
						results.push([beacon1, beacon2]);
				}
			}
		}
		return results;
	}
}

function matching_deltas([a, b], [c, d]) {
	for (const dim of ['x', 'y', 'z'])
		if (a[dim] - b[dim] !== c[dim] - d[dim])
			return false;
	return true;
}

async function solve1(input, step) {
	log('running unit tests');
	test();
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
			let matching_pts = {};
			let matched_scanners = {};

			for (let i = 0; i < scanner[uk_scanner_id].length - 1; i++) {
				const uk_beacon1 = scanner[uk_scanner_id][i];
				for (let j = i + 1; j < scanner[uk_scanner_id].length; j++) {
					const uk_beacon2 = scanner[uk_scanner_id][j];
					const diff = diffsig(uk_beacon1, uk_beacon2);
					for (const [m_beacon1, m_beacon2] of known_beacons.find_diff(diff)) {
						const finding = { known: [m_beacon1, m_beacon2], unknown: [uk_beacon1, uk_beacon2] };
						if (matching_pts.hasOwnProperty(uk_scanner_id))
							matching_pts[uk_scanner_id].push(finding);
						else
							matching_pts[uk_scanner_id] = [finding];

						if (!matched_scanners.hasOwnProperty(uk_scanner_id))
							matched_scanners[uk_scanner_id] = new Set();
						matched_scanners[uk_scanner_id].add(uk_beacon1.toString());
						matched_scanners[uk_scanner_id].add(uk_beacon2.toString());
					}
				}
			}

			for (const [matched_scanner, uniq_matched] of Object.entries(matched_scanners)) {
				if (uniq_matched.size >= 12) {
					log(`found ${uniq_matched.size} new matches in scanner ${matched_scanner}.`)
					let rotation, translation;

					rotloop:
					for (rotation of allRotations) {
						let matched = {};
						let hadMatched = false;
						for (const { known, unknown } of matching_pts[matched_scanner]) {
							let rotated = unknown.map(beacon => beacon.transformBy(rotation));

							if (matching_deltas(known, rotated)) {
								if (!hadMatched) log(`matched ${known[0]} to ${unknown[0]} and ${known[1]} to ${unknown[1]} with rotation ${allRotations.indexOf(rotation)}`);
								hadMatched = true;
								matched[known[0].toString()] = { known: known[0], candidate: rotated[0] };
								matched[known[1].toString()] = { known: known[1], candidate: rotated[1] };
							}
							else if (matching_deltas(known, [rotated[1], rotated[0]])) {
								if (!hadMatched) log(`rev-matched ${known[1]} to ${unknown[0]} and ${known[0]} to ${unknown[1]} with rotation ${allRotations.indexOf(rotation)}`);
								hadMatched = true;
								matched[known[1].toString()] = { known: known[1], candidate: rotated[0] };
								matched[known[0].toString()] = { known: known[0], candidate: rotated[1] };
							}
							else if (hadMatched) {
								log(`rotation had matched for ${matched_scanner} but failed on a beacon`);
								continue rotloop;
							}
							else{
								continue rotloop;
							}
						}
						for (const { known, candidate } of Object.values(matched)) {
							if (!translation) {
								translation = known.sub(candidate);
								continue;
							}
							if (!translation.add(candidate).equals(known)) {
								log(`translation failed ${candidate} + ${translation} does not equal ${known}`);
								continue rotloop;
							}
						}

						log(`fully matched scanner ${matched_scanner} at position ${translation}`);
						for (let i = 0; i < scanner[matched_scanner].length; i++)
							known_beacons.add_known(matched_scanner, i, scanner[matched_scanner][i].transformBy(rotation).add(translation));
						unknown_scanners.delete(matched_scanner);
						break rotloop;
					}
				}

			}

		}

	}

}

function test() {
	let a = new Vec3D(1, 2, 3);
	let b = new Vec3D(4, 5, 6);
	let c = new Vec3D(10, 11, 15);
	let scanners = { 0: [a, b, c] };
	assert(a.sub(b).add(b).equals(a), "basic transitive vec test");
	let beacons = new KnownBeacons(scanners);
	for (let i = 0; i < scanners[0].length; i++) {
		beacons.add_known(0, i, scanners[0][i]);
	}
	assert(diffsig(a, b) !== diffsig(a, c), "diff sigs are unique");
	let rotation = getAllRotations()[1];

	let a2 = a.transformBy(rotation);

	assert(!a.equals(a2), "rotation matrix transforms");

	let b2 = b.transformBy(rotation);

	assert(diffsig(a, b) === diffsig(a2, b2), "diff sigs are rotation invariant");

	let c2 = c.transformBy(rotation);
	let d2 = new Vec3D(0, 1, 2);

	assert(diffsig(a, b) !== diffsig(a2, d2), "diff sigs are hopefully unique");

	let matching = beacons.find_diff(diffsig(a, b));
	assert(matching.length === 2, "should be 2 matches for each dir");
	assert(matching[0][0].equals(a) || matching[0][1].equals(a), "vec a did not match!")
	assert(matching[0][0].equals(b) || matching[0][1].equals(b), "vec b did not match!")
}