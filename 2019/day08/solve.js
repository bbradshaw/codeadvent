const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').split("");
const [WIDTH, HEIGHT] = [25,6];

function * layerCounter(raw){
    for (let n = 0; n * WIDTH * HEIGHT < raw.length; n++){
        yield [n, raw.slice(n * WIDTH * HEIGHT, (n+1) * WIDTH * HEIGHT)];
    }
}

function one(problem){
    problem = problem.map(x => Number(x));
    let score = Infinity;
    let lowest = null;
    for (let [n, layer] of layerCounter(problem)){
        let count = layer.filter(pix => pix === 0).length;
        console.log(`LAYER ${n}: ${count} zeroes.`);
        if (count < score){
            score = count;
            lowest = layer;
        }
    }
    return lowest.filter(pix => pix === 1).length * lowest.filter(pix => pix === 2).length;
}

function render(layer){
    const graph = {0 : "#", 1 : ".",  2 : " "};
    //const graph = {0: "0", 1 : "1", 2: "2"};
    for (let r = 0; r < HEIGHT; r++){
        let row = layer.slice(r*WIDTH, (r+1)*WIDTH).map(pix => graph[pix]);
        process.stdout.write(row.join("") + "\n");
    }
    process.stdout.write("\n");
}

function two(problem){
    let final;
    problem = problem.map(x => Number(x));
    for (let [n, layer] of layerCounter(problem)){
        if (!final) final = layer;
        for (let i = 0; i < layer.length; i++){
            if (final[i] === 2)
                final[i] = layer[i];
        }
        console.log(` LAYER ${n}`);
        render(final);
    }
}

console.log(one(input));
two(input);