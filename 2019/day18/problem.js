class Point2d {
	constructor({x, y}){
		this.x = x;
		this.y = y;
	}
	
	toString(){
		return `(${this.x}, ${this.y})`;
	}

	lineTo(otherPnt){
		// todo diagonals
		let pts = [];
		let curPt = new Point2d(this);
		let delta = 'y';
		if (otherPnt.y === this.y)
			delta = 'x';
		let start = Math.min(this[delta], otherPnt[delta]);
		let end = Math.max(this[delta], otherPnt[delta]);
		curPt[delta] = start;
		do {
			pts.push(new Point2d(curPt));
			curPt[delta] += 1;
		} while (curPt[delta] <= end)
		return pts;
	}
}
class WaterMap {

	constructor(veins) {
		this.veins = veins;
		this.extentLeft = Math.min(...this.veins.flat().map( p => p.x));
		this.extentRight = Math.max(...this.veins.flat().map( p => p.x));
		this.extentTop = Math.min(...this.veins.flat().map(p => p.y));
		this.extentBot = Math.max(...this.veins.flat().map(p => p.y));
		this.grid = [];
		for (let y = this.extentTop; y <= this.extentBot; y++){
			this.grid.push(new Array(this.extentRight - this.extentLeft).fill('.'));
		}
	}

	at({x, y}){
		x + this.extentLeft
	}
	
	toString(){
		return `WaterMap (from  [${this.extentLeft}, ${this.extentTop}] -> [${this.extentRight}, ${this.extentBot}]: [` +
			this.veins.map( ([p1, p2]) => `${p1} -> ${p2}`).join(' ') + '])';
	}

	static fromRawText(txt) {
		const lines = txt.split('\n');
		const veins = lines.map(line => {
			let [p1, p2] = [new Point2d(), new Point2d()];
			for (const coord of line.split(", ")) {
				const [dim, val] = coord.split("=");
				const [first_v, second_v] = val.split('..');
				p1[dim] = parseInt(first_v);
				p2[dim] = parseInt(first_v);
				if (second_v !== undefined)
					p2[dim] = parseInt(second_v);
			}
			return [p1, p2];
		});
		return new WaterMap(veins);
	}
}

let wm = WaterMap.fromRawText(`x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`);

console.log(wm.toString());