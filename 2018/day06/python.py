import os, itertools, collections, string, functools
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()

TEST_INPUT = """1, 1
1, 6
8, 3
3, 4
5, 5
8, 9""".splitlines()

def get_min_max_x_y(coords):
    xs = [p[0] for p in coords]
    ys = [p[1] for p in coords]
    return min(xs), min(ys), max(xs), max(ys)

def get_radius_pts(ctr, radius):
    for n in range(radius):
        opp = radius - n
        yield (ctr[0] + n, ctr[1] - opp)
        yield (ctr[0] - n, ctr[1] + opp)
        yield (ctr[0] + opp, ctr[1] + n)
        yield (ctr[0] - opp, ctr[1] - n)

def print_claimed(coords, claimed):
    numbered = {c:n for n,c in enumerate(coords)}
    for y in range(12):
        for x in range(12):
            if (x,y) in claimed:
                print(numbered[claimed[x,y]], end='')
            else:
                print(".", end='')
        print()
    print()

def solve1_bad(prob):
    coords = [tuple(int(i) for i in l.split(",")) for l in prob]
    min_x, min_y, max_x, max_y = get_min_max_x_y(coords)
    oob_pt = lambda pt: pt[0] < min_x or pt[0] > max_x or pt[1] < min_y or pt[1] > max_y
    claimed = {c:c for c in coords}
    cnt = {c:1 for c in coords}
    border_pts = []
    at_radius = 1
    biggest = 0
    bound, unbound = set(coords), set()
    while True:
        print(f"bound: {bound}\nunbound: {unbound} at radius {at_radius}")
        pts_at_radius = {}
        for coord in coords:
            for pt in get_radius_pts(coord, at_radius):
                if pt in border_pts:
                    pass
                elif pt in pts_at_radius:
                    border_pts.append(pt)
                    del pts_at_radius[pt]
                elif pt not in claimed:
                    if oob_pt(pt):
                        unbound.add(coord)
                    pts_at_radius[pt] = coord
        bound = set(coords) - unbound
        cnt = {c:v for c,v in cnt.items() if c in bound}
        for pt, coord in pts_at_radius.items():
            if coord in bound:
                cnt[coord] += 1
        claimed.update(pts_at_radius)
        new_biggest = max(cnt.values())
        if biggest == new_biggest:
            return new_biggest
        else:
            biggest = new_biggest
            print(f"current biggest: {new_biggest} [{[c for c,v in cnt.items() if v == new_biggest]}")
            # print_claimed(coords, claimed)
            at_radius += 1

def solve1(prob):
    coords = {tuple(int(i) for i in l.split(",")):0 for l in prob}
    min_x, min_y, max_x, max_y = get_min_max_x_y(coords)
    owner = {}
    for x,y in itertools.product(range(min_x, max_x+1), range(min_y, max_y+1)):
        distances = {c:manhattan(c, (x,y)) for c in coords}
        smallest = min(distances, key=distances.get)
        if sum(1 for dv in distances.values() if distances[smallest] == dv) == 1:
            owner[x,y] = smallest
            coords[smallest] += 1
    print("distances calculated.")
    return max(coords.values())

@functools.lru_cache(1200)
def manhattan(p1, p2):
    return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])

def solve2(prob, size):
    coords = [tuple(int(i) for i in l.split(",")) for l in prob]
    min_x, min_y, max_x, max_y = get_min_max_x_y(coords)
    dist = {}
    for x,y in itertools.product(range(min_x, max_x+1), range(min_y, max_y+1)):
        dist[x,y] = sum(manhattan(c, (x,y)) for c in coords)
    print("distances calculated.")
    return sum(1 for p,v in dist.items() if v < size)

print(solve1(INPUT))
print(solve2(INPUT, 10_000))