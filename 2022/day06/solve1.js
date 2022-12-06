async function solve(input, step, n){
	let buf = new CircularBuffer(n);
	let answer = null;
	for (let i = 0; i < input.length; i++){
		const char = input[i];
		buf.push(char);
		log(`buf is ${Array.from(buf).join('')}`);
		if (buf.length > n - 1 && allUnique(buf)){
			answer = i + 1;
			break;
		}
		if (i % 100 == 0) await step(1, input.length);
	}
	assert(answer !== null, "didn't find answer");
	showAnswer(answer);
}

async function solve1(input, step){
	return await solve(input, step, 4);
}

class CircularBuffer{
	constructor (capacity) {
		this.capacity = capacity;
		this._backing = [];
	}

	get length() {
		return this._backing.length;
	} 

	push(item){
		if (this._backing.length >= this.capacity)
			this._backing.shift();
		this._backing.push(item);
	}

	[Symbol.iterator]() {
		return this._backing[Symbol.iterator]();
	}
}

function allUnique(buf){
	return buf.length === Array.from(new Set(buf)).length
}