async function solve1(input, step){
	let nums = input.split("\n").map(i => parseInt(i));
	nums.sort((a,b) => a-b);
	nums.unshift(0);
	let count = {1: 0, 2: 0, 3:1}
	for (let i=0; i<nums.length-1; i++){
		const diff = nums[i+1] - nums[i];
		count[diff] += 1;
		await step();
	}
	log(JSON.stringify(count));
	showAnswer(count[1]*count[3]);
}