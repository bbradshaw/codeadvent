async function solve1(input, step) {
    let grid = Grid.from_input(input);
    log(`parsed map of size ${[grid.width, grid.height]}`);

    let trees = 0;
    let x = 0;
    for (y = 0; y < grid.height; y += 1) {
        if (grid.at(x % grid.width, y) === "#") {
            trees += 1;
        }
        const currentScan = grid.map( (gx, gy, v) =>{
            if (gx === x % grid.width && gy === y){
                return v == "." ? 
                    "<span style='color:red'>O</span>" : 
                    "<span style='color:red'>X</span>";
            }
            return v;
        });
        gauge(`<pre>trees:${trees}, [x,y]: ${[x, y]}\n${currentScan.printable()}</pre>`);
        x += 3;
        try {
            await step();
        }
        catch {
            log("User cancelled");
            return;
        }
    }
    showAnswer(trees);
}
