import os, itertools, re, collections
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()

TEST_INPUT="""Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.""".splitlines()

STEP = re.compile(r"Step (\S+) must be finished before step (\S+) can begin.")

def solve1(prob):
    requirements = collections.defaultdict(list)
    order = []
    for line in prob:
        require, step = STEP.match(line).groups()
        requirements[step].append(require)
    ready = set(r for v in requirements.values() for r in v) - set(requirements.keys())
    waiting = set(requirements.keys())
    while waiting or ready:
        do = sorted(ready)[0]
        ready.remove(do)
        order.append(do)
        for candidate, req in requirements.items():
            if candidate not in order:
                if all(r in order for r in req):
                    ready.add(candidate)
                    if candidate in waiting:
                        waiting.remove(candidate)
    return "".join(order)

print(solve1(INPUT))