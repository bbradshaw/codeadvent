from collections import defaultdict
import operator as op

def solve_day8(raw, part=1):
	op_map = {"<" : op.lt, ">" : op.gt, ">=" : op.ge, "<=" : op.le, "==" : op.eq, "!=" : op.ne}
	registers = defaultdict(int)
	high_scores = defaultdict(int)
	for line in raw:
		mod_reg, mode, mod_val, _, test_reg, test_op, test_target = line.split(" ")
		mod_val = int(mod_val)
		test_target = int(test_target)
		if mode == "inc":
			mode = 1
		else:
			mode = -1
		test_op = op_map[test_op]
		test_reg_val = registers[test_reg]
		if test_op(test_reg_val, test_target):
			registers[mod_reg] += mode * mod_val
			if part == 2:
				high_scores[mod_reg] = max(high_scores[mod_reg], registers[mod_reg])
	print(registers)
	if part == 1:
		return max(registers.values())
	else:
		return max(high_scores.values())

with open(r"C:\Users\Ben\Documents\adventcode\day8_input.txt") as f:
	print(solve_day8(f))
	f.seek(0)
	print(solve_day8(f, 2))