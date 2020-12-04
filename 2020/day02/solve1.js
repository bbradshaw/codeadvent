async function solve1(input) {
    let valid_cnt = 0;
    for (line of input.split("\n")) {
        let [constraint, letter, password] = line.split(" ");
        letter = letter[0];
        let [lower, upper] = constraint.split("-");
        lower = parseInt(lower);
        upper = parseInt(upper);
        
        const count = password.split('').reduce((acc, c) => { c === letter ? acc++ : acc; return acc }, 0);
        if ((count >= lower) && (count <= upper)) {
            valid_cnt += 1;
            password = `<span style='color:green'>${password}</span>`;
        }
        else
            password = `<span style='color:red'>${password}</span>`;
        gauge(`lower = ${lower}, upper=${upper} letter=${letter}, password=${password}`);

        try {
            await step();
        }
        catch {
            log("User cancelled");
            return;
        }
    }
    showAnswer(valid_cnt);
}