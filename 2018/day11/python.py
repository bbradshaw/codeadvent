import os, itertools, re, collections, time, functools
INPUT = 6392
TEST_INPUT = 42

@functools.lru_cache(None)
def power_at_cell(serial, x, y):
    rack_id = x + 10
    power = rack_id * y
    power += serial
    power *= rack_id
    power = int(str(power)[-3])
    return power - 5

def power_at_grid(serial, leftx, topy, size=3):
    return sum(power_at_cell(serial, x, y) for x,y in itertools.product(
        range(leftx, leftx + size),
        range(topy, topy + size )
    ))

def solve1(serial):
    scores = {}
    for x,y in itertools.product(
        range(1, 299),
        range(1, 299)):
        scores[(x,y)] = power_at_grid(serial, x, y)
    return max(scores, key=scores.get)

def compute_summed_area(serial, summed_area, x, y):
    if x == 0 or y == 0:
        return 0
    elif (x,y) not in summed_area:
        summed_area[x,y] = (power_at_cell(serial, x, y) + 
            compute_summed_area(serial, summed_area, x, y - 1) +
            compute_summed_area(serial, summed_area, x - 1, y) -
            compute_summed_area(serial, summed_area, x - 1, y - 1))
    return summed_area[(x,y)]

def computed_sum(summed_area, upleft, downright):
    return (summed_area[downright] 
        - summed_area[upleft[0], downright[1]] 
        - summed_area[downright[0], upleft[1]]
        + summed_area[upleft])

def solve2(serial):
    SIZE = 100
    best_score = 0
    at_coord = None
    summed_area = {}
    for (x,y) in itertools.product(range(1,SIZE), range(1,SIZE)):
        summed_area[x,y] = compute_summed_area(serial, summed_area, x, y)
    return power_at_grid(serial, 21,61,3)
    # return computed_sum(summed_area, (21,61), (24,64))

# print(solve1(INPUT))
print(solve2(TEST_INPUT))