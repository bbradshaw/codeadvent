fs = require('fs')
input = fs.readFileSync('input.txt', 'utf-8').replace(/\n$/, "");

findGCD = (x,y) ->
    x = Math.abs x
    y = Math.abs y
    while y
        remain = x % y
        x = y 
        y = remain
    x

class AsteroidField
    constructor: (raw) ->
        @grid = (Array.from(line) for line in raw.split("\n"))
        @names = {}
        @asteroids = @_findAsteroids()
    
    _findAsteroids: () ->
        rs = []
        for row, rn in @grid
            for char, cn in row
                if char is "#"
                    rs.push [cn, rn]
            @max_x = cn - 1
        @max_y = rn - 1
        rs

    print: () ->
        names = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        n = 0
        b = []
        for row in @grid
            for char in row
                if char is "#"
                    b.push(names[n++])
                else
                    b.push(char)
            b.push("\n")
        console.log(b.join(""))
                    
    asteroidWouldBlock: (start, ex) ->
        dx = ex[0] - start[0]
        dy = ex[1] - start[1]
        gcd = findGCD dx, dy
        slope_x = dx / gcd
        slope_y = dy / gcd
        mult = 1
        loop
            blocked_x = slope_x * mult + ex[0]
            blocked_y = slope_y * mult + ex[1]
            break if (blocked_x > @max_x or blocked_x < 0)
            break if (blocked_y > @max_y or blocked_y < 0)
            mult += 1
            [blocked_x, blocked_y]
    
    otherAsteroids: (thisOne) ->
        (a for a in @asteroids when not @isSame(thisOne, a))
    
    isSame: (a, b) ->
        a[0] is b[0] and a[1] is b[1]

    solve: () ->
        count = new Map()
        for ast in @asteroids
            blockedVis = []
            view = 0
            for o in @otherAsteroids(ast)
                blockedVis = blockedVis.concat(@asteroidWouldBlock(ast,o))
            for o in @otherAsteroids(ast)
                if not blockedVis.some((z) => @isSame(o,z))
                    view++
            count.set JSON.stringify(ast), view
        most = Array.from(count.entries()).reduce((high, k_v) => if (k_v[1] > high[1]) then k_v else high)
        return most

class PolarAsteroids
    constructor: (af, coordinate) ->
        @xlate = new Map
        for ast in af.asteroids
            @relx = ast[0] - coordinate[0] #coordinate[0] - ast[0]
            @rely = ast[1] - coordinate[1]
            distance = Math.abs(@relx) + Math.abs(@rely)
            @xlate.set(JSON.stringify([distance, @relx, @rely]), ast)
    
    solve: () ->
        coordinates = []
        for coordinate from @xlate.keys()
            [distance, x, y] = JSON.parse coordinate
            if x isnt 0 or y isnt 0
                coordinates.push [distance, x, y]
        rotation = [new Map, new Map]
        for [distance, x, y] in coordinates
            if x >= 0
                rotation[0].set y/x, []
            else
                rotation[1].set y/x, []
        angles = [Array.from(rotation[0].keys()), Array.from(rotation[1].keys())]
        angles[0].sort( (a,b) => b-a)
        angles[1].sort( (a,b) => a-b)
        for [distance, x, y] in coordinates
            if x >= 0
                rotation[0].get(y/x).push([distance,x,y])
            else
                rotation[1].get(y/x).push [distance,x,y]
        for i in [0..1]
            for ang in angles[i]
                rotation[i].get(ang).sort((a,b) => a[0] - b[0])
        console.log "total angles: #{angles[0].length+angles[1].length}"
        asteroidDestroyed = 0
        while asteroidDestroyed < 201
            for i in [0..1]
                for angle in angles[i]
                    nxt = rotation[i].get(angle).shift()
                    if nxt?
                        asteroidDestroyed++
                        console.log "asteroid at relative coord [#{JSON.stringify @xlate.get JSON.stringify nxt}] destroyed (#{asteroidDestroyed}) with slope #{angle}"
                        if asteroidDestroyed == 200
                            return @xlate.get JSON.stringify nxt
                console.log "next half"

one = (i) ->
    f = new AsteroidField(i)
    return f.solve()

two = (i, x, y) ->
    f = new AsteroidField(i)

    p = new PolarAsteroids(f, [x,y])
    ans = p.solve()
    return ans[0]*100 + ans[1]


ans = one(input)
console.log ans
start = JSON.parse ans[0]
two input, start[0], start[1]
#two input, 11, 13
