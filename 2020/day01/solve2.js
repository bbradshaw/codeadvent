async function solve2(input, step) {
    let roots = [];
    let seeked = {};
    for (line of input.split("\n")) {
        const thisInt = parseInt(line);
        if (seeked.hasOwnProperty(thisInt)) {
            const [a, b] = seeked[thisInt];
            log(`Found answer ${a} * ${b} * ${thisInt} = ${a * b * thisInt}`);
            showAnswer(a * b * thisInt);
            return;
        }
        for (r of roots) {
            if (r + thisInt < 2020) {
                seeked[2020 - (r + thisInt)] = [r, thisInt];
            }
        }
        roots.push(thisInt);

        try {
            await step();
        }
        catch {
            log("User cancelled");
            return;
        }
    }
}