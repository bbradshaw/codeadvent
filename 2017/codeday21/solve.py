example="""../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#"""

class Rule:
	def __init__(self, raw):
		rule_input, rule_output = raw.split(" => ")
		self._rule_input = [c for c in rule_input.split("/")]
		self.rule_type = len(self._rule_input)
		self._rule_output = [c for c in rule_output.split("/")]
		self.output_size = len(self._rule_output)
		self.transformations = self._generate_transformations()

	def _generate_transformations(self):
		clockwise_2 = [[2,0], [3, 1]]
		clockwise_3 = [[6,3,0],[7,4,1],[8,5,2]]
		transform = []
		def rotate_clock(inp):
			chars = dict(enumerate([r[i] for r in inp for i in range(len(inp))]))
			if self.rule_type == 2:
				clock = clockwise_2
			else:
				clock = clockwise_3
			return [[chars[c] for c in row] for row in clock]
		transform.append(rotate_clock(self._rule_input))
		transform.append(rotate_clock(transform[0]))
		transform.append(rotate_clock(transform[1]))
		transform.append(rotate_clock(transform[2]))  #original
		for t in transform[:]:
			transform.append([list(reversed(row)) for row in t])
			transform.append([row for row in list(reversed(t))])
		return transform
			
	def match(self, art_input):
		return any(art_input == t for t in self.transformations)

	def new_block(self):
		return self._rule_output

class Art:
	def __init__(self, rules):
		self.rules = rules
		self.size = 3
		self.artwork = [[c for c in row] for row in (".#.","..#","###")]

	def __str__(self):
		return "\n"+"\n".join("".join(row) for row in self.artwork)+"\n"

	def _get_art_block(self, x, y, block_size):
		art = []
		for i in range(block_size):
			art.append(self.artwork[block_size * y + i][block_size * x:block_size * x + block_size])
		return art

	def _transform_block(self, block):
		for rule in self.rules:
			if rule.rule_type == len(block) and rule.match(block):
				return rule.new_block()
		raise ValueError(f"could not match input {block}")


	def step(self):
		if self.size % 2 == 0:
			block_size = 2
			n_blocks = self.size // 2
		elif self.size % 3 == 0:
			block_size = 3
			n_blocks = self.size // 3
		new_art = []
		for y in range(n_blocks):
			blocks = []
			for x in range(n_blocks):
				cur_block = self._get_art_block(x,y, block_size)
				#print(f"transforming block ({x}, {y}) with size {block_size}.")
				new_block = self._transform_block(cur_block)
				blocks.append(new_block)
				new_size = len(new_block)
			for row_num in range(0, new_size):
				row = []
				for b in blocks:
					row.extend(b[row_num])
				new_art.append(row)
		self.artwork = new_art
		self.size = len(self.artwork)

	def count_on(self):
		return sum(sum(1 for c in row if c=="#") for row in self.artwork)

def solve_day_21(raw,n):
	rules = [Rule(r) for r in raw.splitlines()]
	art = Art(rules)
	for i in range(n):
		art.step()
		print(art)
	return f"count is {art.count_on()}"


if __name__ == "__main__":
	with open(r"C:\Users\Ben\Documents\adventcode\day21_input.txt") as f:
		data = f.read()
	print(solve_day_21(data, 5))
	#print(solve_day_21(data, 18))
	input("Press enter to quit")
