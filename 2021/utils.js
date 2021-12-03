class UserCancelError extends Error {

}

function modulo(a, n) {
    return ((a % n) + n) % n;
}

class Grid {
    constructor(d2array) {
        this.d2array = d2array;
        this.width = this.d2array[0].length;
        this.height = this.d2array.length;
    }

    static from_input(raw) {
        let d2array = [];
        for (const row of raw.split("\n")) {
            d2array.push(row.split(''));
        }
        return new Grid(d2array);
    }

    outofbounds(x, y) {
        if (x >= this.width || x < 0) return `x = ${x} out of bounds 0 - ${this.width}`;
        if (y >= this.height || y < 0) return `y = ${y} out of bounds 0 - ${this.height}`
    }

    at(x, y) {
        const bounds = this.outofbounds(x, y);
        if (bounds) throw new Error(bounds);
        return this.d2array[y][x];
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
}

class Navigation {
    constructor() {
        this.actors = [];
        this.bounds_x = [0, 0];
        this.bounds_y = [0, 0];
    }

    new_actor(name) {
        const id = this.actors.length;
        this.actors.push({ name, position: Navigation.ORIGIN, id });
        return id;
    }

    static get ORIGIN() {
        return [0, 0]
    }

    static get WEST() { return [-1, 0] }
    static get EAST() { return [1, 0] }
    static get NORTH() { return [0, 1] }
    static get SOUTH() { return [0, -1] }

    move_by_vec(actor_id, vec) {
        const actor = this.actors[actor_id];
        actor.position[0] += (vec.direction[0] * vec.magnitude);
        actor.position[1] += (vec.direction[1] * vec.magnitude);
        this._expand_bounds(actor.position);
        return actor.position;
    }

    _expand_bounds(position) {
        if (Math.max(position[0]) < this.bounds_x[0]) this.bounds_x[0] = position[0];
        if (Math.max(position[0]) > this.bounds_x[1]) this.bounds_x[1] = position[0];
        if (Math.max(position[1]) < this.bounds_y[0]) this.bounds_y[0] = position[1];
        if (Math.max(position[1]) > this.bounds_y[1]) this.bounds_y[1] = position[1];
    }

    get_position(actor_id) {
        return this.actors[actor_id].position;
    }

    set_position(actor_id, new_position) {
        this.actors[actor_id].position = new_position;
    }

    relative_vec(actor1, actor2) {
        return {
            magnitude: 1, direction:
                [this.actors[actor1].position[0] - this.actors[actor2].position[0],
                this.actors[actor1].position[1] - this.actors[actor2].position[1]]
        }
    }

    manhattan(actor_id_or_pos1, actor_id_or_pos2) {
        let pos1, pos2;
        if (actor_id_or_pos1 instanceof Array)
            pos1 = actor_id_or_pos1;
        else
            pos1 = this.actors[actor_id_or_pos1].position;
        if (actor_id_or_pos2 instanceof Array)
            pos2 = actor_id_or_pos2;
        else
            pos2 = this.actors[actor_id_or_pos2].position;

        return Math.abs(pos2[0] - pos1[0]) + Math.abs(pos2[1] - pos1[1]);
    }
}

function newCounter(){
    return new Proxy({}, {
        get: (obj, prop) => (prop in obj) ? obj[prop] : 0
    });
}

function sum(arr){
    return arr.reduce( (acc, n) => acc+n, 0);
}