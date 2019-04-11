import os, itertools, re, collections, time
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).readlines()
COORDS = re.compile(r"position=<([^>]+)> velocity=<([^>]+)>")
TEST_INPUT = """position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>""".splitlines()

class Star:
    def __init__(self, raw):
        match = COORDS.match(raw)
        self.pos = tuple(int(i) for i in match.group(1).split(","))
        self.vel = tuple(int(i) for i in match.group(2).split(","))

    def x(self, t):
        return self.pos[0] + self.vel[0] * t
    
    def y(self, t):
        return self.pos[1] + self.vel[1] * t
    
    @classmethod
    def print_at(cls, upperleft, star_pos):
        xs = list(range(upperleft[0], upperleft[0]+81))
        ys = list(range(upperleft[1], upperleft[1]+51))
        visual = {(x,y) : "." for x,y in itertools.product(xs,ys)}
        for (x,y) in star_pos:
            if (x,y) in visual:
                visual[(x,y)] = "#"
        for y in ys:
            for x in xs:
                print(visual[(x,y)], end='')
            print()

def solve1(prob):
    stars = [Star(line) for line in prob]
    for t in range(1_000_000):
        star_pos = [(s.x(t), s.y(t)) for s in stars]
        min_x = min(star_pos)[0]
        max_x = max(star_pos)[0]
        min_y = min(star_pos, key=lambda s:s[1])[1]
        max_y = max(star_pos, key=lambda s:s[1])[1]

        if (max_x - min_x < 80) and (max_y - min_y < 50):
            print(f"t = {t} at ({min_x}, {min_y})")
            Star.print_at((min_x, min_y), star_pos)
            time.sleep(5)
            os.system('cls')
        
solve1(INPUT)
