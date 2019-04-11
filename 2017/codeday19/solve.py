class DIR:
	DOWN =  (0,1)
	UP =    (0, -1)
	RIGHT = (1, 0)
	LEFT =  (-1, 0)
	ALL = {DOWN, UP, RIGHT, LEFT}

def go_dir(p, dir):
	return (p[0] + dir[0], p[1] + dir[1])

def get_char(grid, pos):
	return grid[pos[1]][pos[0]]

def find_intersection_direction(grid, pos, current_direction):
	opposite = (current_direction[0]*-1, current_direction[1]*-1)
	valid_directions =  DIR.ALL - set((opposite,))
	for d in valid_directions:
		if d in (DIR.UP, DIR.DOWN):
			if get_char(grid, go_dir(pos, d)) == "|":
				return d
		if d in (DIR.LEFT, DIR.RIGHT):
			if get_char(grid, go_dir(pos, d)) == "-":
				return d

def solve_day_19(raw, part=1):
	grid = []
	letters = []
	for line in raw.splitlines():
		grid.append([c for c in line])

	cur_pos = (grid[0].index("|"), 0)
	print(f"starting at {cur_pos}")
	direction = DIR.DOWN
	stopped = False
	step = 0
	while not stopped:
		this_char = get_char(grid, cur_pos)
		if this_char == "+":
			direction = find_intersection_direction(grid, cur_pos, direction)
			print(f"hit intersection at {cur_pos}, changing direction to {direction}")
			if not direction:
				stopped = True
				print(f"stopped at {cur_pos}, could find find direction after intersection")
		elif this_char.isalpha():
			letters.append(this_char)
		elif this_char == " ":
			stopped = True
			print(f"stopped at {cur_pos}, end of the line!")
		if not stopped:
			cur_pos = go_dir(cur_pos, direction)
			step += 1
	if part==1:
		return "".join(letters)
	else:
		return step


with open(r"C:\Users\Ben\Documents\adventcode\day19_input.txt") as f:
	data = f.read()

print(solve_day_19(data,1))
print(solve_day_19(data,2))