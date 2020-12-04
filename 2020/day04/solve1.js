async function solve1(input, step) {
	let passports = [];
	let last_data = [];
	let valid = 0;
	for (const line of input.split("\n")) {
		if (line.length === 0) {
			passports.push(last_data);
			last_data = [];
			continue;
		}
		for (const dp of line.split(" ")) {
			last_data.push(dp);
		}
	}
	passports.push(last_data);
	log(`Input ${passports.length} passports.`);
	const required = new Set(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']);
	for (pi in passports) {
		let left = new Set(required);
		for (const dp of passports[pi]) {
			const fragment = dp.slice(0, 3);
			left.delete(fragment);
		}
		if (left.size > 0) {
			gauge(`passport ${pi} failed, missing: ${Array.from(left)}`);
		}
		else {
			gauge(`passport ${pi} passed`);
			valid += 1;
		}
		try {
			await step();
		}
		catch {
			log("User cancelled");
			return;
		}
	}

	showAnswer(valid);
}
