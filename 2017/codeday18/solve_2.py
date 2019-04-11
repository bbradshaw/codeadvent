from collections import defaultdict
example ="""snd 1
snd 2
snd p
rcv a
rcv b
rcv c
rcv d"""

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
		self.registers = defaultdict(int)
		self.last_cmd = None
		self.message_queue = []
		self.is_waiting = False
		self.outgoing_queue = None
		self.send_cnt = 0

	def set_id(self, n):
		self.registers['p'] = n

	def step(self):
		try:
			instruction = self.program[self.ip]
		except IndexError:
			return f"CPU Halt at instruction {self.ip}"
		c = instruction.cmd
		self.last_cmd = c
		if c == "snd":
			self.outgoing_queue.insert(0,self._get_value(instruction.val1))
			self.send_cnt += 1
		elif c == "set":
			self.registers[instruction.val1] = self._get_value(instruction.val2)
		elif c == "add":
			self.registers[instruction.val1] += self._get_value(instruction.val2)
		elif c == "mul":
			self.registers[instruction.val1] *= self._get_value(instruction.val2)
		elif c == "mod":
			self.registers[instruction.val1] = self.registers[instruction.val1] % self._get_value(instruction.val2)
		elif c == "rcv":
			if len(self.message_queue) > 0:
				self.is_waiting = False
				self.registers[instruction.val1] = self.message_queue.pop()
			else:
				print(f"prog {self.registers['p']} is waiting" )
				self.is_waiting = True
				return
                        
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
	cpu1 = CPU(program)
	cpu2 = CPU(program)
	cpu1.set_id(0)
	cpu2.set_id(1)
	cpu1.outgoing_queue = cpu2.message_queue
	cpu2.outgoing_queue = cpu1.message_queue
	while True:
		is_halt = cpu1.step()
		if is_halt:
			print(is_halt)
			break
		print(f"0: {cpu1.ip} {dict(cpu1.registers)} prev cmd: {cpu1.last_cmd}")
		is_halt = cpu2.step()
		if is_halt:
			print(is_halt)
			break
		print(f"1: {cpu2.ip} {dict(cpu2.registers)} prev cmd: {cpu2.last_cmd}")
		if cpu1.is_waiting and cpu2.is_waiting:
			print("normal end on deadlock!")
			print(f"cpu2 send_cnt = {cpu2.send_cnt}")
			break

example_instruct = [Instruction(l) for l in example.splitlines()]
#solve_day_18_1(example_instruct)

with open(r"C:\Users\Ben\Documents\adventcode\day18_input.txt") as f:
	data = f.read()
instructions = [Instruction(l) for l in data.splitlines()]
print(len(instructions))
solve_day_18_1(instructions)
