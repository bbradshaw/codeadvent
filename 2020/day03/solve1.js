function display_forest (forest, hilite){
    hilited = [...forest];
    hilited_row = [...hilited[hilite[1]]];
    let new_char = hilited_row[hilite[0]] == '.' ? 
        "<span style='color:red'>O</span>" : 
        "<span style='color:red'>X</span>";
    hilited_row[hilite[0]] = new_char;
    hilited[hilite[1]] = hilited_row;
    return hilited.map(r=> r.join("")).join("\n");
}

async function solve1(input, step) {
    let map = [];

    for (line of input.split("\n")) {
        map.push(line.split(''));
    }
    const max_x = map[0].length;
    const max_y = map.length;
    log(`parsed map of size ${[max_x, max_y]}`);
    const get_coordinate = (x, y) => {
        x = x % max_x;
        return map[y][x];
    };

    let trees = 0;
    let x = 0;
    for (y = 0; y < max_y; y += 1) {
        if (get_coordinate(x, y) === "#") {
            trees += 1;
        }
        gauge(`<pre>trees:${trees}, [x,y]: ${[x, y]}\n${display_forest(map, [x%max_x,y])}</pre>`);
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
