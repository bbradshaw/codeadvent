function validator(data_point){
	let [identifier, data] = data_point.split(":");
	let between = (d, low, high) => {
		const n = parseInt(d);
		return n >= low && n <= high;
	};
	switch (identifier){
		case 'byr':
			return between(data, 1920, 2002);
		case 'iyr':
			return between(data, 2010, 2020);
		case 'eyr':
			return between(data, 2020, 2030);
		case 'hgt':
			let d = data.match(/(\d+)(cm|in)/);
			if (d === null) return false;
			if (d[2] == 'in') return between(d[1], 59, 76);
			return between(d[1], 150, 193);
		case 'hcl':
			return data.match(/^#[0-9a-f]{6}$/) !== null;
		case 'ecl':
			return data.match(/amb|blu|brn|gry|grn|hzl|oth/) !== null;
		case 'pid':
			return data.match(/^\d{9}$/) !== null;
		case 'cid':
			return true;
	}
}

async function solve2(input, step) {
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
		let did_validate = true;
		for (const dp of passports[pi]) {
			const fragment = dp.slice(0, 3);
			left.delete(fragment);
			if (!validator(dp)){
				did_validate = false;
				log(`Failed validation ${dp}`);
				break;
			}
		}
		if (!did_validate){
			gauge(`passport ${pi} failed validation`);
		}
		else if (left.size > 0) {
			log(`passport ${pi} failed, missing: ${Array.from(left)}`);
		}
		else {
			log(`passport ${pi} passed`);
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
