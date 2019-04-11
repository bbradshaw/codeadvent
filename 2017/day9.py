def solve_day9(chars, part=1):
	group_nest_level = 0
	score = 0
	in_garbage = False
	skip_next_char = False
	garbage_count = 0
	for c in chars:
		if in_garbage:
			if skip_next_char:
				skip_next_char = False
				continue

			if part==2:
				if c != "!" and c != ">":
					garbage_count += 1
			if c=='>':
				in_garbage = False
				continue
			elif c=="!":
				skip_next_char = True
				continue

		else:
			if c=="{":
				group_nest_level += 1
				continue
			elif c=="<":
				in_garbage=True
				continue
			elif c=="}":

				score += group_nest_level
				group_nest_level -= 1
	if part ==1:
		return score
	else:
		return garbage_count

with open(r"C:\Users\Ben\Documents\adventcode\day9_input.txt") as f:
	print("score was {}".format(solve_day9(f.read())))
	f.seek(0)
	print("garbage_count was {}".format(solve_day9(f.read(), 2)))