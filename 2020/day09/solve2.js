async function solve2(input, step){
	let target = await getPart1AnswerForPart2();
	target = parseInt(target);
	log(`calculating for target ${target}`);
	let nums = input.split("\n").map(i => parseInt(i));
	let l = 0;
	let r = 2;

	while(true){
		const cur_sum = nums.slice(l,r).reduce((acc, n) => acc+n);
		if (cur_sum == target){
			log(`Found answer ${nums.slice(l,r)}`);
			showAnswer(Math.min(...nums.slice(l,r)) + Math.max(...nums.slice(l,r)));
			return;
		}
		if (cur_sum < target){
			r++;
			if (r > nums.length) throw new Error("Could not find answer");
		}
		else if (cur_sum > target){
			l++;
			if (l == r - 1) r++;
			if (r > nums.length) throw new Error("Could not find answer");
		}
		gauge(`window from ${l}..${r}`);
		await step();
	}
}