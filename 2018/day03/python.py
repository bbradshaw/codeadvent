import os, itertools, re, collections
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()
TEST_INPUT="""#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2""".splitlines()

RECT = re.compile(r"#(\d+) @ (\d+),(\d+): (\d+)x(\d+)")

def solve1(prob):
    claims = collections.defaultdict(list)
    acc = 0
    for line in prob:
        line_id, x, y, w, h = [int(i) for i in RECT.match(line).groups()]
        for dx in range(w):
            for dy in range(h):
                claims[(x+dx, y+dy)].append(line_id)
    for occupied in claims.values():
        if len(occupied) > 1:
            acc += 1
    return acc

def solve2(prob):
    claims = collections.defaultdict(list)
    line_ids = []
    for line in prob:
        line_id, x, y, w, h = [int(i) for i in RECT.match(line).groups()]
        line_ids.append(line_id)
        for dx in range(w):
            for dy in range(h):
                claims[(x+dx, y+dy)].append(line_id)
    for occupied in claims.values():
        if len(occupied) > 1:
            for line_id in occupied:
                if line_id in line_ids:
                    line_ids.remove(line_id)
    return  line_ids

# print(solve1(INPUT ))
print(solve2(INPUT ))