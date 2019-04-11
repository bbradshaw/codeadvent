def get_triangle_wave_pos(size, t):
	peak = size - 1
	return abs( ((t + peak) % (peak*2)) - peak)


def solve_day13_1(data):
	score = 0
	for line in data:
		time, depth = line.split(": ")
		time, depth = int(time), int(depth)
		if get_triangle_wave_pos(depth, time) == 0:
			score += time*depth
	return score

def solve_day13_2(data):
	scanners = []
	for line in data:
		time, depth = line.split(": ")
		scanners.append((int(time), int(depth)))
	max_depth = max(s[1] for s in scanners)
	start_t = 0
	while True:
		start_t += 1
		if all(get_triangle_wave_pos(depth, time + start_t) != 0 for time, depth in scanners):
			break
	return start_t


with open(r"C:\Users\Ben\Documents\adventcode\day13_input.txt") as f:
	data = f.read()

print(solve_day13_1(data.splitlines()))
print(solve_day13_2(data.splitlines()))