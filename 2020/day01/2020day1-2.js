const fs = require('fs');
const readline = require('readline');
const process = require('process');

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  crlfDelay: Infinity
});

let roots = [];
let seeked = {};

rl.on('line', (line) => {
  const thisInt = parseInt(line);
  if (seeked.hasOwnProperty(thisInt)) {
    const [a,b] = seeked[thisInt];
    console.log(`Found answer ${a} * ${b} * ${thisInt} = ${a * b * thisInt}`);
    process.exit(0);
  }
  for (r of roots){
    if (r + thisInt < 2020){
      seeked[2020 - (r + thisInt)] = [r, thisInt];
    }
  }
  roots.push(thisInt);
});