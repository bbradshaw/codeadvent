import os, itertools, re, collections, sys
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()

BIG_NUM = 10_000_000

class Unit:
    GOBLIN = "G"
    ELF = "E"

    UNIT_ID = iter(range(1,BIG_NUM))
    ATK = 3
    MAX_HP = 200

    @staticmethod
    def is_unit(char):
        return char in (Unit.GOBLIN, Unit.ELF)

    def __init__(self, char, coords):
        self.id = next(Unit.UNIT_ID)
        self.kind = char
        self.coords = coords
        self.hp = Unit.MAX_HP
    
    @property
    def alive(self):
        return self.hp > 0
    
    @property
    def x(self):
        return self.coords[0]

    @property
    def y(self):
        return self.coords[1]
    
    def __str__(self):
        if self.kind == "G":
            return f"Goblin {self.id}"
        else:
            return f"Elf {self.id}"

class Map:
    WALL = "#"
    FLOOR = "."
    DIRECTIONS = ((0,-1), (-1, 0), (1, 0), (0, 1)) #Reading order U, L, R, D

    @staticmethod
    def reading_order(items):
        return sorted(items, key=lambda i: (i[1], i[0]))[0]

    def __init__(self, raw):
        self.coords = {}
        self.units = {}
        self.tags = {}
        self.round = 0
        for y,line in enumerate(raw):
            for x,char in enumerate(line.strip()):
                if Unit.is_unit(char):
                    self.units[x,y] = Unit(char, (x,y))
                    self.coords[x,y] = Map.FLOOR
                else:
                    self.coords[x,y] = char
        self.width = x
        self.height = y
    
    def get_square(self, coord):
        if coord in self.units:
            return self.units[coord]
        else:
            return self.coords[coord]
    
    def bfs_all(self, unit, goals):
        visited = {(x,y): False for (x,y) in itertools.product(range(self.width), range(self.height))}
        visited[unit.coords] = True

        queue = collections.deque([[unit.coords]])

        while queue:
            paths = []
            found = []
            while queue:
                path = queue.popleft()
                c = path[-1]
                if c in goals:
                    # print(f"goal for unit at {unit.coords} is {c}")
                    found.append(path)
                    continue
                for neighbor in self.adjacent_reachable(*c):
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        paths.append(path + [neighbor])
            if len(found) > 0:
                dest = self.reading_order([p[-1] for p in found])
                return self.reading_order([p[1] for p in found if p[-1] == dest])

            queue = collections.deque(paths)

    def get_unit_order(self):
        for y in range(self.height+1):
            for x in range(self.width+1):
                if (x,y) in self.units:
                    yield self.units[x,y]
    
    def adjacent_reachable(self, x, y):
        reach = []
        for dx, dy in self.DIRECTIONS:
            if self.coords[x + dx, y + dy] == Map.FLOOR:
                if (x + dx, y + dy) not in self.units:
                    reach.append((x + dx, y + dy))
        return reach
    
    def adjacent_enemies(self, unit):
        enemies = []
        for dx, dy in self.DIRECTIONS:
            enemy = self.units.get((unit.x + dx, unit.y + dy))
            if enemy and enemy.kind != unit.kind:
                enemies.append(enemy)
        return enemies

    def print_map(self, handle=sys.stdout):
        for y in range(self.height+1):
            for x in range(self.width+1):
                if (x,y) in self.tags:
                    handle.write(self.tags[x,y])
                elif (x,y) in self.units:
                    handle.write(self.units[x,y].kind)
                else:
                    handle.write(self.coords[x,y])
            handle.write('\n')
        # for u in self.get_unit_order():
        #     print(u.kind, u.hp)
    
    def get_pathing_for_unit(self, unit):
        target_squares = []
        for candidate in self.units.values():
            if unit.kind != candidate.kind:
                target_squares.extend(self.adjacent_reachable(*candidate.coords))
        return self.bfs_all(unit, target_squares)
    
    def move_unit(self, unit, dest):
        # print(f"moving {unit} from {unit.coords} to {dest}")
        del self.units[unit.coords]
        self.units[dest] = unit
        unit.coords = dest
        
    def tick(self):
        for unit in list(self.get_unit_order()):            
            if all(other.kind == unit.kind for other in self.units.values()):
                hp = sum(u.hp for u in self.units.values())
                print(f"combat ends after {self.round} rounds.")
                print(f"{unit.kind} win with {hp} hp left.")
                return self.round * hp
            if not unit.alive:
                continue
            attackable = self.adjacent_enemies(unit)
            if not attackable:
                dest = self.get_pathing_for_unit(unit)
                if dest:
                    self.move_unit(unit, dest)
            attackable = self.adjacent_enemies(unit)
            if attackable:
                low_hp = min(u.hp for u in attackable)
                target = [u for u in attackable if u.hp == low_hp][0]
                target.hp -= unit.ATK
                # print(f"{unit} attacks {target} ({target.hp})")
                if target.hp < 1:
                    del self.units[target.coords]
                    print(f"{target} dies.")
        self.round += 1
        # print(f"Round {self.round} finished.")

def solve1(prob):
    map = Map(prob)
    for _ in range(10_000):
        # os.system('cls')
        res = map.tick()
        #map.print_map()
        
        if res:
            map.print_map()
            return res

print(solve1(INPUT))