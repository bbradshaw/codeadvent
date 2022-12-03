#!/usr/bin/env python3

from itertools import *
from functools import reduce
from pprint import pprint

def cos(x):
	if x == 90:
		return 0
	if x == 180:
		return -1
	if x == 270:
		return 0
	assert x == 0
	return 1

def sin(x):
	if x == 90:
		return 1
	if x == 180:
		return 0
	if x == 270:
		return -1
	assert x == 0
	return 0

def rotate3d_z(x, y, z, theta):
	c, s = cos(theta), sin(theta)
	return (x*c - y*s, x*s+y*c, z)

def rotate3d_x(x, y, z, theta):
	c, s = cos(theta), sin(theta)
	return (x, y*c - z*s, y*s + z*c)

def rotate3d_y(x, y, z, theta):
	c, s = cos(theta), sin(theta)
	return (x*c + z*s, y, -x*s + z*c)

def apply(rx, ry, rz):
	def f(x, y, z):
		nonlocal rx, ry, rz
		x, y, z = rotate3d_x(x, y, z, rx)
		x, y, z = rotate3d_y(x, y, z, ry)
		return rotate3d_z(x, y, z, rz)
	return f

facings = [
	apply(  0,   0,   0),
	apply( 90,   0,   0),
	apply(180,   0,   0),
	apply(270,   0,   0),
	apply(  0,  90,   0),
	apply( 90,  90,   0),
	apply(180,  90,   0),
	apply(270,  90,   0),
	apply(  0, 180,   0),
	apply( 90, 180,   0),
	apply(180, 180,   0),
	apply(270, 180,   0),
	apply(  0, 270,   0),
	apply( 90, 270,   0),
	apply(180, 270,   0),
	apply(270, 270,   0),
	apply(  0,   0,  90),
	apply( 90,   0,  90),
	apply(180,   0,  90),
	apply(270,   0,  90),
	apply(  0,   0, 270),
	apply( 90,   0, 270),
	apply(180,   0, 270),
	apply(270,   0, 270),
]

assert len(facings) == 24

p = (1, 2, 3)
s = set()
for f in facings:
	s.add(f(*p))

assert len(s) == 24



lines = """--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14""".splitlines()


ans = 0
scanners = []

for line in lines:
	if not line:
		continue
	if line.startswith('---'):
		scanners.append([])
		continue

	scanners[-1].append(tuple(map(int, line.split(','))))

scanners = list(map(set, scanners))


vbase = ((1, 0, 0), (0, 1, 0), (0, 0, 1))
vx, vy, vz = vbase
bases = []

for f in facings:
	bases.append((f(*vx), f(*vy), f(*vz)))

# dump_iterable(sorted(bases))
assert len(set(bases)) == 24

# transform to coords from given basis to basis ((1, 0, 0), (0, 1, 0), (0, 0, 1))
def basis_transform(v, basis):
	a,b,c = basis[0]
	d,e,f = basis[1]
	g,h,i = basis[2]
	x,y,z = v
	return (a*x+b*y+c*z, d*x+e*y+f*z, g*x+h*y+i*z)

def diff(a, b):
	ax, ay, az = a
	bx, by, bz = b
	return (ax - bx, ay - by, az - bz)

def add(a, b):
	ax, ay, az = a
	bx, by, bz = b
	return (ax + bx, ay + by, az + bz)

def manhattan(a, b):
	ax, ay, az = a
	bx, by, bz = b
	return abs(ax - bx) + abs(ay - by) + abs(az - bz)

print('there are', len(scanners), 'scanners')


MATCH_THRESHOLD = 12
import sys

def common_points(s1, s2, i1, i2):
	# assume s1 is in "normal" base ((1, 0, 0), (0, 1, 0), (0, 0, 1))
	# make s2 face any possible way (any base), then convert its points to normal base
	#
	# then for each pair of points p1, p2 (p2 in normal base):
	#    if p1 and p2 identify the same beacon for s1 and s2, then p1 - p2 is the
	#    distance vector from s1 to s2
	#    this means that if we get this distance, and translate all points of s2 by
	#    this distance, we can check if at least 12 should line up with those of s1

	for basis in bases:
		new_s2 = tuple(basis_transform(vec, basis) for vec in s2)

		for p1, p2 in product(s1, new_s2):
			dist = diff(p1, p2)
			translated_s2 = set(add(p, dist) for p in new_s2)
			if len(s1 & translated_s2) >= MATCH_THRESHOLD:
				print('scanners', i1, 'and', i2, 'match: distance', dist, 'basis', basis)
				return translated_s2, dist

	return None, None

matched = {0: scanners[0]}
distances = [(0,0,0)]
done = set()

while True:
	for i in range(len(scanners)):
		if i in done or i not in matched:
			continue

		for j in range(len(scanners)):
			if j in matched or i == j:
				continue

			common, dist = common_points(matched[i], scanners[j], i, j)

			if common is not None:
				matched[j] = common
				distances.append(dist)

		done.add(i)

	if len(done) == len(scanners):
		break

all_points =  reduce(set.union, matched.values())
ans = len(all_points)

# 799 bad
print(1, ans)
pprint(distances)
best = max(starmap(manhattan, combinations(distances, 2)))

# 12238 nope
#advent.print_answer(2, best)

# Bif OOF!
# cpython Timer ./day19.py: 20.218s wall, 20.217s CPU
# pypy    Timer ./day19.py: 7.776s wall, 7.776s CPU