const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').split('\n');

//const input = ["R75,D30,R83,U83,L12,D49,R71,U7,L7", "U62,R66,U55,R34,D71,R55,D58,R83"];

function segments(directions){
    let horizontal = [];
    let vertical = [];
    let [x, y] = [0,0];
    for (move of directions.split(",")){
        const dir = move[0];
        const amount = parseInt(move.substr(1));
        let [new_x, new_y] = [0,0];
        switch (dir){
            case "R":
                new_x = x + amount;
                horizontal.push({'fixed' : y, 'low': x, 'high' : new_x})
                x = new_x;
                break;
            case "L":
                new_x = x - amount;
                horizontal.push({'fixed' : y, 'low': new_x, 'high' : x})
                x = new_x;
                break;
            case "U":
                new_y = y + amount;
                vertical.push({'fixed' : x, 'low': y, 'high' : new_y});
                y = new_y;
                break;
            case "D":
                new_y = y - amount;
                vertical.push({'fixed' : x, 'low': new_y, 'high' : y});
                y = new_y;
                break;
        }
    }
    return [horizontal, vertical];
}

function distances(directions){
    let [x,y] = [0,0];
    let distances = new Map();
    let dist = 0;
    for (move of directions.split(",")){
        const dir = move[0];
        const amount = parseInt(move.substr(1));
        let cur_x, cur_y;
        for (let i = 0; i <= amount; i++){
            switch (dir){
                case "R":
                    cur_x = x+i;
                    cur_y = y;
                    break;
                case "L":
                    cur_x = x-i;
                    cur_y = y;
                    break;
                case "U":
                    cur_x = x;
                    cur_y = y+i;
                    break;
                case "D":
                    cur_x = x;
                    cur_y = y-i;
                    break;
            }
            const cur_pt_key = ptKey([cur_x, cur_y]);
            if (!Array.from(distances.keys()).includes(cur_pt_key))
                distances[cur_pt_key] = dist;
            dist++;
        }
        dist--;
        x = cur_x;
        y = cur_y;
    }
    return distances;
}

function findIntersections(vert, horiz){
    let results = [];
    for (const segment_vert of vert){
        for (const segment_horiz of horiz){
            if (segment_vert.fixed > segment_horiz.low && segment_vert.fixed < segment_horiz.high &&
                    segment_horiz.fixed > segment_vert.low && segment_horiz.fixed < segment_vert.high)
                results.push([segment_vert.fixed, segment_horiz.fixed]);
        }
    }
    return results;
}

function lowestByFn(pts, eval_fn){
    let record = Number.POSITIVE_INFINITY;
    let score;
    for (const pt of pts){
        score = eval_fn(pt);
        if (score < record){
            record = score;
        }
    }
    return record;
}

function ptKey(pt){
    return `[${pt[0]},${pt[1]}]`;
}

function one(problem){
    const a = segments(problem[0]);
    const b = segments(problem[1]);
    const intersections = findIntersections(a[1], b[0]).concat(findIntersections(b[1], a[0]));
    const closest = lowestByFn(intersections, pt => Math.abs(pt[0]) + Math.abs(pt[1]));
    return closest;
}


function two(problem){
    const a = segments(problem[0]);
    const b = segments(problem[1]);
    const a_distances = distances(problem[0]);
    const b_distances = distances(problem[1]);
    const intersections = findIntersections(a[1], b[0]).concat(findIntersections(b[1], a[0]));
    const closest = lowestByFn(intersections, pt => a_distances[ptKey(pt)] + b_distances[ptKey(pt)]);
    return closest;

}

console.log(one(input));
console.log(two(input));