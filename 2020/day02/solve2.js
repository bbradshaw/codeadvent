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
    let [first, second] = constraint.split("-");
    first = parseInt(first);
    second = parseInt(second);
    let matches = 0;
    if (password[first-1] == letter) matches++;
    if (password[second-1] == letter) matches++;

    if (matches === 1)
        valid_cnt +=1
});

rl.on('close', () => {
    console.log(`total is ${valid_cnt}`);
});