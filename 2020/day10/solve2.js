function num_combinations_for_run_length(n){
	return n*(n-1)/2 + 1
}

async function solve2(input, step){
	let nums = input.split("\n").map(i => parseInt(i));
	nums.sort((a,b) => a-b);
	nums.unshift(0);
	let deltas = [];

	for (let i=0; i<nums.length-1; i++){
		const diff = nums[i+1] - nums[i];
		deltas.push(diff);
		await step();
	}
	deltas.push(3);

	let run_lengths = [];
	let this_run = 0;
	for (const delta of deltas){
		if (delta == 1) 
			this_run++;
		else if (this_run > 0){
			log(`run length of ${this_run} will have ${num_combinations_for_run_length(this_run)} combinations`);
			run_lengths.push(this_run);
			this_run = 0;
		}
	}
	log(`answer is ${run_lengths.join(" * ")}`);
	let answer = run_lengths.reduce((acc, n) => acc*num_combinations_for_run_length(n), 1);
	showAnswer(answer);
}