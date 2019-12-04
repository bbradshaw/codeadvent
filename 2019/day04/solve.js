
function checkIncrementing(n){
    const s = n.toString();
    if ( typeof checkIncrementing.banned == 'undefined' ) {
        checkIncrementing.banned = new Map();
        for (let j = 0; j < 10; j++){
            checkIncrementing.banned[j] = [];
            for (let k = 0; k < j; k++)
                checkIncrementing.banned[j].push(k);
        }
    }
    for (let i = 1; i < s.length; i++){
        const first = s.substring(0,i);
        const second = s.substr(i);
        const high = Math.max(...first);
        if (checkIncrementing.banned[high].some(x => second.includes(x)))
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

//console.log(one("264360-746325"));
console.log(two("264360-746325"));