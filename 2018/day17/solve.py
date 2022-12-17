from dataclasses import dataclass
from enum import Enum
from typing import List

@dataclass(frozen=True)
class Point:
	x: int
	y: int

class Grid:
	def __init__(self, clay_pts, minX, maxX, minY, depth):
		self.minX = minX
		self.maxX = maxX
		self.minY = minY
		self.depth = depth
		self.clay_rows = [[] for _y in range(self.depth+1)]
		self.water_rows = [[] for _y in range(self.depth+1)]
		self.stable_rows = [[] for _y in range(self.depth+1)]
		for pt in clay_pts:
			self.clay_rows[pt.y].append(pt)

	def draw(self, spawn_pts):
		for d in range(self.depth+1):
			line = []
			water_row = self.water_rows[d]
			clay_row = self.clay_rows[d]
			for x in range(self.minX, self.maxX):
				if any(sp.x == x and sp.y == d for sp in spawn_pts):
					line.append("|")
					continue
				if any(sp.x == x and sp.y == d for sp in self.stable_rows[d]):
					line.append('s')
					continue
				if any(p.x == x for p in water_row):
					line.append("~")
				elif any(p.x == x for p in clay_row):
					line.append("#")
				else:
					line.append(".")
			print("".join(line))

	def pour(self, pt):
		if not self.is_filled(pt):
			self.water_rows[pt.y].append(pt)
	
	def in_bounds(self, pt):
		if pt.y >= len(self.water_rows) or pt.y < 0:
			return False
		if pt.x < self.minX:
			self.minX = pt.x
		elif pt.x > self.maxX:
			self.maxX = pt.x
		return True

	def is_clay(self, pt):
		return any(p.x == pt.x for p in self.clay_rows[pt.y])
	
	def is_filled(self, pt):
		return self.is_clay(pt) or any(p.x == pt.x for p in self.water_rows[pt.y])

	def is_stable(self, pt):
		return self.is_clay(pt) or any(p.x == pt.x for p in self.stable_rows[pt.y])
	
	def mark_stable(self, pts):
		y = pts[0].y
		self.stable_rows[y].extend(p for p in pts if p not in self.stable_rows[y])
	
	def filled(self):
		return [pt for row in range(self.minY, self.depth+1) for pt in self.water_rows[row]]
	
	def stable(self):
		return [pt for row in range(self.minY, self.depth+1) for pt in self.stable_rows[row]]

def d2MinMax(pts):
	minX, maxX, minY, maxY = None, None, None, None
	for pt in pts:
		if not minX or pt.x < minX:
			minX = pt.x
		if not maxX or pt.x > maxX:
			maxX = pt.x
		if not minY or pt.y < minY:
			minY = pt.y
		if not maxY or pt.y > maxY:
			maxY = pt.y
	return minX, maxX, minY, maxY


def parseInput(input) -> Grid:
	expanded_pts = []
	for line in input.splitlines():
		coords = line.split(", ")
		expanded_pts.extend(Point(*c)
			for c in expand_coord(coords[0], coords[1]))
	minX, maxX, minY, maxY = d2MinMax(expanded_pts)
	return Grid(expanded_pts, minX, maxX, minY, maxY)


def expand_coord(c1, c2):
	[c2ident, rnge] = c2.split("=")
	[low, high] = rnge.split('..')
	[_, stableside] = c1.split("=")
	stableside = int(stableside)
	flip = c2ident.startswith('x')
	for n in range(int(low), int(high)+1):
		if not flip:
			yield [stableside, n]
		else:
			yield [n, stableside]


def simulate(grid: Grid, spawn: Point) -> List[Point]:
	grid.pour(spawn)
	downpt = Point(spawn.x, spawn.y + 1)
	if not grid.in_bounds(downpt):
		return []
	if not grid.is_filled(downpt) and not grid.is_clay(downpt):
		return [spawn, downpt]	# empty space, fall down
	if grid.is_filled(downpt) and not grid.is_stable(downpt):
		return [] # water already pouring off sides
	bounded = 0
	spread_pts = [spawn]
	next_spawn_pts = []
	for diff in [-1, 1]:
		nextpt = Point(spawn.x + diff, spawn.y)
		while grid.in_bounds(nextpt):
			if grid.is_clay(nextpt):
				bounded += 1
				break
			ground = Point(nextpt.x, nextpt.y + 1)
			if not grid.is_stable(ground):
				next_spawn_pts.append(nextpt)
				break
			if not grid.is_filled(nextpt):
				grid.pour(nextpt)
			spread_pts.append(nextpt)
			nextpt = Point(nextpt.x + diff, nextpt.y)
	if bounded == 2:
		grid.mark_stable(spread_pts)
		return []
	else:
		return next_spawn_pts

def solve1(input):
	grid = parseInput(input)
	spring = Point(500, 0)
	spawn_points = [spring]
	ticks = 0
	while spawn_points:
		sp = spawn_points.pop()
		more_spawn_points = simulate(grid, sp)
		#print()
		ticks += 1
		spawn_points.extend(more_spawn_points)
		#grid.draw(spawn_points)
	grid.draw([])
	print(f"ticks taken: {ticks}")
	print(f"answer: {len(grid.filled())}")
	
def solve2(input):
	grid = parseInput(input)
	spring = Point(500, 0)
	spawn_points = [spring]
	ticks = 0
	while spawn_points:
		sp = spawn_points.pop()
		more_spawn_points = simulate(grid, sp)
		#print()
		ticks += 1
		spawn_points.extend(more_spawn_points)
		#grid.draw(spawn_points)
	grid.draw([])
	print(f"ticks taken: {ticks}")
	print(f"answer: {len(grid.stable())}")


TEST_INPUT = """"x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504"""
with open("day17/input.txt") as inp:
	solve2(inp.read())