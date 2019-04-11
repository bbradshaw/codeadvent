INPUT = open("input.txt").read()

from collections import Counter

def solve1(inp):
    cnt = Counter()
    for line in inp.splitlines():
        cnt.update(enumerate(line))
    message = {}
    char_slots = len(line)
    for (pos, char), _ in cnt.most_common():
        if pos not in message:
            message[pos] = char
        if len(message) == char_slots:
            break
    return"".join(message[i] for i in range(char_slots))

def solve2(inp):
    cnt = Counter()
    for line in inp.splitlines():
        cnt.update(enumerate(line))
    message = {}
    char_slots = len(line)
    for (pos, char), _ in reversed(cnt.most_common()):
        if pos not in message:
            message[pos] = char
        if len(message) == char_slots:
            break
    return"".join(message[i] for i in range(char_slots))

if __name__ == "__main__":
    print(solve2(INPUT))