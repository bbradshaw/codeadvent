
function checkIncrementing(n){
    if ( typeof checkIncrementing.decrements == 'undefined' ) {
        checkIncrementing.decrements = new Map();
        for (let j = 0; j < 10; j++){
            checkIncrementing.decrements[j] = [];
            for (let k = 0; k < j; k++)
                checkIncrementing.decrements[j].push(k);
        }
    }

    const s = n.toString();
    for (let i = 0; i < s.length; i++){
        const check = s.substr(i+1);
        const digit = s[i];
        if (checkIncrementing.decrements[digit].some(x => check.includes(x)))
            return false;
    }
    return true;
}

function twoButNotThree(n){
    const s = n.toString();
    const twoNotThree = /(.)\1(?!\1)/g;
    let m;
    while (true){
        m = twoNotThree.exec(s);
        if (m === null)
            return false;
        if (s[m.index - 1] !== m[1])
            return true;
    }
}

function one(problem){
    const [low, high] = problem.split("-").map(n => Number(n));
    const matches = [];
    for (let i = low; i <= high; i++)
        if (/(.)\1/.test(i) && checkIncrementing(i))
            matches.push(i)
    return matches.length;
}

function two(problem){
    const [low, high] = problem.split("-").map(n => Number(n));
    const matches = [];
    for (let i = low; i <= high; i++)
        if (twoButNotThree(i) && checkIncrementing(i))
            matches.push(i)
    return matches.length;
}

console.log(one("264360-746325"));
console.log(two("264360-746325"));