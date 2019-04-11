import itertools, os, string
INPUT = open(os.path.join(os.path.dirname(__file__), 'input.txt')).readlines()
TEST_INPUT = r"""/->-\        
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/  """.splitlines()

class Cart:
   FACINGS = {"<" : (-1, 0), "^" : (0, -1), ">" : (1, 0), "v" : (0, 1)}
   ID = iter(string.ascii_uppercase)

   def __init__(self, pos, facing):
      self.pos = pos
      self.facing = facing
      self.id = next(Cart.ID)
      self.turn = itertools.cycle(("left", "straight", "right"))

   def is_horizontal(self):
      return self.facing in ("<", ">")
   
   def move(self, cur_rail):
      if cur_rail == "/":
         self.facing = {"<": "v", "^": ">", ">": "^", "v": "<" }[self.facing]
      elif cur_rail == "\\":
         self.facing = {"<": "^", "^": "<", ">": "v", "v": ">" }[self.facing]
      elif cur_rail == "+":
         turn = next(self.turn)
         if turn == "left":
            self.facing = {"<": "v", "^": "<", ">": "^", "v": ">"}[self.facing]
         elif turn == "right":
            self.facing = {"<": "^", "^": ">", ">": "v", "v": "<"}[self.facing]
      direction = self.FACINGS[self.facing]
      self.pos = (self.pos[0] + direction[0], self.pos[1] + direction[1])
      return self.pos
   
   @property
   def turn_order(self):
      return self.pos[1], self.pos[0]

class Tracks:
   def __init__(self, lines):
      self.width = len(lines[0])
      self.coords = {}
      self.carts = []
      self._ticks = 0
      for y, line in enumerate(lines):
         for x, c in enumerate(line):
            if c in Cart.FACINGS:
               cart = Cart((x, y), c)
               if cart.is_horizontal():
                  c = "-"
               else:
                  c = "|"
               self.carts.append(cart)
            self.coords[x, y] = c
      self.height = y

   def tick(self, remove_crashes=False):
      self._ticks += 1
      crashed_carts = []
      for cart in sorted(self.carts, key=lambda c:c.turn_order):
         if cart in crashed_carts:
            continue
         new_pos = cart.move(self.coords[cart.pos])
         #print(f"cart {cart.id} moved to {new_pos}.")
         for c in (c for c in self.carts if c != cart and c not in crashed_carts):
            if new_pos == c.pos:
               print(f"collision! at {new_pos}.")
               if remove_crashes:
                  crashed_carts.extend((c,cart))
               else:
                  return new_pos
      for cart in crashed_carts:
         self.carts.remove(cart)
   
   def show(self):
      import time
      carts = {cart.pos : cart for cart in self.carts}
      os.system('cls')
      for y in range(min(self.height, 40)):
         for x in range(self.width):
            if (x,y) in carts:
               print(carts[x,y].id, end ='')
            else:
               print(self.coords[x,y], end='')
         print()
      print()
      time.sleep(1)

def solve1(prob):
   tracks = Tracks(prob)
   for _ in range(400):
      tracks.show()
      c = tracks.tick()
      if c:
         return c

def solve2(prob):
   tracks = Tracks(prob)
   while True:
      if len(tracks.carts) == 1:
         return tracks.carts[0].pos
      tracks.tick(True)

print(solve1(INPUT))
print(solve2(INPUT))