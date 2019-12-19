input = """<x=3, y=15, z=8>
<x=5, y=-1, z=-2>
<x=-10, y=8, z=2>
<x=8, y=4, z=-5>"""

findGCD = (x,y) ->
    x = Math.abs x
    y = Math.abs y
    while y
        remain = x % y
        x = y 
        y = remain
    x

findLCM = (x,y) ->
    x*y / findGCD(x,y)

class Vector3
    constructor: (@x = 0, @y = 0, @z = 0) ->

    set: (vec) ->
        @x = vec.x
        @y = vec.y
        @z = vec.z
    
    add: (vec) -> new Vector3(@x + vec.x, @y + vec.y, @z + vec.z)
   
class Moon
    constructor: (@pos) ->
        @vel = new Vector3
    
    pnrg: ->
        Math.abs(@pos.x) + Math.abs(@pos.y) + Math.abs(@pos.z)

    knrg: ->
        Math.abs(@vel.x) + Math.abs(@vel.y) + Math.abs(@vel.z)

parseVec = (str) ->
    m = /<x=([^,]+), y=([^,]+), z=([^,]+)>/.exec(str)
    new Vector3(Number(m[1]), Number(m[2]), Number(m[3]))

combinations = (array) ->
    `array.reduce( (acc, v, i) => acc.concat(array.slice(i+1).map( w => [v,w])), [])`

gravityAdjust = (m1, m2) ->
    for d in ['x', 'y', 'z']
        avg = (m1.pos[d] + m2.pos[d]) / 2
        for m in [m1, m2]
            if avg > m.pos[d]
                m.vel[d] += 1
            if avg < m.pos[d]
                m.vel[d] -= 1

simulate = (system, n) ->
    pairs = combinations(system)
    for step in [0...n]
        for pair in pairs
            gravityAdjust(pair[0], pair[1])
        for moon in system
            moon.pos.set(moon.pos.add(moon.vel))

findCommon = (system) ->
    pairs = combinations(system)
    seen = {}
    for dimension in ['x', 'y', 'z']
        seen[dimension] = new Set
    serialize = (sys, d) ->
        r = ""
        for m in sys
            r+= "#{m.pos[d]},#{m.vel[d]},"
        r
    answer = {}
    for step in [0...10000000]
        for pair in pairs
            gravityAdjust pair[0], pair[1]
        for moon in system
            moon.pos.set(moon.pos.add(moon.vel))
        for dimension, seenD of seen
            s = serialize(system, dimension)
            if seenD.has(s)
                answer[dimension] = step
                delete seen[dimension]
                console.log "#{dimension} repeats at #{step}!"
            seenD.add(s)
        if Object.keys(seen).length < 1
            break
    return answer

one = (problem) ->
    system = (new Moon(parseVec(l)) for l in problem)
    simulate(system, 1000)
    nrg = (moon.pnrg() * moon.knrg() for moon in system)
    nrg.reduce (acc, v) ->
        acc + v
    , 0

two = (problem) ->
    system = (new Moon(parseVec(l)) for l in problem)
    answer = findCommon system
    return findLCM findLCM(answer.x, answer.y), answer.z


#console.log(one(input.split("\n")))
console.log(two(input.split("\n")))