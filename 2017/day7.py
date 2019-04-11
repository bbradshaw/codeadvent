import re

def find_nonmatching_item(itr, key=lambda x:x):
	itr = iter(itr)
	try:
		first = next(itr)
		second = next(itr)
		cur = next(itr)
	except StopIteration:
		raise ValueError("find_nonmatching_item requires at least 3 values in iterator")
	first_val, second_val, cur_val = key(first), key(second), key(cur)
	if first_val != second_val:
		if first_val == cur_val:
			return second
		else:
			return first
	else:
		pattern = first_val
		while True:
			if cur_val != pattern:
				return cur
			try:
				cur = next(itr)
				cur_val = key(cur)
			except StopIteration:
				return None

class Node:
	RE = re.compile("(?P<name>[^ ]+) \\((?P<weight>\\d+)\\)(?: -> )?(?P<children>.+)?")

	def __init__(self, line):
		m = Node.RE.match(line)
		if not m:
			raise ValueError(f"Cannot parse line: {line}.")
		gd = m.groupdict()
		self.name = gd['name']
		self.weight = int(gd['weight'])
		self.children_names = []
		if gd.get("children"):
			self.children_names = [cn.strip() for cn in gd['children'].split(",")]
		self.parent_name = None
		self.parent = None
		self.children = []

	def __str__(self):
		return f"Node {self.name} ({self.weight})"

class Tower:
	def __init__(self, nodes):
		self._nodes = nodes
		for n in nodes:
			for other in nodes:
				if other.name in n.children_names:
					other.parent = n
					n.children.append(other)

	def find_root(self):
		for n in self._nodes:
			if n.parent == None:
				return n

	def calculate_total_weight(self, node):
		child_weight = sum(self.calculate_total_weight(c) for c in node.children)
		return child_weight + node.weight

	def __iter__(self):
		return self._iter_nodes(self.find_root())

	def _iter_nodes(self, node):
		yield node
		for child in node.children:
			for node in self._iter_nodes(child):
				yield node


with open(r"C:\Users\Ben\Documents\adventcode\day7_input.txt") as f:
	tower = Tower([Node(line) for line in f])
root = tower.find_root()
print(root)
for node in tower:
	if len(node.children) == 2:
		if node.children[0].weight != node.children[1].weight:
			print(f"{node.name} is unbalanced between {node.children[0].name} and {node.children[1].name}.")
	if len(node.children) > 2:
		unbalanced = find_nonmatching_item(node.children, lambda c:tower.calculate_total_weight(c) )
		if unbalanced:
			print(f"{node.name} is unbalanced by {unbalanced.name}.")
			for child in node.children:
				print(f"  {child.name}: {tower.calculate_total_weight(child)}")