

def solve_day3(stop_at):
	pos = [0,0]
	n = 1
	h_mag, v_mag = 1, 1
	
	def move_direction(amount, axis, sign):
		nonlocal n, pos
		for i in range(amount):
			n += 1
			pos[axis] += sign
			if n==stop_at:
				print("{0}: {1}".format(n,pos))
				return pos
				
	while n <= stop_at:
		solution = move_direction(h_mag, 0, 1)  #move to the right
		if solution: return solution
		h_mag += 1						#increment amount
		solution = move_direction(v_mag, 1, 1)  #move up
		if solution: return solution
		v_mag +=1 					 #increment amount
		solution = move_direction(h_mag, 0, -1) #move to the left
		if solution: return solution
		h_mag += 1
		solution = move_direction(v_mag, 1, -1) #move down
		if solution: return solution
		v_mag += 1
	
def solve_day3_2(stop_at):
	pos = [0,0]
	n = 1
	h_mag, v_mag = 1, 1
	grid = {(0,0) : 1}
	
	def get_adjacent_sum(x,y):
		sum = 0
		for adj_x, adj_y in ((1,0), (0,1), (-1,0), (0, -1), (-1, -1), (1,-1), (1,1), (-1,1)):
			if (x + adj_x, y + adj_y) in grid:
				sum += grid[(x + adj_x, y+ adj_y)]
		return sum
	
	def move_direction(amount, axis, sign):
		nonlocal n, pos, grid
		for i in range(amount):
			n += 1
			pos[axis] += sign
			this_sum = get_adjacent_sum(*pos)
			print("{0}: {1}".format(pos,this_sum))
			grid[(pos[0], pos[1])] = this_sum
			if this_sum > stop_at:
				return this_sum
				
	while n <= stop_at:
		solution = move_direction(h_mag, 0, 1)  #move to the right
		if solution: return solution
		h_mag += 1						#increment amount
		solution = move_direction(v_mag, 1, 1)  #move up
		if solution: return solution
		v_mag +=1 					 #increment amount
		solution = move_direction(h_mag, 0, -1) #move to the left
		if solution: return solution
		h_mag += 1
		solution = move_direction(v_mag, 1, -1) #move down
		if solution: return solution
		v_mag += 1
