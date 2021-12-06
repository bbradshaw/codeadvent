
async function solve(input, step, final_day) {
	let fish = input.split(",").map(n => parseInt(n));
	let fishbucket = newCounter();
	for (const f of fish)
		fishbucket[f] += 1;
	const considerDays = Array(9).fill(0).map((n, i) => i);

	log("There are " + considerDays.map(d => `${fishbucket[d]} fish with timer ${d}`).join(", ") + ".");
	log(`A total of ${sum(considerDays.map(n=> fishbucket[n]))} fish.`);

	for (let d=1; d<=final_day; d++){
		let nextfishbucket = newCounter();
		considerDays.forEach( n => {
			if (n == 0){
				nextfishbucket[8] += fishbucket[0];
				nextfishbucket[6] += fishbucket[0];
			}
			else{
				nextfishbucket[n - 1] += fishbucket[n];
			}
		});

		fishbucket = nextfishbucket;
		log(`There are ${sum(considerDays.map(n=> fishbucket[n]))} fish on day ${d}`);
		await step(1, final_day);
	}
	showAnswer(sum(considerDays.map(n=> fishbucket[n])));

}


async function solve1(input, step){
	solve(input, step, 80);
}

