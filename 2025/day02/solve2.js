async function solve2(input, step) {
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
            const half = Math.ceil(asStr.length / 2);
            for (let k = 1; k <= half; k++) {
                if (asStr.length % k !== 0) {
                    continue;
                }
                const mult = Math.max(2, asStr.length / k);
                const frag = asStr.slice(0, k);
                const search = new RegExp(`^(${frag}){${mult}}$`, "g");
                if (search.test(asStr)) {
                    score += j;
                    visualizer.mark(data[i], j, score);
                    break;
                }
            }
        }
        await visualizer.completeOne(data[i]);
        await step(1, data.length);
    }
    visualizer.animation_done = true;
    showAnswer(score);
};