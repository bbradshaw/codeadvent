const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');
//const input = [12,14,1969,100756];

function one(input){
    let answers = [];
    for (let n of input){
        const result = Math.floor(n / 3) - 2;
        answers.push(result);
    }
    const sum = answers.reduce((acc, v) => acc+v,0);
    console.log(`The sum is ${sum}.`);
}

function two(input){
    let answers = [];
    for (let n of input){
        let sum = 0;
        while (true){
            n = Math.floor(n / 3) - 2;
            if (n < 0)
                break
            sum += n;
        }
        answers.push(sum);
    }
    const sum = answers.reduce((acc, v) => acc+v,0);
    console.log(`The sum is ${sum}.`);
}

one(input);
two(input);