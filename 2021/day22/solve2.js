class Cuboid {
	DIMENSION = ['x', 'y', 'z'];

	constructor(x1, x2, y1, y2, z1, z2, state) {
		Object.assign(this, { x1, x2, y1, y2, z1, z2, state });
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

	toString() {
		return `${this.state}{x ${this.x1}..${this.x2} y ${this.y1}..${this.y2} z ${this.z1}..${this.z2}}`;
	}

	volume() {
		return (this.x2 - this.x1 + 1) * (this.y2 - this.y1 + 1) * (this.z2 - this.z1 + 1)
	}
}

function test() {
	let regionA = new Cuboid(0, 5, 0, 5, 0, 5);
	let regionB = new Cuboid(4, 6, 4, 6, 4, 6);
	let regionC = new Cuboid(6, 8, 6, 8, 6, 8);
	let regionD = new Cuboid(1, 3, 1, 3, 1, 3);


	let intersect = regionA.get_intersection(regionC);
	if (intersect != null)
		throw new Error("nonintersect A&C");

	intersect = regionA.get_intersection(regionB);
	if (intersect.x1 !== 4 || intersect.x2 !== 5 ||
		intersect.y1 !== 4 || intersect.y2 !== 5 ||
		intersect.z1 !== 4 || intersect.z2 !== 5)
		throw new Error("bad intersection calc on A&B");

	intersect = regionB.get_intersection(regionC);
	if (intersect.x1 !== 6 || intersect.x2 !== 6 ||
		intersect.y1 !== 6 || intersect.y2 !== 6 ||
		intersect.z1 !== 6 || intersect.z2 !== 6)
		throw new Error("bad intersection calc on B&C");

	intersect = regionA.get_intersection(regionD);
	if (intersect.x1 !== 1 || intersect.x2 !== 3 ||
		intersect.y1 !== 1 || intersect.y2 !== 3 ||
		intersect.z1 !== 1 || intersect.z2 !== 3)
		throw new Error("bad intersection calc on A&D");

	intersect = regionD.get_intersection(regionA);
	if (intersect.x1 !== 1 || intersect.x2 !== 3 ||
		intersect.y1 !== 1 || intersect.y2 !== 3 ||
		intersect.z1 !== 1 || intersect.z2 !== 3)
		throw new Error("bad intersection calc on D&A");
	
	let cleaveTest = new Cuboid(0, 4, 0, 4, 0, 4);
	let topper = new Cuboid(0, 4, 3, 4, 0, 4);
	intersect = cleaveTest.get_intersection(topper);
	let rs = cleave(cleaveTest, topper);
	if (rs.length !== 1) throw new Error(`cleave top intersection gave wrong length ${rs.length}`)
	rs = rs[0];
	if ( rs.x1 !== 0  || rs.x2 !== 4 ||
		 rs.y1 !== 0 || rs.y2 !== 2 ||
		 rs.z1 !== 0 || rs.z2 !== 4)
		 throw new Error(`wrong dimensions for cleaved top cuboid!`);
	

	console.log('unit test pass')
}

function cleave(region, intersection) {
	let newRegions = [];
	if (intersection.y2 < region.y1) // YMIN FACE
		newRegions.push(new Cuboid(region.x1, region.x2, intersection.y2 + 1, region.y2, region.z1, region.z2));
	if (region.y2 > intersection.y1) // YMAX FACE
		newRegions.push(new Cuboid(region.x1, region.x2, region.y1, intersection.y2 - 1, region.z1, region.z2));
	if (intersection.z2 < region.z1) // ZMIN FACE
		newRegions.push(new Cuboid(region.x1, region.x2, region.y1, region.y2, intersection.z2 + 1, region.z2));
	if (region.z2 > intersection.z1) // ZMAX FACE
		newRegions.push(new Cuboid(region.x1, region.x2, region.y1, region.y2, region.z1, intersection.z2 - 1));
	if (intersection.x2 < region.x1) // XMIN FACE
		newRegions.push(new Cuboid(intersection.x2 + 1, region.x2, region.y1, region.y2, region.z1, region.z2));
	if (region.x2 > intersection.x1) // XMAX FACE
		newRegions.push(new Cuboid(region.x1, intersection.x2 - 1, region.y1, region.y2, region.z1, region.z2));
	newRegions.forEach(c => c.state = region.state);
	if (!newRegions.length) throw new Error("cleaved into 0 pieces");

	return newRegions;
}

async function solve2(input, step) {

	let regions = input.split("\n").map(transform).map(
		({ state, x1, x2, y1, y2, z1, z2 }) => [new Cuboid(x1, x2, y1, y2, z1, z2, state)]);

	let total = 0;
	while (regions.length) {
		const idx = regions.length - 1;
		let oldestRegions = regions.pop();
		for (let i = 0; i < regions.length; i++) {
			let otherRegions = regions[i];
			for (let oldRegion of oldestRegions) {
				let chopped = [];
				while (otherRegions.length) {
					let cmp = otherRegions.pop();
					let intersect = oldRegion.get_intersection(cmp);
					if (intersect)
						chopped.push(cleave(cmp, intersect));
					else
						chopped.push(cmp);
				}
				gauge(`Region in group ${idx} chopped region group ${i} to ${chopped.length}`);
				otherRegions = chopped;
			}
		}

		oldestRegions.forEach(cube => total += cube.state === "on" ? cube.volume() : 0);
		await step(1);
	}

	showAnswer(total);

}

test();