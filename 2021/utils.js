class UserCancelError extends Error {

}

function gcd(a, b) {
    var R;
    while ((a % b) > 0) {
        R = a % b;
        a = b;
        b = R;
    }
    return b;
}

function modulo(a, n) {
    return ((a % n) + n) % n;
}

function set_diff(s1, s2) {
    s1 = new Set(s1);
    s2 = new Set(s2);
    return new Set([...s1].filter(x => !s2.has(x)));
}

function set_union(s1, s2) {
    return new Set([...s1, ...s2]);
}

function set_intersect(s1, s2) {
    s1 = new Set(s1);
    s2 = new Set(s2);

    return new Set([...s1].filter(x => s2.has(x)));
}

function memod_coord2d_fn(fn) {
    let pos_cache = {};

    return function (x, y) {
        let rs;
        if (pos_cache[x] && (rs = pos_cache[x][y]))
            return rs;
        else {
            rs = fn.bind(this)(x,y);
            if (!pos_cache[x])
                pos_cache[x] = {};
            pos_cache[x][y] = rs;
            return rs;
        }
    };
}

class Grid {
    constructor(d2array) {
        this.d2array = d2array;
        this.width = this.d2array[0].length;
        this.height = this.d2array.length;
        this.outofbounds = memod_coord2d_fn(this._outofbounds).bind(this);
    }

    static from_input(raw, row_split, char_split) {
        let d2array = [];
        row_split = row_split == null ? "\n" : row_split;
        char_split = char_split == null ? "" : char_split;

        for (const row of raw.split(row_split)) {
            d2array.push(row.split(char_split));
        }
        return new Grid(d2array);
    }

    _outofbounds(x, y) {
        if (x >= this.width || x < 0) return `x = ${x} out of bounds 0 - ${this.width}`;
        if (y >= this.height || y < 0) return `y = ${y} out of bounds 0 - ${this.height}`
    }

    at(x, y) {
        const bounds = this.outofbounds(x, y);
        if (bounds) throw new Error(bounds);
        return this.d2array[y][x];
    }

    set(x, y, val) {
        const bounds = this.outofbounds(x, y);
        if (bounds) throw new Error(bounds);
        this.d2array[y][x] = val;
    }

    neighbors(x, y, diagonal) {
        diagonal = !!diagonal;

        let neighbors = [];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            if (!this.outofbounds(x + dx, y + dy))
                neighbors.push([dx + x, dy + y]);
        }
        if (!diagonal) return neighbors;
        for (const [dx, dy] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            if (!this.outofbounds(x + dx, y + dy))
                neighbors.push([dx + x, dy + y]);
        }
        return neighbors;
    }

    static async a_star(start, finish, costFn, heuristicFn, neighborFn, callbackFn) {
        const pos = memod_coord2d_fn((coords) => `${coords[0]},${coords[1]}`);
        const getScore = (map, key) => {
            const s = map.get(key);
            return s === undefined ? Infinity : s;
        };
        let stack = [start];
        let route = new Map();

        let pathScores = new Map();
        pathScores.set(pos(start), 0);
        let heuristicScores = new Map();
        heuristicScores.set(pos(start), heuristicFn(start, finish));

        while (stack.length) {
            stack.sort((a, b) => getScore(heuristicScores, pos(b)) - getScore(heuristicScores, pos(a)));
            let current = stack.pop();
            if (callbackFn !== undefined) await callbackFn(current);
            if (pos(current) === pos(finish)) {
                let winningPath = [];
                while (current != undefined) {
                    winningPath.push(current)
                    current = route.get(pos(current));
                }
                return winningPath.reverse();
            }

            for (let candidate of neighborFn(current)) {
                let score = getScore(pathScores, pos(current)) + costFn(current, candidate);
                if (heuristicFn(current, finish) > costFn(current, candidate) + heuristicFn(candidate, finish)) throw new Error("non monotonic heuristic detected!");
                if (score < getScore(pathScores, pos(candidate))) {
                    route.set(pos(candidate), current);
                    pathScores.set(pos(candidate), score);
                    heuristicScores.set(pos(candidate), score + heuristicFn(candidate, finish));
                    if (!stack.map(pos).includes(pos(candidate)))
                        stack.push(candidate);
                }
            }
        }
    }

    printable() {
        return this.d2array.map(r => r.join("")).join("\n");
    }

    map(fn) {
        let newArray = [];
        for (let y = 0; y < this.height; y++) {
            let newRow = [];
            for (let x = 0; x < this.width; x++) {
                newRow.push(fn(x, y, this.at(x, y)));
            }
            newArray.push(newRow);
        }
        return new Grid(newArray);
    }

    *[Symbol.iterator]() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                yield [x, y, this.at(x, y)]
            }
        }
    }
}

class Navigation {
    constructor() {
        this.bounds_x = [0, 0];
        this.bounds_y = [0, 0];
    }

    static get ORIGIN() {
        return [0, 0]
    }

    static get WEST() { return [-1, 0] }
    static get EAST() { return [1, 0] }
    static get NORTH() { return [0, 1] }
    static get SOUTH() { return [0, -1] }

    move_by_vec(start, vec) {
        let pos = [...start];
        pos[0] += (vec.direction[0] * vec.magnitude);
        pos[1] += (vec.direction[1] * vec.magnitude);
        this._expand_bounds(pos);
        return pos;
    }

    _expand_bounds(position) {
        if (position[0] < this.bounds_x[0]) this.bounds_x[0] = position[0];
        if (position[0] > this.bounds_x[1]) this.bounds_x[1] = position[0];
        if (position[1] < this.bounds_y[0]) this.bounds_y[0] = position[1];
        if (position[1] > this.bounds_y[1]) this.bounds_y[1] = position[1];
    }

    static relative_vec(pos1, pos2) {
        let dx = pos2[0] - pos1[0];
        let dy = pos2[1] - pos1[1];
        const div = gcd(Math.abs(dx), Math.abs(dy));
        if (div == 0) {
            dx = dx / (Math.abs(dx) || 1);
            dy = dy / (Math.abs(dy) || 1);
        }
        else {
            dx = dx / div;
            dy = dy / div;
        }

        return {
            magnitude: 1, direction: [dx, dy]
        }
    }

    static equal_pos(pos1, pos2) {
        return pos1[0] === pos2[0] && pos1[1] === pos2[1]
    }

    trace_line(start, end) {
        let move_vec = this.constructor.relative_vec(start, end);
        let current = [...start];
        let line = [[...start]]
        while (!this.constructor.equal_pos(current, end)) {
            const next = this.move_by_vec(current, move_vec);
            line.push(next);
            current = next;
        }
        return line;
    }

    static manhattan(pos1, pos2) {
        return Math.abs(pos2[0] - pos1[0]) + Math.abs(pos2[1] - pos1[1]);
    }
}

function newCounter() {
    return new Proxy({}, {
        get: (obj, prop) => (prop in obj) ? obj[prop] : 0
    });
}

function sum(arr) {
    return arr.reduce((acc, n) => acc + n, 0);
}

function triangular_n(n) {
    return (n * n + n) / 2
}

function* permute2(arr) {
    for (let i = 0; i < arr.length - 1; i++)
        for (let j = i + 1; j < arr.length; j++)
            yield [arr[i], arr[j]]
}

function assert(bool, msg) {
    if (!bool)
        throw new Error(`Assertion failed: '${msg}'`)
}

function lineMatch(txt1, txt2){
    let cnt1 = newCounter();
    let cnt2 = newCounter();

    txt1.split("\n").forEach( l => cnt1[l]++);
    txt2.split("\n").forEach( l => cnt2[l]++);
    
    keys = set_union(Object.keys(cnt1), Object.keys(cnt2));

    buffer = []
    for (key of keys.values()){
        if (cnt1[key] !== cnt2[key]){
            buffer.push(`'${key}': A:${cnt1[key]} times, B: ${cnt2[key]} times`);
        }
    }
    if (buffer.length > 0)
        throw new Error("differences"+buffer.join("\n"));

}