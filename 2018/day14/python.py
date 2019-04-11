import os, itertools, re, collections
INPUT = 513401
TEST_INPUT = 2018


def solve1(prob):
    recipes = [3, 7]
    a = 0
    b = 1
    while len(recipes)- 10 < prob:
        a_score = recipes[a]
        b_score = recipes[b]
        score = a_score + b_score
        recipes.extend(int(i) for i in str(score))
        a = (a_score + 1 + a) % len(recipes)
        b = (b_score + 1 + b) % len(recipes)
    return "".join(str(i) for i in recipes[prob:prob+10])

def solve2(prob):
    recipes = [3, 7]
    prob = [int(i) for i in str(prob)]
    a = 0
    b = 1
    len_p = len(prob)
    while recipes[-len_p:] != prob and recipes[-len_p-1:-1] != prob:
        a_score = recipes[a]
        b_score = recipes[b]
        score = a_score + b_score
        recipes.extend(int(i) for i in str(score))
        len_r = len(recipes)
        a = (a_score + 1 + a) % len_r
        b = (b_score + 1 + b) % len_r
    return len(recipes) - len_p

# print(solve1(INPUT))
print(solve2(INPUT))