

async function solve1(input, step) {
	class Submarine {
		constructor() {
			this.depth = 0;
			this.pos = 0;
			this.animState = {
				ctx: null,
				subImg: null,
				dirty: true,
				cvs_size: { x: null, y: null },
				scaleX: 0,
				scaleY: 0
			};
		}
		animateIfMoved(amt) {
			if (!this.animState.ctx || !this.animState.subImg)
				return;
			if (amt > 0)
				this.animState.dirty = true;
			if (this.animState.dirty)
				this.animate();
		}

		goF(amt) {
			this.pos += amt;
			this.animateIfMoved(amt);
		}

		goD(amt) {
			this.depth += amt;
			this.animateIfMoved(amt);
		}

		goU(amt) {
			this.depth -= amt;
			this.animateIfMoved(amt);
		}

		initAnimation(ctx, subImg) {
			this.animState.ctx = ctx;
			this.animState.subImg = subImg;
			this.animState.cvs_size.x = ctx.canvas.clientWidth;
			this.animState.cvs_size.y = ctx.canvas.clientHeight;

			this.animState.scaleX = 1.0 / (subImg.width / this.animState.cvs_size.x * 8);
			this.animState.scaleY = this.animState.scaleX;

		}

		animate() {
			requestAnimationFrame(() => {
				const a = this.animState;
				a.ctx.fillStyle = 'lightcyan';
				a.ctx.fillRect(0, 0, a.cvs_size.x, a.cvs_size.y);
				a.ctx.drawImage(a.subImg, this.pos % a.cvs_size.x, this.depth % a.cvs_size.y,
					a.scaleX * a.subImg.width,
					a.scaleY * a.subImg.height);
			});
		}
	}


	let sub = new Submarine();

	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	canvas.style.display = 'initial';

	let subImg = new Image();
	subImg.src = '../assets/submarine.png';
	step(undefined);
	await subImg.decode();

	sub.initAnimation(ctx, subImg);

	for (command of input.split("\n")) {
		gauge(command);
		let [cmd, dist] = command.split(" ");
		dist = parseInt(dist);
		switch (cmd) {
			case "forward":
				sub.goF(dist); break;
			case "down":
				sub.goD(dist); break;
			case "up":
				sub.goU(dist); break;
		}
		await step(1);
	}

	showAnswer(sub.depth * sub.pos);
}