class Cuboid {
	DIMENSION = ['x', 'y', 'z'];

	constructor(x1, x2, y1, y2, z1, z2, on_volume) {
		Object.assign(this, { x1, x2, y1, y2, z1, z2, on_volume });
	}

	is_in_dim(val, dim) {
		let cmp;
		switch (dim) {
			case 'x':
				cmp = [this.x1, this.x2];
				break;
			case 'y':
				cmp = [this.y1, this.y2];
				break;
			case 'z':
				cmp = [this.z1, this.z2];
				break;
		}
		return (val >= cmp[0] && val <= cmp[1])
	}

	get_intersection(other) { // given two regions, return an intersection region
		let overlap = { 'x': [], 'y': [], 'z': [] }
		for (const dim of this.DIMENSION)
			for (const ia of ['1', '2'])
				if (this.is_in_dim(other[dim + ia], dim))  //if any of their vertices are in our bounds
					overlap[dim].push(ia)
				else if (other.is_in_dim(this[dim + ia], dim)) // if not, also we might be entirely within them
					overlap[dim].push(ia)

		if (!overlap['x'].length || !overlap['y'].length || !overlap['z'].length) //no overlap
			return null;

		let intersection = new Cuboid();
		for (const dim of this.DIMENSION) {
			if (overlap[dim].length > 1) {	// they are entirely within this dimension or vice versa
				intersection[dim + '1'] = Math.max(this[dim + '1'], other[dim + '1']);
				intersection[dim + '2'] = Math.min(this[dim + '2'], other[dim + '2']);
			}
			else if (overlap[dim][0] === '1') {		// if minX of other is in this region
				intersection[dim + '1'] = other[dim + '1'];		// intersection minX is other minX
				intersection[dim + '2'] = this[dim + '2'];
			}
			else {										//otherwise maxX is in this region
				intersection[dim + '1'] = this[dim + '1'];	// and intersection minX is our minX
				intersection[dim + '2'] = this[dim + '2'];
			}
		}
		return intersection
	}

	static copy(other){
		return new Cuboid(other.x1, other.x2, other.y1, other.y2, other.z1, other.z2, other.on_volume);
	}


	toString() {
		return `{x ${this.x1}..${this.x2} y ${this.y1}..${this.y2} z ${this.z1}..${this.z2}}`;
	}

	volume() {
		return (this.x2 - this.x1 + 1) * (this.y2 - this.y1 + 1) * (this.z2 - this.z1 + 1);
	}
}

async function solve2(input, step) {

	let regions = input.split("\n").map(transform).map(
		({ state, x1, x2, y1, y2, z1, z2 }) => new Cuboid(x1, x2, y1, y2, z1, z2, state === "on" ? 1 : 0));

	let cleanRegions = [];
	let rN = 0;

	for (let region of regions) {
		let nextCleanRegions = [];

		for (let testRegion of cleanRegions) {
			let intersect = region.get_intersection(testRegion);
			if (intersect == null) {
				nextCleanRegions.push(testRegion);
				continue;
			}
			for (const dim of ['x', 'y', 'z']) {
				if ((testRegion[dim + '1'] <= region[dim + '2']) && (region[dim + '2'] <= testRegion[dim + '2'])) {
					let sliced = Cuboid.copy(testRegion);
					sliced[dim + '1'] = region[dim + '2'] + 1;
					nextCleanRegions.push(sliced);
					testRegion[dim + '2'] = region[dim + '2'];
				}
				if ((testRegion[dim + '1'] <= region[dim + '1']) && (region[dim + '1'] <= testRegion[dim + '2'])) {
					let sliced = Cuboid.copy(testRegion);
					sliced[dim + '2'] = region[dim + '1'] - 1;
					nextCleanRegions.push(sliced);
					testRegion[dim + '1'] = region[dim + '1'];
				}
			}
		}

		if (region.on_volume) {
			nextCleanRegions.push(region);
		}
		log(`after ${rN++}, ${cleanRegions.length} to ${nextCleanRegions.length} sliced regions`);
		cleanRegions = nextCleanRegions;

		await step(1);
	}

	showAnswer(sum(cleanRegions.map(r => r.volume())));
}


