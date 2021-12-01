def parse(input):
	for i in input.splitlines(): yield int(i)

def solve1(input):
	prev_depth = None
	count = 0
	for depth in parse(input):
		if prev_depth and (depth - prev_depth) > 0:
			count += 1
		prev_depth = depth
	return count

def solve2(input):
	prev_window = []
	window = []
	count = 0

	for depth in parse(input):
		window.append(depth)
		if len(window) > 3:
			window = window[1:4]
		if (len(prev_window) == 3) and (sum(window) - sum(prev_window) > 0):
			count += 1
		prev_window = window[:]
	return count

TEST_INPUT="""199
200
208
210
200
207
240
269
260
263"""

with open("input.txt") as INPUT:
	input = INPUT.read()
	print(solve1(input))
	print(solve2(input))
