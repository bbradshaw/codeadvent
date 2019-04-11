import re

INPUT = open("input.txt").read()

def decompress(txt):
    out = []
    comp_token = []
    comp_section = []
    state = "READ"
    for c in txt:
        if state == "READ":
            if c == "(":
                state = "COMP_TOKEN"
                continue
            else:
                out.append(c)
        elif state == "COMP_TOKEN":
            if c == ")":
                len_comp, multiplier = (int(i) for i in "".join(comp_token).split("x"))
                comp_token = []
                state = "READ_COMP"
                continue
            else:
                comp_token.append(c)
        elif state == "READ_COMP":
            len_comp -= 1
            if len_comp == 0:
                comp_section.append(c)
                for _ in range(multiplier):
                    out.extend(comp_section)
                comp_section = []
                state = "READ"
                continue
            else:
                comp_section.append(c)
    return "".join(out)

def not_whitespace(c):
    return c != " " and c != "\n"

def count(txt):
    marker = re.compile(r"\((\d+)x(\d+)\)")
    markers = [m.groupsmarker.findall(txt)

def problem1(inp):
    decompressed = decompress(inp)
    return len(decompressed.replace("\n", "").replace(" ", ""))

if __name__ == "__main__":
    print(problem1(INPUT))
    