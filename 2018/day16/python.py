import os, itertools, re, collections
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()
TEST_INPUT = """Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]

""".splitlines()
class VirtualMachine:
    OPERATIONS = {'muli', 'bani', 'setr', 'seti', 'gtri', 
        'borr', 'eqir', 'addr', 'gtir', 'mulr', 'gtrr', 
        'addi', 'eqri', 'banr', 'bori', 'eqrr'}

    def __init__(self):
        self.ip = 0
        self.registers = {r:0 for r in range(4)}
    
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

def tester(bef, instr, after):
    vm = VirtualMachine()
    _, reg = bef.split("[")
    reg = [int(i) for i in reg[:-2].split(",")]
    opcode, v1, v2, output = (int(i) for i in instr.split(" "))
    _, after = after.split("[")
    after = [int(i) for i in after[:-2].split(",")]
    instructions = []
    for instr in VirtualMachine.OPERATIONS:
        vm.set_registers(*reg)
        vm.do_instruction(instr, v1, v2, output)
        if list(vm.registers.values()) == after:
            instructions.append(instr)
    return instructions

def solve1(prob):
    lines = iter(prob)
    total = 0
    while lines:
        bef, instr, after, _ = next(lines), next(lines), next(lines), next(lines)
        if not bef.startswith("Before"):
            print(f"ended processing test cases with line {bef}")
            break
        if len(tester(bef, instr, after)) >= 3:
            total += 1
    return total

def solve2(prob):
    num_ops = len(VirtualMachine.OPERATIONS)
    lines = iter(prob)
    test_cases = []
    while lines:
        bef = next(lines)
        if not bef.startswith("Before"):
            print(f"ended processing test cases with line {bef}")
            break
        instr, after, _ = next(lines), next(lines), next(lines)
        test_cases.append((bef, instr, after))
    total = 0
    possible = {i:VirtualMachine.OPERATIONS.copy() for i in range(num_ops)}
    identified = {}
    while len(identified) < num_ops:
        for (bef, instr, after) in test_cases:
            opcode = int(instr.split(" ")[0])
            possible[opcode] = set(tester(bef, instr, after)) & possible[opcode]
            if len(possible[opcode]) == 1:
                instruction = possible[opcode].pop()
                print(f"Identified opcode {opcode} as instruction {instruction}.")
                identified[opcode] = instruction
                for unindentified in possible.values():
                    if instruction in unindentified:
                        unindentified.remove(instruction)
    runner = VirtualMachine()
    for line in lines:
        if line.strip():
            l = line.split()
            runner.do_instruction(identified[int(l[0])], int(l[1]), int(l[2]), int(l[3]))
    return runner.registers[0]
        
print(solve2(INPUT))