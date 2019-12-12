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
        most = [count.entries()...].reduce((high, k_v) => if (k_v[1] > high[1]) then k_v else high)
        return most

out = (a) ->
    console.log JSON.stringify a

one = (i) ->
    f = new AsteroidField(i)
    out(f.solve())

one(input)