class SNum {
	constructor(left, right, depth, parent) {
		this.left = left;
		this.right = right;
		this.depth = depth;
		this.parent = parent;
	}

	toString() {
		return `[${this.left}, ${this.right}, ${this.depth}]`;
	}

	*walk() {
		if (typeof this.left === 'number')
			yield this;
		else
			for (let c of this.left.walk()) yield c;
		if (typeof this.right === 'number') {
			if (typeof this.left !== 'number')
				yield this;
		}
		else
			for (let c of this.right.walk()) yield c;
	}

	*visitAll() {
		yield this;
		if (typeof this.left !== 'number')
			for (let c of this.left.visitAll()) yield c;
		if (typeof this.right !== 'number')
			for (let c of this.right.visitAll()) yield c;
	}

	magnitude() {
		let sum = 0;
		if (typeof this.left === 'number')
			sum += 3*this.left;
		else
			sum += 3*this.left.magnitude();
		if (typeof this.right === 'number')
			sum += 2*this.right;
		else
			sum += 2*this.right.magnitude();
		return sum;
	}
}

function writeAsDudeDoes(top) {
	let buffer = [];
	let stack = [['L', top]];
	while (stack.length) {
		let [side, node] = stack.pop();
		if (side === 'E') {
			buffer.push(']');
			continue;
		}
		if (side === 'L') {
			buffer.push("[");
			stack.push(['E', null]);
			if (typeof node.left === 'number') {
				buffer.push(node.left);
			}
			else {
				stack.push(['R', node]);
				stack.push(['L', node.left]);
				continue;
			}
		}
		buffer.push(',');
		if (typeof node.right === 'number')
			buffer.push(node.right)
		else
			stack.push(['L', node.right]);
	}
	return buffer.join("");
}

function parseAndGetTop(input) {
	let parseStack = [];
	let top = null;

	for (let c of Array.from(input)) {
		let last = parseStack.length > 0 ? parseStack[parseStack.length - 1] : undefined;
		switch (c) {
			case '[':
				const parent = last !== undefined ? last[1] : undefined;
				let newS = new SNum(null, null, parseStack.length, parent);
				parseStack.push(['L', newS]);
				if (last !== undefined)
					if (last[0] == 'L')
						last[1].left = newS;
					else
						last[1].right = newS;
				break;
			case ',':
				last[0] = 'R';
				break;
			case ']':
				top = parseStack.pop()[1];
				break;
			default:
				if (last !== undefined)
					if (last[0] == 'L')
						last[1].left = parseInt(c);
					else
						last[1].right = parseInt(c);
		}
	}

	return top;
}

function reduce(top) {

	let needsReduction = true;
	reduceLoop:
	while (needsReduction) {

		needsReduction = false;
		let elements = Array.from(top.walk());

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];

			if (element.depth > 3) { //explode
				if (i !== 0) {
					let prev = elements[i - 1];

					if (typeof prev.right === 'number')
						prev.right += element.left;
					else
						prev.left += element.left;

				}
				if (i < elements.length - 1) {
					let next = elements[i + 1];

					if (typeof next.left === 'number')
						next.left += element.right;
					else
						next.right += element.right;

				}

				if (element.parent.left === element)
					element.parent.left = 0;
				else
					element.parent.right = 0;

				needsReduction = true;
				continue reduceLoop;
			}
		}

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			for (let side of ['left', 'right']) {		//split
				if (typeof element[side] === 'number' && element[side] > 9) {

					let newLeft = Math.floor(element[side] / 2);
					let newRight = Math.ceil(element[side] / 2);
					element[side] = new SNum(newLeft, newRight, element.depth + 1, element);
					needsReduction = true;
					continue reduceLoop;
				}
			}
		}
	}
}

function increaseAllDepth(tops) {
	for (let top of tops) {
		for (let n of top.visitAll())
			n.depth++;
	}
}

async function solve1(input, step) {
	let lines = input.split("\n");
	let prev = parseAndGetTop(lines.shift());

	for (const line of lines) {
		let current = parseAndGetTop(line);
		let newTop = new SNum(prev, current, 0, null);
		current.parent = newTop;
		prev.parent = newTop;
		increaseAllDepth([current, prev]);
		reduce(newTop);
		await step(1);
		log(writeAsDudeDoes(newTop));
		prev = newTop;
	}
	showAnswer(prev.magnitude());

}