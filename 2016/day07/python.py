INPUT = open("input.txt").read()
import re

def abba_checker(txt, window_size = 4):
    half_window = window_size // 2
    for i in range(len(txt) - window_size + 1):
        if txt[i:i + half_window] == "".join(reversed(txt[i + half_window:i + window_size])):
            if txt[i] != txt[i+1]:
                return txt[i:i + window_size]
    return None

def return_matching_abas(txt, invert=False):
    matching = []
    for a,b,c in zip(txt, txt[1:], txt[2:]):
        if a != b and a == c:
            if invert:
                matching.append(b + a + b)
            else:
                matching.append(a + b + c)
    return matching

def problem1(inp):
    acc = 0 
    for line in inp.splitlines():
        is_hyper = True
        is_tls = False
        for chunk in re.split("\[|\]", line):
            is_hyper = not is_hyper
            abba = abba_checker(chunk)
            if abba:
                if is_hyper:
                    is_tls = False
                    #print(f"rejected for hypernet {line}")
                    break
                else:
                    is_tls = True
        if is_tls:
            acc += 1
            #print (f'accepted line: {line}')
    return acc

def problem2(inp):
    acc = 0
    for line in inp.splitlines():
        chunks = re.split("\[|\]", line)
        super_abas = []
        hyper_babs = []
        for chunk in chunks[::2]:
            super_abas.extend(return_matching_abas(chunk))
        for chunk in chunks[1::2]:
            hyper_babs.extend(return_matching_abas(chunk, True))
        if any(aba for aba in super_abas if aba in hyper_babs):
            acc += 1
    return acc


if __name__ == "__main__":
    print(problem1(INPUT))
    print(problem2(INPUT))
