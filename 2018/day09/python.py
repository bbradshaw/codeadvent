import os, itertools, re, collections
INPUT = 458, 72019
TEST_INPUT = 10, 1618

def print_circle(circle, cur, p):
    offset = circle.index(0)
    cur = circle[cur]
    print(f"[{p}]  ", end='')
    for pos in range(len(circle)):
        n = circle[(offset+pos) % len(circle)]
        if n != cur:
            print("{0: 4}".format(n), end='')
        else:
            print("({0: 2})".format(n), end='')
    print()

from collections import deque, defaultdict

def play_game(max_players, last_marble, mult=1):

    last_marble *= mult
    scores = defaultdict(int)
    circle = deque([0])
    player = 0

    for marble in range(1, last_marble + 1):
        if marble % 23 == 0:
            circle.rotate(7)
            scores[player] += marble + circle.pop()
            circle.rotate(-1)
        else:
            circle.rotate(-1)
            circle.append(marble)

        player = (player + 1) % max_players

    return max(scores.values()) if scores else 0



def solve1(players, last_score):
    players = {p:0 for p in range(1,players+1)}
    circle = []
    mn = 0
    circle.append(mn)
    cur = 0
    cur_player = 0
    while True:
       # print_circle(circle, cur, cur_player)
        mn += 1
        cur_player = (cur_player % len(players)) + 1
        if mn % 23 != 0:
            ins_index = (cur + 2) % len(circle)
            circle.insert(ins_index, mn)
            cur = ins_index
        else:
            new_index = (cur -7) % len(circle)
            val = circle[new_index] + mn
            cur = new_index
            del circle[new_index]
            players[cur_player] += val
        if mn == last_score:
            break
        if mn % 100_000 == 0:
            print(mn)
    return max(players.values())

def solve2(players, last_score):
    last_score 
    players = {p:0 for p in range(1,players+1)}
    circle = []
    mn = 0
    circle.append(mn)
    cur = 0
    cur_player = 0
    last_val = 0
    while True:
       # print_circle(circle, cur, cur_player)
        mn += 1
        cur_player = (cur_player % len(players)) + 1
        if mn % 23 != 0:
            ins_index = (cur + 2) % len(circle)
            circle.insert(ins_index, mn)
            cur = ins_index
        else:
            new_index = (cur -7) % len(circle)
            val = circle[new_index]
            cur = new_index
            del circle[new_index]
            players[cur_player] += val + mn
        if mn == last_score:
            break
        if mn % 100_000 == 0:
            print(mn)
    return max(players.values())

#
print(play_game(*INPUT))
print(play_game(*INPUT, 100))
# print(solve2(*INPUT))