const fs = require('fs');
const readline = require('readline');
const process = require('process');

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  crlfDelay: Infinity
});

let valid_cnt = 0;

rl.on('line', (line) => {
    let [constraint, letter, password] = line.split(" ");
    letter = letter[0];
    let [lower, upper] = constraint.split("-");
    lower = parseInt(lower);
    upper = parseInt(upper);
    console.log(`lower = ${lower}, upper=${upper} letter=${letter}, password=${password}`);
    const count = password.split('').reduce((acc, c) => {c === letter ? acc++ : acc; return acc}, 0);
    console.log(`count = ${count}`);
    if ((count >= lower) && (count <= upper)){
        valid_cnt +=1
    }
});

rl.on('close', () => {
    console.log(`total is ${valid_cnt}`);
});