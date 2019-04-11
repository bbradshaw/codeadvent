import os, itertools, collections, string, functools
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()

TEST_INPUT = """initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #""".splitlines()

def print_at_offset(gen, state, start, end):
    state = "".join(state.get(v, ".") for v in range(start, end))
    print(f"{gen: 2}: {state}")

def solve1(prob):
    state = prob[0].split(": ")[1].strip()
    rules = dict(l.strip().split(" => ") for l in prob[2:] if l.strip().endswith("#"))
    state = {i:v for i,v in enumerate(state)}
    print_at_offset(0, state, -3, 70)
    for gen in range(1, 21):
        next_gen = {}
        lowest = min(state)
        highest = max(state)
        for n in range(lowest-2, highest+3):
            substr = "".join(state.get(i, ".") for i in range(n-2, n+3))
            for rule in rules:
                if substr == rule:
                    next_gen[n] = rules[substr]
                    break
        state = next_gen
        print_at_offset(gen, state, -3, 70)
        # print("sum at gen ", gen, " ", sum(state))
    return sum(state)

def solve2(prob):
    state = prob[0].split(": ")[1].strip()
    rules = dict(l.strip().split(" => ") for l in prob[2:] if l.strip().endswith("#"))
    state = {i:v for i,v in enumerate(state)}
    print_at_offset(0, state, -3, 70)
    prev_sum = 0
    for gen in range(1, 200):
        next_gen = {}
        lowest = min(state)
        highest = max(state)
        for n in range(lowest-2, highest+3):
            substr = "".join(state.get(i, ".") for i in range(n-2, n+3))
            for rule in rules:
                if substr == rule:
                    next_gen[n] = rules[substr]
                    break
        state = next_gen
        # print_at_offset(gen, state, -3, 70)
        sum_state = sum(state)
        print(f"sum at gen {gen}: {sum_state} (+{sum_state - prev_sum})")
        prev_sum = sum_state
    return sum(state)


print(solve2(INPUT))