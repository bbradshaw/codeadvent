class Board extends Grid {
	constructor(d2array, id) {
		super(d2array);
		this.id = id;
		this.rows = new Array(this.height).fill().map(() => new Set());
		this.cols = new Array(this.width).fill().map(() => new Set());

		this.row_marks = new Array(this.height).fill(0);
		this.col_marks = new Array(this.width).fill(0);

		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				this.rows[r].add(d2array[r][c]);
				this.cols[c].add(d2array[r][c]);
			}
		}
	}

	static from_input(raw, id) {
		let d2array = raw.map(row => row.trim().split(/ +/).map(i => parseInt(i)));
		return new Board(d2array, id)
	}

	mark(n) {
		for (const i in this.rows) {
			const set = this.rows[i];
			if (set.has(n)) {
				this.row_marks[i]++;
				log(`board ${this.id} has ${n} in row ${i}!`);
			}
			if (this.row_marks[i] === this.height)
				return Board.WINNER;
		}

		for (const i in this.cols) {
			const set = this.cols[i];
			if (set.has(n)){ 
				this.col_marks[i]++;
				log(`board ${this.id} has ${n} in col ${i}!`);
			}
			if (this.col_marks[i] === this.width)
				return Board.WINNER;
		}
	}

	score(n, nums) {
		let sum = 0;
		for (let [c, r, val] of this) {
			if (nums.includes(val)) continue;
			sum += val;
		}
		return sum * n;
	}
}
Board.WINNER = Symbol("WINNER");


async function solve1(input, step) {
	let lines = input.split("\n");
	const nums = lines.shift()
		.split(",")
		.map(s => parseInt(s));

	lines.shift();
	const linesToParse = lines.length;

	let boards = [];
	gauge("parsing board data");
	for (let i = 0; i < linesToParse; i += 6) {
		boards.push(Board.from_input(lines.splice(0, 5), i));
		lines.shift();
		await step(1, linesToParse / 6);
	}

	log('playing BINGO');

	let played_nums = [];
	let num = nums.shift();
	while (num !== undefined) {
		gauge(`calling ${num}...`);
		played_nums.push(num);
		let winner = boards.find(
			b => b.mark(num) === Board.WINNER
		);
		if (winner) {
			showAnswer(winner.score(num, played_nums));
			break;
		}
		await step(null);
		num = nums.shift();
	}
}
