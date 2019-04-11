import re
from collections import Counter
import multiprocessing as mp
from functools import partial
example ="""p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>
p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0> """
class Vector:
	def __init__(self, x, y, z):
		self.x = x
		self.y = y
		self.z = z

	@classmethod
	def from_text(cls, raw):
		return cls(*(int(co) for co in raw.split(",")))

	@property
	def manhattan(self):
		return abs(self.x) + abs(self.y) + abs(self.z)

	def __repr__(self):
		return f"({self.x}, {self.y}, {self.z})"

	def __eq__(self, other):
		return self.x == other.x and self.y == other.y and self.z == other.z

	def __hash__(self):
		return hash((self.x, self.y, self.z))

class Particle:
	NUM = 0
	regex=re.compile("p=<(?P<position>[^>]+)>, v=<(?P<velocity>[^>]+)>, a=<(?P<acceleration>[^>]+)>")
	def __init__(self, raw):
		m = Particle.regex.match(raw)
		d = m.groupdict()
		self.position = Vector.from_text(d['position'])
		self.velocity = Vector.from_text(d['velocity'])
		self.acceleration = Vector.from_text(d['acceleration'])
		self.num = Particle.NUM
		Particle.NUM += 1

	def __repr__(self):
		return f"Particle{{n: {self.num} p: {self.position} v: {self.velocity} a: {self.acceleration}}}"

	def position_at(self, time):
		position = Vector(0,0,0)
		for coord in ('x', 'y', 'z'):
			accel, vel, pos = getattr(self.acceleration, coord), getattr(self.velocity, coord), getattr(self.position, coord)
			calc = accel*((time**2 + time)/2) + vel*time + pos
			setattr(position, coord, calc)
		return position

def solve_day20_1(particles):
	p = min(particles, key=lambda p:p.acceleration.manhattan)
	return p

def mp_get_position(time, particle):
	return (particle.num, particle.position_at(time))

def solve_day20_2(particles):
	live_particles = particles[:]
	time = 0
	#pool = mp.Pool(5)
	while time < 10_000:
		pos_now = partial(mp_get_position, time)
		#positions = dict(pool.map(pos_now, live_particles))
		positions = {p.num : p.position_at(time) for p in live_particles }
		if all (pos.manhattan > 100_000 for pos in positions.values()):
			print(f"100,000 away at time {time}")
			break
		at_pos_count = Counter(positions.values())
		for at_pos, n_collisions in at_pos_count.items():
			if n_collisions < 2:
				continue
			culled_particles = {part for part in live_particles if positions[part.num] == at_pos }
			assert(len(culled_particles) == n_collisions)
			print(f"culled {n_collisions} particles at time {time}")
			live_particles = [part for part in live_particles if part.num not in (cull.num for cull in culled_particles)]
		time += 1
		if time % 1000 == 0:
			print(f"simulating time {time}\r", end="")
	return len(live_particles)

if __name__ == "__main__":
	with open(r"C:\Users\Ben\Documents\adventcode\day20_input.txt") as f:
		data = f.read()
		particles = [Particle(line) for line in data.splitlines()]
	print(solve_day20_1(particles))
	print(solve_day20_2(particles))