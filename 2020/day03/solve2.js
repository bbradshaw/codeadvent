const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt'),
    crlfDelay: Infinity
});

let map = [];

rl.on('line', (line) => {
    map.push(line.split(''));
});

rl.on('close', () => {
    const max_x = map[0].length;
    const max_y = map.length;

    const get_coordinate = (x, y) => {
        x = x % max_x;
        return map[y][x];
    };
    const trees_at_slope = (dx, dy) => {
        let trees = 0;
        let x = 0;
        for (y = 0; y < max_y; y += dy) {
            if (get_coordinate(x, y) === "#") {
                trees += 1;
            }
            x += dx;
        }
        return trees;
    };

    let answer = 1;
    for (let [dx, dy] of [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]) {
        answer *= trees_at_slope(dx, dy);
    };

    console.log(`The answer is ${answer}`);
});