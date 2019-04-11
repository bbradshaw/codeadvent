import os, itertools, re, collections
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()
TEST_INPUT = """.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.""".splitlines()

class Grid:
    def __init__(self, grid, height, width):
        self.grid = grid
        self.height = height
        self.width = width

    @classmethod
    def from_str(cls, raw):
        grid = {}
        for y, line in enumerate(raw):
            for x, char in enumerate(line.strip()):
                grid[x,y] = char
        height = y + 1
        width = x + 1
        return cls(grid, height, width)

    def adjacent(self, coord, diag = False):
        x,y = coord
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        if diag:
            directions += [(-1, -1), (-1, 1), (1, 1), (1, -1)]
        for dx, dy in directions:
            if 0 <= x + dx < self.width:
                if 0 <= y + dy < self.height:
                    yield ((x+dx, y+dy))
    
    def all_points(self):
        for (x,y) in itertools.product(range(self.width), range(self.height)):
            yield (x, y, self.grid[x,y])
    
    def print(self):
        for y in range(self.height):
            for x in range(self.width):
                print(self.grid[x,y], end='')
            print()
        
    def get(self, x, y):
        return self.grid[x,y]

def solve1(prob):
    cur_state = Grid.from_str(prob)
    def count_adjacent(x,y,c):
        return sum(1 for coord in cur_state.adjacent((x,y)) if cur_state.grid[coord] == c)
    for rnd in range(1,11):
        next_state = {}
        for (x,y,sq) in cur_state.all_points():
            tree_cnt = count_adjacent(x,y,"|")
            ly_cnt = count_adjacent(x,y,"#")
            if sq == ".":
                if tree_cnt > 2:
                    next_state[x,y] = "|"
                else:
                    next_state[x,y] = "."
            elif sq == "|":
                if ly_cnt > 2:
                    next_state[x,y] = "#"
                else:
                    next_state[x,y] = "|"
            elif sq == "#":
                if ly_cnt > 0 and tree_cnt > 0:
                    next_state[x,y] = "#"
                else:
                    next_state[x,y] = "."
        cur_state = Grid(next_state, cur_state.height, cur_state.width)
        print(rnd)
        cur_state.print()
    ly = sum(1 for _,_,sq in cur_state.all_points() if sq == "#")
    tree = sum(1 for _,_,sq in cur_state.all_points() if sq == "|")
    return tree * ly

def solve2(prob):
    cur_state = Grid.from_str(prob)
    last = 0
    def count_adjacent(x,y,c):
        return sum(1 for coord in cur_state.adjacent((x,y)) if cur_state.grid[coord] == c)
    for rnd in range(1,1000):
        next_state = {}
        for (x,y,sq) in cur_state.all_points():
            tree_cnt = count_adjacent(x,y,"|")
            ly_cnt = count_adjacent(x,y,"#")
            if sq == ".":
                if tree_cnt > 2:
                    next_state[x,y] = "|"
                else:
                    next_state[x,y] = "."
            elif sq == "|":
                if ly_cnt > 2:
                    next_state[x,y] = "#"
                else:
                    next_state[x,y] = "|"
            elif sq == "#":
                if ly_cnt > 0 and tree_cnt > 0:
                    next_state[x,y] = "#"
                else:
                    next_state[x,y] = "."
        cur_state = Grid(next_state, cur_state.height, cur_state.width)
        ly = sum(1 for _,_,sq in cur_state.all_points() if sq == "#")
        tree = sum(1 for _,_,sq in cur_state.all_points() if sq == "|")
        if tree == 548:
            print(f"{rnd}: ly:{ly} tree:{tree} (+{rnd - last}")
            last = rnd
            

    return tree * ly

print(solve1(INPUT))
# print(solve2(INPUT))