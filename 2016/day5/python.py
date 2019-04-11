from hashlib import md5
import time, random

class Day1:
    def __init__(self, puzzle, max_len=8):
        self.puzzle = puzzle.encode('ascii')
        self.answer = []
        self.max_len = max_len
        self.start, self.end, self.loops = 0, 0, 0

    def check_hash(self, i):
        hash = md5(self.puzzle + str(i).encode('ascii')).hexdigest()
        if hash.startswith('00000'):
            self.answer.append(hash[5])
        return hash[5]
    
    def solve(self):
        i = 0
        self.start = time.time()
        print("Decrypting: {0}{1}".format("_" * self.max_len, "\b" * self.max_len), flush=True, end="")
        answers = 0
        while len(self.answer) < self.max_len:
            candidate = self.check_hash(i)
            if i % 5_000 == 0:
                print("{0}\b".format(candidate), flush=True, end='')
            if len(self.answer) > answers:
                answers = len(self.answer)
                print("{0}".format(candidate), flush=True, end='')
            i += 1
        self.end = time.time()
        self.loops = i
        return "".join(self.answer)
    
    def print_stats(self):
        print(f"Took {self.end-self.start} seconds to check {self.loops} hashes.")

class Day2(Day1):
    def __init__(self, puzzle, max_len=8):
        super().__init__(puzzle, max_len)
        self.answer = {i:None for i in range(8)}

    def check_hash(self, i):
        hash = md5(self.puzzle + str(i).encode('ascii')).hexdigest()
        pos, candidate = int(hash[5], 16), hash[6]
        if hash.startswith('00000'):
            if pos in self.answer and self.answer[pos] is None:
                self.answer[pos] = candidate
        return candidate
    
    def solve(self):
        i = 0
        self.start = time.time()
        print("Decrypting: {0}{1}".format("_" * self.max_len, "\b" * self.max_len), flush=True, end="")
        unsolved = self.answer.keys()
        write = ["_"] * self.max_len
        while len(unsolved) > 0:
            candidate = self.check_hash(i)
            unsolved = [k for k,v in self.answer.items() if v is None]
            if i % 10_000 == 0:
                write[random.choice(unsolved)] = candidate
                for k,v in self.answer.items():
                    if v is not None:
                        write[k] = v
                print("{0}{1}".format("".join(write), "\b" * self.max_len), flush=True, end='')
            i += 1
            self.loops = i
        self.end = time.time()
        self.loops = i
        return "".join(self.answer[pos] for pos in range(self.max_len))

if __name__ == "__main__":
    #problem = Day1("wtnhxymk")
    problem = Day2("wtnhxymk")
    answer = problem.solve()
    print(f"\rAnswer: {answer:<30}")
    problem.print_stats()