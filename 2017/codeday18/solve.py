from collections import defaultdict
example ="""set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2"""

class Instruction:
	def __init__(self, raw):
		parts = raw.split(" ")
		self.cmd = parts[0]
		self.val1 = parts[1]
		if len(parts) > 2:
			self.val2 = parts[2]
		else:
			self.val2 = None

class CPU:
	def __init__(self, program):
		self.program = program
		self.ip = 0
		self.sound_freq = None
		self.registers = defaultdict(int)
		self.last_cmd = None

	def step(self):
		try:
			instruction = self.program[self.ip]
		except IndexError:
			return f"CPU Halt at instruction {self.ip}"
		c = instruction.cmd
		self.last_cmd = c
		if c == "snd":
			self.sound_freq = self._get_value(instruction.val1)
		elif c == "set":
			self.registers[instruction.val1] = self._get_value(instruction.val2)
		elif c == "add":
			self.registers[instruction.val1] += self._get_value(instruction.val2)
		elif c == "mul":
			self.registers[instruction.val1] *= self._get_value(instruction.val2)
		elif c == "mod":
			self.registers[instruction.val1] = self.registers[instruction.val1] % self._get_value(instruction.val2)
		elif c == "rcv":
			if self.registers[instruction.val1] !=0:
				self.registers[instruction.val1] = self.sound_freq
				return f"Recover sound halt with frequency {self.sound_freq}"
		elif c == "jgz":
			if self._get_value(instruction.val1) > 0:
				self.ip += self._get_value(instruction.val2)
				return
		self.ip += 1


	def _get_value(self, raw_val):
		if raw_val.isalpha():
			return self.registers[raw_val]
		else:
			return int(raw_val)


def solve_day_18_1(program):
	cpu = CPU(program)
	while True:
		is_halt = cpu.step()
		if is_halt:
			print(is_halt)
			break
		print(f"{cpu.ip} {dict(cpu.registers)} prev cmd: {cpu.last_cmd}")




example_instruct = [Instruction(l) for l in example.splitlines()]
#solve_day_18_1(example_instruct)

with open(r"C:\Users\Ben\Documents\adventcode\day18_input.txt") as f:
	data = f.read()

solve_day_18_1([Instruction(l) for l in data.splitlines()])