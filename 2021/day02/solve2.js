

async function solve2(input, step) {
	class Submarine {
		SCALE_FACTOR = 9;

		constructor() {
			this.depth = 0;
			this.pos = 0;
			this.aim = 0;
			this.animState = {
				ctx: null,
				subImg: null,
				dirty: true,
				cvs_size: { x: null, y: null },
				scaleX: 0,
				scaleY: 0
			};
		}

		goF(amt) {
			this.depth += amt * this.aim;
			this.pos += amt;
			this.animateIfMoved(amt);
		}

		goD(amt) {
			this.aim += amt;
			this.animateIfMoved(amt);
		}

		goU(amt) {
			this.aim -= amt;
			this.animateIfMoved(amt);
		}
		
		initAnimation(ctx, subImg) {
			this.animState.ctx = ctx;
			this.animState.subImg = subImg;
			this.animState.cvs_size.x = ctx.canvas.clientWidth;
			this.animState.cvs_size.y = ctx.canvas.clientHeight;

			this.animState.scaleX = 1.0 / (subImg.width / this.animState.cvs_size.x * this.SCALE_FACTOR);
			this.animState.scaleY = this.animState.scaleX;
			this.animState.ctx.font= "12px sans-serif";

		}

		animateIfMoved(amt) {
			if (!this.animState.ctx || !this.animState.subImg)
				return;
			if (amt > 0)
				this.animState.dirty = true;
			if (this.animState.dirty)
				this.animate();
		}

		animate() {
			requestAnimationFrame(() => {
				const a = this.animState;
				a.ctx.fillStyle = 'lightcyan';
				a.ctx.fillRect(0, 0, a.cvs_size.x, a.cvs_size.y);
				const [ scaledX, scaledY ] = [a.scaleX * a.subImg.width, a.scaleY * a.subImg.height]
				let angle = Math.atan(this.aim);
				let [ ctr_x, ctr_y ] = [(this.pos*a.scaleX + scaledX) % a.cvs_size.x, (this.depth*a.scaleY + scaledY) % a.cvs_size.y];
				a.ctx.translate(ctr_x, ctr_y);
				a.ctx.rotate(angle);
				
				a.ctx.drawImage(a.subImg, -scaledX / 2, -scaledY / 2,
					scaledX,
					scaledY);
				a.ctx.setTransform(1, 0, 0, 1, 0, 0);

				a.ctx.fillStyle = 'black';
				a.ctx.fillText(`Sub Depth: ${this.depth}`, 5, 20);
				
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