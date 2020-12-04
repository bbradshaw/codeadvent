
const visualize = ({grid, dx, dy, x, y, trees}) => {
    const currentScan = grid.map( (gx, gy, v) =>{
        if (gx === x % grid.width && gy === y){
            return v == "." ? 
                "<span style='color:red'>O</span>" : 
                "<span style='color:red'>X</span>";
        }
        return v;
    });
    gauge(`<pre>slope:${dy} / ${dx} trees:${trees}, [x,y]: ${[x, y]}\n${currentScan.printable()}</pre>`);
}

const trees_at_slope = async (grid, dx, dy, step) => {
    let trees = 0;
    let x = 0;
    for (y = 0; y < grid.height; y += dy) {
        if (grid.at(x % grid.width, y) === "#") {
            trees += 1;
        }
        x += dx;
        visualize({grid, dx, dy, x, y, trees});
        try {
            await step();
        }
        catch {
            log("User cancelled");
            return;
        }
    }
    return trees;
};

async function solve2(input, step) {
    let grid = Grid.from_input(input);
    log(`parsed map of size ${[grid.width, grid.height]}`);

    let answer = 1;
    for (let [dx, dy] of [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]) {
        answer *= await trees_at_slope(grid, dx, dy, step);
    };
    showAnswer(answer);
}
