import os, itertools, collections
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()
TEST_INPUT="""abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab""".splitlines()

def solve1(prob):
    total2 = 0
    total3 = 0
    for word in prob:
        lc = collections.Counter(word)
        if any(1 for letter, cnt in lc.items() if cnt == 2):
            total2 += 1
        if any(1 for letter, cnt in lc.items() if cnt == 3):
            total3 += 1
    return total2 * total3

def find_correct_id(prob):
    for word1, word2 in itertools.combinations(prob, 2):
        diff = sum(1 for i,c in enumerate(word1) if word2[i] != c)
        if diff == 1:
            for letter1, letter2 in zip(word1, word2):
                if letter1 == letter2:
                    yield letter1
            break

def solve2(prob):
    return "".join(find_correct_id(prob))

print(solve1(INPUT))
print(solve2(INPUT))