
def swap(pos1, pos2, line):
	pos1_val = line[pos1]
	line[pos1] = line[pos2]
	line[pos2] = pos1_val

def spin(move, line):
	amount = int(move)
	line[:] = line[-amount:] + line[:len(line) - amount]


def exchange(move, line):
	pos1, pos2 = move.split("/")
	pos1, pos2 = int(pos1), int(pos2)
	swap(pos1, pos2, line)

def partner(move, line):
	p1, p2 = move.split('/')
	swap(line.index(p1), line.index(p2), line)

def solve_day16_1(raw):
	line = [c for c in 'abcdefghijklmnop']
	for move in raw.split(","):
		#print(line)
		kind = move[0]
		if kind == "s":
			spin(move[1:], line)
		elif kind == "x":
			exchange(move[1:], line)
		elif kind  == "p":
			partner(move[1:], line)
	return "".join(line)

def solve_day16_2(raw):
	line = [c for c in 'abcdefghijklmnop']
	orig_line = line[:]
	moves = [m for m in raw.split(",")]
	history = []
	for i in range(999999960, 1_000_000_000):
		for move in moves:
			#print(line)
			kind = move[0]
			if kind == "s":
				spin(move[1:], line)
			elif kind == "x":
				exchange(move[1:], line)
			elif kind  == "p":
		 		partner(move[1:], line)
		if line == orig_line:
			print(i)
			#break
	return "".join(line)


with open(r"C:\Users\Ben\Documents\adventcode\day16_input.txt") as f:
	data = f.read()


example = "s1,x3/4,pe/b"
print(solve_day16_2(data))