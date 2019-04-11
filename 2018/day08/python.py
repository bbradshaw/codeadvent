import os, itertools, collections, string
INPUT = open(os.path.join(os.path.dirname(__file__), "input.txt")).read()

TEST_INPUT = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2"

def calculate_node_value(node):
    if node['id'] in calculate_node_value.cache:
        return calculate_node_value.cache[node['id']]
    if node['n_child'] == 0:
        answer = sum(node['meta'])
    else:
        acc = 0
        for ident in node['meta']:
            try:
                child = node['children'][ident-1]
                acc += calculate_node_value(child)
            except IndexError:
                pass
        answer = acc
    calculate_node_value.cache[node['id']] = answer
    return answer
calculate_node_value.cache = {}

def solve(prob, answer=1):
    data = [int(i) for i in prob.split()]
    ids = ("".join(l) for l in itertools.combinations(string.ascii_uppercase, 3))
    i = 2
    nodes = []
    node_stack = [{"id" : next(ids), "n_child" : data[0], "n_meta" : data[1], "children" : []}]
    while node_stack:
        if node_stack[-1]["n_child"] > len(node_stack[-1]["children"]):
            new_node = {"id" : next(ids), "n_child" : data[i], "n_meta" : data[i+1], "children" : []}
            i += 2
            node_stack.append(new_node)
            continue
        else:
            n_meta = node_stack[-1]["n_meta"]
            meta = data[i:i+n_meta]
            i += n_meta
            node_stack[-1]["meta"] = meta
            finished_node = node_stack.pop()
            if node_stack:
                node_stack[-1]['children'].append(finished_node)
            nodes.append(finished_node)
    #for n in nodes:  print(n)
    if answer == 1:
        return sum(sum(node['meta']) for node in nodes)
    if answer == 2:
        return calculate_node_value(nodes[-1])

print(solve(INPUT, 2))