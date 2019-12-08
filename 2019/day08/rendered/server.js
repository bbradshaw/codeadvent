const express = require('express');
const app = express();
const port = 3000;
const [WIDTH, HEIGHT] = [25,6];

function * layerCounter(raw){
    for (let n = 0; n * WIDTH * HEIGHT < raw.length; n++){
        yield [n, raw.slice(n * WIDTH * HEIGHT, (n+1) * WIDTH * HEIGHT)];
    }
}

function getLayers(){
    const fs = require('fs');
    const input = fs.readFileSync('../input.txt', 'utf8').split("").map(x => Number(x));

    let layers = new Map();
    let final;
    for (let [n, layer] of layerCounter(input)){
        if (!final) final = layer;
        for (let i = 0; i < layer.length; i++){
            if (final[i] === 2)
                final[i] = layer[i];
        }
        layers[n] = [[...layer], [...final]];
    }
    return layers;
}

const layers = getLayers();
app.use((req, res, next) => {
    console.log(new Date(), req.url);
    next();
});
app.use("/", express.static(__dirname));
app.get("/layer/:layerID", (req, res) => {
    res.send(JSON.stringify(layers[req.params.layerID]))
    });
app.listen(port, ()=> console.log("listening."));
