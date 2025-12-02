async function solve1(input, step) {
	document.getElementById("canvas").style.display = "block";
	const data = input.trim().split("\n")
		.map(l => {
			if (l.charAt(0) === "L") {
				return -parseInt(l.slice(1))
			} else {
				return parseInt(l.slice(1))
			}
		});
	let pointer = 50;
	let score = 0;
	for (let i = 0; i < data.length; i++) {
		const value = data[i];
		await visualize(pointer, value);
		pointer += value;
		if (pointer < 0) {
			pointer = 100 - (-pointer % 100);
		}
		if (pointer >= 100) {
			pointer = pointer % 100;
		}
		if (pointer === 0) {
			score += 1;
		}
		gauge(`${value} -> ${pointer}`);
		await step(1, data.length);
	}
	showAnswer(score);
}

async function solve2(input, step) {
	document.getElementById("canvas").style.display = "block";
	const data = input.trim().split("\n")
		.map(l => {
			if (l.charAt(0) === "L") {
				return -parseInt(l.slice(1))
			} else {
				return parseInt(l.slice(1))
			}
		});
	let pointer = 50;
	let score = 0;
	for (let i = 0; i < data.length; i++) {
		const value = data[i];
		await visualize(pointer, value);
		const before = pointer;
		pointer += value;
		if (value > 0) {
			score += Math.floor(pointer / 100) - Math.floor(before / 100);
		} else if (value < 0) {
			score += Math.floor((before - 1) / 100) - Math.floor((pointer - 1) / 100);
		}
		if (pointer < 0) {
			pointer = 100 - (-pointer % 100);
		}
		if (pointer >= 100) {
			pointer = pointer % 100;
		}

		gauge(`${value} -> ${pointer}`);
		await step(1, data.length);
	}

	showAnswer(score); // 6496
}

function drawPadlock(value) {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;
	ctx.translate(centerX, centerY);
	const angle = (value / 100) * 2 * Math.PI;
	ctx.rotate(-angle);
	ctx.translate(-centerX, -centerY);
	const radius = Math.min(centerX, centerY) - 20;

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000000';
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	ctx.stroke();

	for (let i = 0; i < 100; i++) {
		const angle = (i / 100) * 2 * Math.PI - Math.PI / 2;
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		ctx.fillStyle = i === 0 ? 'red' : 'black';
		ctx.font = '18px Sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(i.toString(), x, y);
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.beginPath();
	ctx.lineWidth = 4;
	if (value < 1.0 && value > -1.0) {
		ctx.strokeStyle = 'red';
	} else {
		ctx.strokeStyle = '#000000';
	}
	ctx.moveTo(centerX, centerY);
	ctx.lineTo(centerX, centerY - radius + 20);
	ctx.stroke();

}

async function visualize(currentValue, move) {
	const duration = stepDelay;
	let start = null;
	return new Promise(resolve => {
		requestAnimationFrame(function step(timestamp) {
			if (!start) start = timestamp;
			const progress = timestamp - start;
			const percentage = Math.min(progress / duration, 1);
			const easeInOut = percentage < 0.5
				? 2 * percentage * percentage
				: -1 + (4 - 2 * percentage) * percentage;
			drawPadlock(currentValue + move * easeInOut);
			if (percentage < 1) {
				requestAnimationFrame(step);
			}
			else {
				return resolve();
			}
		});
	});
}