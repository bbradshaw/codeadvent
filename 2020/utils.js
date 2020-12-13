class UserCancelError extends Error {

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

outofbounds(x, y){
    if (x >= this.width || x < 0) return `x = ${x} out of bounds 0 - ${this.width}`;
    if (y >= this.height || y < 0) return `y = ${y} out of bounds 0 - ${this.height}`
}

at(x, y){
    const bounds = this.outofbounds(x, y);
    if (bounds) throw new Error(bounds);
    return this.d2array[y][x];
}

neighbors(x, y, diagonal){
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

printable(){
    return this.d2array.map(r => r.join("")).join("\n");
}

map(fn){
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