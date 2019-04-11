import os, itertools, collections
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).read().strip()
TEST_INPUT = "^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$"
#TEST_INPUT = "^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$"
DIRECTIONS = {"N" : (0, -1), "E": (1, 0), "S" : (0, -1), "W" : (-1, 0)}

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):
        if isinstance(other, tuple):
            x = other[0]
            y = other[1]
        else:
            x = other.x
            y = other.y
        return Point(self.x + x, self.y + y)
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def in_directions(self, directions):
        return [self+dir for dir in directions]
    
    def __hash__(self):
        return hash((self.x, self.y))

    def manhattan(self, other):
        return abs(self.x - other.x) + abs(self.y - other.y)


def get_doors(prob):
    ends = [Point(0,0)]
    doors = collections.defaultdict(set)
    start_stack = []
    end_stack = []
    for char in prob:
        if char == "(":
            start_stack.append(ends[:])
            end_stack = []
        elif char == "|":
            end_stack.extend(ends[:])
            ends = start_stack[-1]
        elif char == ")":
            start_stack.pop()
            ends.extend(end_stack)
        elif char in DIRECTIONS:
            for pt in ends:
                doors[pt].add(char)
            ends = [pt + Point(*DIRECTIONS[char]) for pt in ends]               
    return doors

def create_distance_map(start, get_adjacent):
    unvisited = [start]
    dist = {start: 0}
    while unvisited:
        cur = unvisited.pop()
        next_dist = dist[cur] + 1
        for neighbor in get_adjacent(cur):
            if neighbor in dist and dist[neighbor] <= next_dist:
                continue
            if neighbor not in unvisited:
                unvisited.append(neighbor)
            dist[neighbor] = next_dist
    return dist
        
def solve1(prob):
    prob = prob.translate(str.maketrans(dict.fromkeys("^$")))
    doors = get_doors(prob)
    dist = create_distance_map(Point(0,0), 
        lambda pt: pt.in_directions(delta for desc, delta in DIRECTIONS.items() if desc in doors[pt]))
    return max(dist.values())

print(solve1(INPUT))