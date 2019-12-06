const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').split('\n');
/*const input = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`.split("\n");*/

class SpaceObject{
    constructor(name, orbits){
        this.name = name;
        this.orbits = orbits;
    }

    static fromLine(txt){
        let [o,n] = txt.split(")");
        return new SpaceObject(n, o);
    }
}

class leafFinder{
    constructor(tree){
        this.tree = tree;
        this.map = new Map();
    }

    get(name){
        if (!this.map.has(name))
            for (let o of this.tree)
                if (o.name === name)
                    this.map[name] = o;
        return this.map[name];
    }
}

function createTree(problem){
    let tree = [new SpaceObject("COM", null)];
    for (let line of problem){
        tree.push(SpaceObject.fromLine(line));
    }
    return tree;
}

function getParents(lookup, start){
    let cur = lookup.get(start);
    let path = [];
    while (cur.orbits !== null){
        cur = lookup.get(cur.orbits);
        path.push(cur);
    }
    return path;
}

function one(problem){
    let tree = createTree(problem);
    let lookup = new leafFinder(tree);
    let sum = 0;
    let scores = new Map();
    for (let obj of tree){
        let subtotal = 0;
        while (obj.orbits != null){
            subtotal += 1;
            obj = lookup.get(obj.orbits);
            if (scores.has(obj.name)){
                subtotal += scores[obj.name];
                break;
            }
        }
        scores[obj.name] = subtotal;
        sum += subtotal;
    }
    return sum;
}

function two(problem){
    let lookup = new leafFinder(createTree(problem));
    const santa_path = getParents(lookup, "SAN").map(x => x.name);
    const you_path = getParents(lookup, "YOU").map(x => x.name);
    const common_names = santa_path.filter(x => you_path.includes(x));
    let total_distance = 0;
    let cur = lookup.get("YOU");
    while (!common_names.includes(cur.orbits)){
        console.log(cur.name);
        total_distance += 1;
        cur = lookup.get(cur.orbits);
        //console.log(`distance ${total_distance} moving to ${cur.name}`);
    }
    cur = lookup.get("SAN");
    while (!common_names.includes(cur.orbits)){
        console.log(cur.name);
        total_distance += 1;
        cur = lookup.get(cur.orbits);
        //console.log(`distance ${total_distance} moving to ${cur.name}`);
    }
    return total_distance;
}

console.log(one(input));
//console.log(two(input));