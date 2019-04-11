from collections import defaultdict
import re

INPUT = open("input.txt").read()

directions = [
    re.compile(r"rect (?P<width>\d+)x(?P<height>\d+)"),
    re.compile(r"rotate (?P<axis>[^ ]+) .=(?P<coord>\d+) by (?P<amount>\d+)")
]
class Screen:
    def __init__(self, height, width):
        self.height = height
        self.width = width
        self.pixels = defaultdict(lambda : ".")

    def rect(self, height, width):
        width = int(width)
        height = int(height)
        for x in range(width):
            for y in range(height):
                self.pixels[(x,y)] = "#"
    
    def shift(self, axis, coord, amount):
        coord = int(coord)
        amount = int(amount)
        if axis == 'column':
            max = self.height
            old_data = [self.pixels[(coord, n)] for n in range(max)]
        else:
            max = self.width
            old_data = [self.pixels[(n, coord)] for n in range(max)]
        amount = amount % max
        new_data = old_data[-amount:] + old_data[:-amount]
        if axis == 'column':
            for n in range(max):
                self.pixels[(coord, n)] = new_data[n]
        else:
            for n in range(max):
                self.pixels[(n, coord)] = new_data[n]
    
    @property
    def num_on(self):
        return sum(1 for v in self.pixels.values() if v == "#")

    def display(self):
        for y in range(self.height):
            for x in range(self.width):
                print(self.pixels[(x,y)], end='')
            print("")

def problem1(inp):
    screen = Screen(6, 50)
    for direction in inp:
        screen.display()
        print(direction)
        m = directions[0].match(direction)
        if m:
            screen.rect(**m.groupdict())
            continue
        m = directions[1].match(direction)
        if m:
            screen.shift(**m.groupdict())
            continue
        print(f"could not parse line {direction}")
    screen.display()
    return screen.num_on
    
if __name__ == "__main__":
    print(problem1(INPUT.splitlines()))
    
