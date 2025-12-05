async function solve1(input, step) {
    const data = input.trim().split(",")
        .map(l => {
            const [start, end] = l.split("-");
            return { start: parseInt(start), end: parseInt(end) };
        });
    let score = 0;
    const visualizer = new Visualizer(data);
    for (let i = 0; i < data.length; i++) {
        const { start, end } = data[i];
        for (let j = start; j <= end; j++) {
            let asStr = j.toString();
            if (asStr.length % 2 !== 0) {
                continue;
            }
            const [left, right] = [asStr.slice(0, asStr.length / 2), asStr.slice(asStr.length / 2)];
            if (left === right) {
                score += j;
                visualizer.mark(data[i], j, score);
            }
        }
        await visualizer.completeOne(data[i]);
        await step(1, data.length);
    }
    visualizer.animation_done = true;
    showAnswer(score);
};

const dataStr = (data) => `${data.start}-${data.end}`;

class Visualizer {
    constructor(data) {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.display = "block";
        this.size = { width: canvas.width, height: canvas.height };
        this.visualized_data = [];
        this.flying_numbers = [];
        this.animation_done = false;
        this.complete_one_done = null;
        this.last_flying_number_y = 0;
        let curPos = 50;
        this.score = 0;
        for (const item of data) {
            const visual_data = {
                top: curPos,
                bot: curPos + 28,
                value: item,
                animation: {
                    target: null,
                    start_pos: null,
                }
            };
            this.visualized_data.push(visual_data);
            curPos += 28;
        }
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.size.width, this.size.height);
        this.ctx.fillStyle = "black";
        this.visualized_data.forEach(data => {
            if (data.top + 28 > this.size.height) {
                return;
            }
            this.ctx.strokeRect(10, data.top, 200, 20);
            this.ctx.fillText(dataStr(data.value), 20, data.top + 10);
        });
        this.ctx.strokeRect(400, this.size.height / 2, 200, 25);
        this.ctx.fillText(`Score: ${this.score}`, 425, this.size.height / 2 + 15);
        this.ctx.fillStyle = "red";
        this.flying_numbers.forEach(number => {
            this.ctx.fillText(number.number.toString(), number.x, number.y);
        });
    }

    mark(starting_data, found_number, score) {
        const this_data = this.visualized_data.find(d => d.value.start === starting_data.start && d.value.end === starting_data.end);
        if (!this_data) {
            return;
        }
        this.flying_numbers.push({
            number: found_number,
            start_x: 200,
            x: 200,
            end_x: 450,
            start_y: this_data.top + 10 + this.last_flying_number_y,
            y: this_data.top + 10 + this.last_flying_number_y,
            end_y: this.size.height / 2 + 25,
            score: score,
            animated: {
                start_time: document.timeline.currentTime,
                end_time: document.timeline.currentTime + stepDelay*1.2,
            }
        });
        this.last_flying_number_y += 25;
    }

    async completeOne(_data) {
        for (const data of this.visualized_data) {
            if (dataStr(data.value) === dataStr(_data)) {
                data.animation.target = -28;
            } else {
                data.animation.target = data.top - 28;
            }
            data.animation.start_pos = data.top;
            data.animation.start_time = document.timeline.currentTime;
            data.animation.end_time = document.timeline.currentTime + stepDelay;
        }
        return new Promise(async (resolve) => {
            this.complete_one_done = () => {
                this.last_flying_number_y = 0;
                this.visualized_data = this.visualized_data.filter(d => d.top + 28 > 0);
                resolve();
            }
        });
    }

    animate(time) {
        for (const data of this.visualized_data) {
            if (data.animation.target === null) {
                continue;
            }
            const animated_progress = Math.min(1, (time - data.animation.start_time) / (data.animation.end_time - data.animation.start_time));
            const pixel_move = (data.animation.target - data.animation.start_pos) * animated_progress;
            data.top = data.animation.start_pos + pixel_move;
            if (animated_progress === 1) {
                data.animation.target = null;
                if (this.complete_one_done) {
                    this.complete_one_done();
                    this.complete_one_done = null;
                }
            }
        }
        this.flying_numbers = this.flying_numbers.filter(number => {
            const animated_progress = Math.min(1, (time - number.animated.start_time) / (number.animated.end_time - number.animated.start_time));
            const x_pixel_move = (number.end_x - number.start_x) * animated_progress;
            number.x = number.start_x + x_pixel_move;
            const y_pixel_move = (number.end_y - number.start_y) * animated_progress;
            number.y = number.start_y + y_pixel_move;
            if (animated_progress === 1) {
                this.score = number.score;
                return false;
            }
            return true;
        });
        this.draw();

        if (!this.animation_done) {
            requestAnimationFrame(this.animate.bind(this));
        }
    }
}