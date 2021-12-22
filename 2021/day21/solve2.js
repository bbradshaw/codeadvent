function rel_prob(dice_roll) {  // i am going to make my future self angry but not explaining how this works (but you will figure it out :))
	let [nrolls, nsides] = dice_roll.split("d").map(n => parseInt(n));

	let prob = newCounter();
	for (let i = 0; i < Math.pow(nsides, nrolls); i++) {
		let roll = Array.from(i.toString(nsides).padStart(nrolls, '0')).map(n => parseInt(n, nsides) + 1);
		prob[sum(roll)] += 1;
	}
	return prob;
}

async function solve2(input, step) {
	let lines = input.split("\n");
	const pos2 = parseInt(lines.pop().split(": ")[1]);
	const pos1 = parseInt(lines.pop().split(": ")[1]);

	const prob_chart = rel_prob("3d3");

	// PLAYERONEPOS, PLAYERTWOPOS, PLAYERONESCORE, PLAYERTWOSCORE = # universes
	let universe = {};
	for (let i = 1; i < 11; i++) {
		universe[i] = {};
		for (let j = 1; j < 11; j++) {
			universe[i][j] = {};
			for (let k = 0; k < 21; k++) {
				universe[i][j][k] = {};
				for (let l = 0; l < 21; l++) {
					universe[i][j][k][l] = 0;
				}
			}
		}
	}
	universe[pos1][pos2][0][0] = 1;

	log('finished initializing universe holder');
	let p = 1;
	let turns = 0;
	let winning_universes = newCounter();

	while (true) {
		log(`simulating all outcomes of turn ${turns}`);
		let nextUniverse = {};
		for (let i = 1; i < 11; i++) {
			nextUniverse[i] = {};
			for (let j = 1; j < 11; j++) {
				nextUniverse[i][j] = {};
				for (let k = 0; k < 21; k++) {
					nextUniverse[i][j][k] = {};
					for (let l = 0; l < 21; l++) {
						nextUniverse[i][j][k][l] = 0;
					}
				}
			}
		}

		let didCalc = false;
		for (let r = 3; r < 10; r++) {
			const prob = prob_chart[r];
			for (let i = 1; i < 11; i++) {
				for (let j = 1; j < 11; j++) {
					for (let k = 0; k < 21; k++) {
						for (let l = 0; l < 21; l++) {
							let currentProb = universe[i][j][k][l];
							if (currentProb === 0) continue;
							didCalc = true;

							let nextSpace, nextScore;
							if (p === 1) {
								nextSpace = (i + r - 1) % 10 + 1;
								nextScore = k + nextSpace;
								if (nextScore >= 21) {
									winning_universes[1] += currentProb * prob;
								}
								else {
									let newProb = currentProb * prob;
									nextUniverse[nextSpace][j][nextScore][l] += newProb;
									//log(`nextUniverse[${nextSpace}][${j}][${nextScore}][${l}] = ${newProb}`);
								}
							}
							else {
								nextSpace = (j + r - 1) % 10 + 1;
								nextScore = l + nextSpace;
								if (nextScore >= 21) {
									winning_universes[2] += currentProb * prob;
								}
								else {
									let newProb = currentProb * prob;
									nextUniverse[i][nextSpace][k][nextScore] += newProb;
									//log(`nextUniverse[${i}][${nextSpace}][${j}][${nextScore}] = ${newProb};`);
								}
							}
						}
					}
				}
			}
		}
		universe = nextUniverse;
		turns++;

		p = p % 2 + 1;
		await step(null);
		if (!didCalc)
			break
	}
	log(JSON.stringify(winning_universes));
	showAnswer(Math.max(...Object.values(winning_universes)));
}
