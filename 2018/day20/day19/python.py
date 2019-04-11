import os, itertools, re, collections, sys
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()

TEST_INPUT="""#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5""".splitlines()

class VirtualMachine:
    OPERATIONS = {'muli', 'bani', 'setr', 'seti', 'gtri', 
        'borr', 'eqir', 'addr', 'gtir', 'mulr', 'gtrr', 
        'addi', 'eqri', 'banr', 'bori', 'eqrr'}

    def __init__(self, instructions):
        self.ip = 0
        self.instructions = instructions[1:]
        self.instruction_reg = int(instructions[0].split(" ")[1])
        self.registers = {r:0 for r in range(6)}

    def run(self):
        while True:
            try:
                self.tick()
            except IndexError:
                return
    
    def tick(self):
        instruction = self.instructions[self.ip]
        i = instruction.split()
        self.registers[self.instruction_reg] = self.ip
        self.do_instruction(i[0], int(i[1]), int(i[2]), int(i[3]))
        self.ip = self.registers[self.instruction_reg]
        self.ip += 1
        if self.ip == 7:
            print(self.ip, instruction, self.registers)
        
    def set_registers(self, *r):
        self.registers = {k:v for k,v in zip(range(4), r)}
    
    def get_val(self, r):
        return self.registers[r]
    
    def set_output(self, r, val):
        self.registers[r] = val
    
    def do_instruction(self, instr, i1, i2, output):
        if instr == "addr":
            self.set_output(output, self.get_val(i1) + self.get_val(i2))
        elif instr == "addi":
            self.set_output(output, self.get_val(i1) + i2)
        elif instr == "mulr":
            self.set_output(output, self.get_val(i1) * self.get_val(i2))
        elif instr == "muli":
            self.set_output(output, self.get_val(i1) * i2)        
        elif instr == "banr":
            self.set_output(output, self.get_val(i1) & self.get_val(i2))
        elif instr == "bani":
            self.set_output(output, self.get_val(i1) & i2)
        elif instr == "borr":
            self.set_output(output, self.get_val(i1) | self.get_val(i2))
        elif instr == "bori":
            self.set_output(output, self.get_val(i1) | i2)
        elif instr == "setr":
            self.set_output(output, self.get_val(i1))
        elif instr == "seti":
            self.set_output(output, i1)
        elif instr == "gtir":
            self.set_output(output, int(i1 > self.get_val(i2)))
        elif instr == "gtri":
            self.set_output(output, int(self.get_val(i1) > i2))
        elif instr == "gtrr":
            self.set_output(output, int(self.get_val(i1) > self.get_val(i2)))
        elif instr == "eqir":
            self.set_output(output, int(i1 == self.get_val(i2)))
        elif instr == "eqri":
            self.set_output(output, int(self.get_val(i1) == i2))
        elif instr == "eqrr":
            self.set_output(output, int(self.get_val(i1) == self.get_val(i2)))

def solve1(prob):
    vm = VirtualMachine(prob)
    vm.run()
    return vm.registers[0]

def solve2(prob):
    vm = VirtualMachine(prob)
    vm.registers[0] = 1
    vm.run()
    return vm.registers[0]

print(solve2(INPUT))