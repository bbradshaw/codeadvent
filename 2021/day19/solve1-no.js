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

class Matcher {

	constructor() {
		this.by_delta = {}
		this.scanner_pts = {};
		this.abs_pts = new Map();
	}

	add_delta(scanner_id, pt1, pt2) {
		if (!this.by_delta[scanner_id])
			this.by_delta[scanner_id] = new Map();

		this.by_delta[scanner_id].set(pt1.sub(pt2).toString(), [pt1, pt2]);
	}

	add_pt(scanner_id, pt) {


		if (!this.scanner_pts[scanner_id])
			this.scanner_pts[scanner_id] = [];

		if (!this.abs_pts.has(pt.toString()))
			this.abs_pts.set(pt.toString(), []);

		this.scanner_pts[scanner_id].push(pt);
		this.abs_pts.get(pt.toString()).push([scanner_id, this.scanner_pts[scanner_id].length - 1]);
	}

	get_pts_by_delta(i, x, y) {
		let rs = [];

		let dX = x.sub(y);
		//let dY = y.sub(x);

		for (const D of [dX/*, dY*/]) {
			const deltas = this.by_delta[i];
			if (deltas.has(D.toString())) {
				const m = deltas.get(D.toString())
				rs.push({ scanner_i: i, pt1: m[0], pt2: m[1] });
			}
		}

		return rs;
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

async function solve1(input, step) {
	let scanner = {};
	let scanner_i;
	let matcher = new Matcher();

	const allRotations = getAllRotations();

	for (const line of input.split("\n")) {
		if (line === "") continue;
		let m = /--- scanner (\d+) ---/.exec(line);
		if (m !== null) {
			scanner_i = parseInt(m[1]);
			scanner[scanner_i] = [];
			continue;
		}
		let coords = line.split(",").map(i => parseInt(i));
		scanner[scanner_i].push(new Vec3D(...coords));

	}

	log(`input parsed`);
	await step(null);

	const scanner_idxs = Object.keys(scanner).map((_, i) => i);

	scanner[0].forEach(pt => matcher.add_pt(0, pt));

	for (const [pt1, pt2] of permute2(scanner[0]))
		matcher.add_delta(0, pt1, pt2);
	log(`scanner 0 deltas set`);

	await step(null);

	let scanners_to_test = [0];
	let already_tested = new Set();

	while (scanners_to_test.length > 0) {
		let j = scanners_to_test.pop();

		for (let i = 0; i < scanner_idxs.length; i++) {
			if (i == j || already_tested.has(`${i}-${j}`))
				continue;
			already_tested.add(`${i}-${j}`);
			log(`comparing scanner ${i} -> ${j}`);
			await step(null);

			for (const rot_is in allRotations) {
				const rotationMatrix = allRotations[rot_is];
				let matches = {};
				for (const [pt1, pt2] of permute2(scanner[i])) {
					const matching_pts = matcher.get_pts_by_delta(j, pt1.transformBy(rotationMatrix), pt2.transformBy(rotationMatrix));
					for (let { scanner_i: m_scan, pt1: m_pt1, pt2: m_pt2 } of matching_pts) {
						if (matches[m_scan] == null) matches[m_scan] = [];
						matches[m_scan].push(`${m_pt1}:${m_pt2}=${pt1}:${pt2}`);
					}
				}
				for (const [m_scan, matching_pts] of Object.entries(matches)) {
					if (matching_pts.length > 0) log(`${matching_pts.length} matching points against scanner ${i} using rotation ${rot_is}`);
					if (matching_pts.length > 11) {
						log(`found rotational match for scanner ${i} with rotation ${rot_is}`);
						let [other_pts, our_pts] = matching_pts[0].split("=");
						let [[other1, other2], [our1, our2]] = [other_pts.split(":").map(Vec3D.parse), our_pts.split(":").map(Vec3D.parse)];
						let translate = other1.sub(our1.transformBy(rotationMatrix));
						for (const pts_s of matching_pts) {
							[other_pts, our_pts] = pts_s.split("=");
							[[other1, other2], [our1, our2]] = [other_pts.split(":").map(Vec3D.parse), our_pts.split(":").map(Vec3D.parse)];
							if (!((other1.sub(our1.transformBy(rotationMatrix)).equals(translate)))) {
								log(`scanner ${i} with rotation ${rot_is} translation vector ${translate} does not match ${other1} to ${our1}`);
								break;
							}
							//assert(other2.sub(our2.transformBy(rotationMatrix)).equals(translate), `translation vector ${translate} does not match ${other2} to ${our2}`);
							gauge(`found translation vector for scanner ${i} with rotation ${rot_is} and translate ${translate}`);
							matcher.add_pt(i, our1.transformBy(rotationMatrix).add(translate));
							matcher.add_pt(i, our2.transformBy(rotationMatrix).add(translate));
						}
						for (const [pt1, pt2] of permute2(scanner[i]))
							matcher.add_delta(i, pt1, pt2);
						scanners_to_test.push(i);
					}
				}
			}
		}
	}
	const uniq_beacons = Array.from(matcher.abs_pts.keys());
	showAnswer(uniq_beacons.length);
}