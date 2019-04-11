def gen(factor, start, filter=1):
	while True:
		start = (start * factor) % 2147483647
		if start % filter != 0:
			continue
		yield start

def solve_day_15_1():
	a = gen(16807, 277 )
	b = gen(48271,349 )
	cnt=0
	for _ in range(40_000_000):
		#print(f"{next(a) }\t\t{next(b)}")
		if (next(a) & 0xffff) == (next(b) & 0xffff):
			cnt += 1
	print(f"{cnt}")

def solve_day_15_2():
	a = gen(16807, 277,4)
	b = gen(48271,349,8)
	cnt=0
	for i in range(5_000_000):
		if i % 100_000 == 0:
			print(f"{i}")
		#print(f"{next(a) }\t\t{next(b)}")
		if (next(a) & 0xffff) == (next(b) & 0xffff):
			cnt += 1
	print(f"{cnt}")

solve_day_15_1()
#solve_day_15_2()