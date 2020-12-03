function solve1(input) {
    let paired = new Set();
    for (line of input.split("\n")) {
        const thisInt = parseInt(line);
        if (paired.has(thisInt)) {
            const matched = 2020 - thisInt;
            log(`found answer ${thisInt} * ${matched} = ${thisInt * matched}`);
            showAnswer(thisInt * matched);
            break;
        }
        paired.add(2020-thisInt);
    }

}