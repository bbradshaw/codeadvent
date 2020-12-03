const fs = require('fs');
const readline = require('readline');
const process = require('process');

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  crlfDelay: Infinity
});

let paired = new Set();

rl.on('line', (line) => {
  const thisInt = parseInt(line);
  if (paired.has(thisInt)){
      const matched = 2020 - thisInt;
      console.log(`found answer ${thisInt} * ${matched} = ${thisInt * matched}`);
      process.exit(0);
  }
  paired.add(2020-thisInt);
});