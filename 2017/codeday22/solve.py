example="""..#
#..
..."""

class Directions:
	UP = (0,-1)
	DOWN = (0, 1)
	LEFT = (-1, 0)
	RIGHT = (1, 0)

def turn(cur_direction, turn_direction):
	if turn_direction == Directions.RIGHT:
		return (cur_direction[1]*-1,cur_direction[0])
	if turn_direction == Directions.LEFT:
		return (cur_direction[1], cur_direction[0]*-1)

def get_grid(data):
	start_grid = data.splitlines()
	grid = {}
	start_x = (len(start_grid[0]) // 2) * -1
	start_y = (len(start_grid) // 2) * -1
	x = start_x
	y = start_y
	for line in start_grid:
		for c in line:
			grid[(x,y)] = c
			x += 1
		x = start_x
		y += 1
	return grid

def solve_day_22_1(data):
	grid = get_grid(data)
	cur_pos = (0,0)
	facing = Directions.UP
	infection_count =0 
	for burst in range(10_000):
		#print(sum(1 for n in grid.values() if n == "#"))
		is_infected = grid.get(cur_pos, ".") == "#"
		if is_infected:
			facing = turn(facing, Directions.RIGHT)
			grid[cur_pos] = "."
		else:
			facing = turn(facing, Directions.LEFT)
			grid[cur_pos] = "#"
			infection_count += 1
		x = cur_pos[0] + facing[0]
		y = cur_pos[1] + facing[1]
		cur_pos = (x,y)
	return infection_count

def solve_day_22_2(data):
	grid = get_grid(data)
	cur_pos = (0,0)
	facing = Directions.UP
	infection_count =0 
	for burst in range(10_000_000):
		cur_node = grid.get(cur_pos, ".")
		if cur_node == "#":
			facing = turn(facing, Directions.RIGHT)
			grid[cur_pos] = "F"

		elif cur_node == ".":
			facing = turn(facing, Directions.LEFT)
			grid[cur_pos] = "W"

		elif cur_node == "W":
			grid[cur_pos] = "#"
			infection_count += 1

		elif cur_node == "F":
			facing = (facing[0]*-1, facing[1]*-1)
			grid[cur_pos] = "."


		x = cur_pos[0] + facing[0]
		y = cur_pos[1] + facing[1]
		cur_pos = (x,y)
	return infection_count



if __name__ == "__main__":
	with open(r"C:\Users\Ben\Documents\adventcode\day22_input.txt") as f:
		data = f.read()
	print(solve_day_22_2(data))