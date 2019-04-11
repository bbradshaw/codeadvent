class Grid:
    import itertools
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

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

    def in_directions(self, directions):
        for dir in directions:
            return self + dir

def a_star(start, finish, get_adjacent, distance_est):
    MAX = 10_000
    dist = {start: 0}
    visited = set()
    best_path = {}
    f_score = {start: distance_est(start, finish)}
    while f_score:
        cur = min(f_score, key=f_score.get)
        del f_score[cur]
        if cur == finish:
            path = []
            while cur in best_path:
                path.append(cur)
                cur = best_path[cur]
            return list(reversed(path))
        visited.add(cur)
        for neighbor in get_adjacent(cur):
            if neighbor in visited:
                continue
            this_dist = dist[cur] + 1
            f_score[neighbor] = this_dist + distance_est(neighbor, finish)
            if this_dist < dist.get(neighbor, MAX):
                dist[neighbor] = this_dist
                best_path[neighbor] = cur

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