const TRIBOOL = {
	T: true,
	F: false,
	I: "indeterminate"
}

async function solve1(input, step){
	let corrects = [];
	let idx = 0;
	for (const pairs of input.split('\n\n')){
			let [left, right] = pairs.split('\n');
			idx++;
			left = JSON.parse(left);
			right = JSON.parse(right);
			let isCorrect = compare(left, right); 
			if (isCorrect) corrects.push(idx);
			await step(1);
	}

	showAnswer(sum(corrects));
}

function compare(left, right){
	let rs = _compare(left, right);
	log(`which returned ${rs}`);
	return rs;
}

function _compare(left, right){
	if (Array.isArray(left) && !Array.isArray(right))
		right = [right];
	else if (!Array.isArray(left) && Array.isArray(right))
		left = [left];
	log(`comparing ${JSON.stringify(left)} to ${JSON.stringify(right)}`);
	if (typeof left === "number") { // and right too	
		if (right > left)
			return TRIBOOL.T;
		else if (right < left)
			return TRIBOOL.F;
		return TRIBOOL.I;
	}
	
	if (left.length == 0 && right.length == 0)
		return TRIBOOL.I;
	else if (left.length == 0)
		return TRIBOOL.T;
	else if (right.length == 0)
		return TRIBOOL.F;

	let rs = compare(left[0], right[0]);
	if (rs === TRIBOOL.I)
		return compare(left.slice(1), right.slice(1));
	else
		return rs;
}