class CPU
    constructor: (program) ->
        @ip = 0
        @rel_base = 0
        @should_run = true
        @program = @parseProgram(program)
        @callbacks = {}
    
    parseProgram: (input) ->
        Number(x) for x in input.replace(/\n$/, "").split(',')

    run: ->
        doRun = () =>
            if @should_run
                @step()
                setImmediate doRun
        setImmediate doRun

    getMem: (loc) ->
        if @program[loc]?
            return @program[loc]
        return 0
    
    setMem: (loc, val) ->
        @program[loc] = val

    error: (err) ->
        if @callbacks.error?()
            callback.error(err)
        else
            throw new Error err

    input: -> 
        if not @callbacks.input?
            @error("no input callback and input required")
        @callbacks.input (err, data) ->
            if err?
                @error err
            return data

    output: (out) -> 
        if@callbacks.output?
            @callbacks.output out
        else
            console.log("  Output: #{out}")

    on: (evtName, cb) ->
        @callbacks[evtName] = cb
    
    halt: ->
        @should_run = false
        if @callbacks.halt?
            @callbacks.halt @ip
        else
            console.log("halted!")
    
    parameter: (pos) ->
        this_mode = @mode[pos]
        switch this_mode
            when 0 then @getMem(@getMem(@ip + pos))
            when 1 then @getMem(@ip + pos)
            when 2 then @getMem(@getMem(@ip + pos) + @rel_base)
            else @error("Unknown parameter mode #{this_mode}")
    
    setParameter: (pos, val) ->
        this_mode = @mode[pos]
        switch this_mode
            when 0 then @setMem @getMem(@ip + pos), val
            when 2 then @setMem(@getMem(@ip + pos) + @rel_base, val)
            else @error("Unknown setParameter mode #{this_mode}")

    decodeOpcode: ->
        raw = @getMem(@ip).toString().padStart(5, '0')
        opcode = Number(raw[3..])
        modes = 
            1 : Number(raw[2])
            2 : Number(raw[1])
            3 : Number(raw[0])
        return [opcode, modes]
    
    step: ->
        [opcode, @mode] = @decodeOpcode()
        switch opcode
            when 1
                @setParameter(3, @parameter(1) + @parameter(2))
                @ip += 4
            when 2
                @setParameter(3, @parameter(1) * @parameter(2))
                @ip += 4
            when 3
                @setParameter(1, @input())
                @ip += 2
            when 4
                @output(@parameter(1))
                @ip += 2
            when 5
                if @parameter(1) isnt 0
                    @ip = @parameter(2)
                else
                    @ip += 3
            when 6
                if @parameter(1) is 0
                    @ip = @parameter(2)
                else
                    @ip += 3
            when 7
                if @parameter(1) < @parameter(2)
                    @setParameter(3, 1)
                else
                    @setParameter(3, 0)
                @ip += 4
            when 8
                if @parameter(1) is @parameter(2)
                    @setParameter(3, 1)
                else
                    @setParameter(3, 0)
                @ip += 4
            when 9
                @rel_base += @parameter(1)
                @ip += 2
            when 99
                @halt()
            else @error("Unknown opcode #{opcode} at position #{@ip}!")

class roboController
    constructor: ->
        @rx = 0
        @ry = 0
        @lastMove = null
        @map = new Map
        @max = [null, null]
        @min = [null, null]
        @back = new Map
        @target = null
    
    direction: (cmd) ->
        switch(cmd)
            when 1 then [0,  1]
            when 2 then [0, -1]
            when 3 then [-1, 0]
            when 4 then [1,  0]
    
    getCmdToGoTo: (start, end) ->
        switch
            when start[0] > end[0] then 3
            when start[0] < end[0] then 4
            when start[1] > end[1] then 2
            when start[1] < end[1] then 1

    go: (cmd, roboInputCb) ->
        @lastMove = @direction cmd
        roboInputCb null, cmd
    
    nextPosition: ->
        [@rx + @lastMove[0], @ry + @lastMove[1]]
    
    confirmMove: ->
        [prevX, prevY] = [@rx, @ry]
        [@rx, @ry] = @nextPosition()
        if not @back.has(@_serial([@rx, @ry]) )
            @back.set @_serial([@rx, @ry]), [prevX, prevY]
        if not @max[0]? or @rx > @max[0]
            @max[0] = @rx
        if not @max[1]? or @ry > @max[1]
            @max[1] = @ry
        if not @min[0]? or @rx < @min[0]
            @min[0] = @rx
        if not @min[1]? or @ry < @min[1]
            @min[1] = @ry    
    
    _serial: (pos) -> "#{pos[0]},#{pos[1]}"

    markExplored: (type) ->
        if type is "O"
            @target = @nextPosition()
        @map.set @_serial(@nextPosition()), type

    choose: ->
        for dir in [1,2,3,4]
            vec = @direction dir
            if not @map.has @_serial [vec[0] + @rx, vec[1] + @ry]
                return dir
        prev_place = @back.get(@_serial [@rx, @ry])
        @getCmdToGoTo([@rx, @ry], prev_place)
    
    printMap: ->
        for y in [@max[1]..@min[1]]
            line = []
            for x in [@min[0]..@max[1]]
                if x is @rx and y is @ry
                    line.push "R"
                else
                    line.push @map.get @_serial([x,y]) or " "
            console.log line.join("")
        null
    
    isDone : ->
        if @rx is 0 and @ry is 0
            for vec in [[0,  1]
                        [0, -1]
                        [-1, 0]
                        [1,  0]]
                if not @_serial vec in @map
                    return false
            return true

neighbors = (control, sp) ->
    p = (Number(c) for c in sp.split ",")
    s = control._serial
    nowall = []
    for i in [1..4]
        vec = control.direction i
        test = [p[0] + vec[0], p[1] + vec[1]]
        if control.map.get(s test) isnt "#"
            nowall.push test
    nowall

a_star = (start, control) ->
    goal = control.target
    heuristic = (p) ->
        Math.abs(goal[1] - p[1]) + Math.abs(goal[0] - p[0])
    path = (end) ->
        steps = 0
        cur = end
        while cameFrom.has(cur)
            cur = cameFrom.get(cur)
            steps += 1
        steps
    s = control._serial
    visited = new Set [s start]
    cameFrom = new Map
    g = new Map
    f = new Map
    f.set s(start), heuristic(start)
    g.set s(start), 0

    while visited.size
        cur = Array.from(visited).reduce( (acc,k) =>  if f[k] < f[acc] then k else acc)
        if cur is s goal
            return path cur
        visited.delete(cur)
        for candidate in neighbors(control, cur)
            calc_g = g.get(cur) + 1
            serCan = s candidate
            if (g.has(serCan) and g.get(serCan) > calc_g) or (not g.has(serCan))
                cameFrom.set(serCan, cur)
                g.set serCan, calc_g
                f.set serCan, g.get(serCan) + heuristic(candidate)
                if serCan not in visited
                    visited.add serCan
    throw new Error "Failed to find path!"

fill = (control) ->
    time = 0
    s = control._serial
    oxygen = new Set [s control.target]
    vacuumLen = (v for v from control.map.values() when v is ".").length

    vacuumLen += 1 #start
    while oxygen.size < vacuumLen
        time += 1
        nowoxygen = Array.from(oxygen)
        for spot from nowoxygen
            for nowall in neighbors(control, spot)
                oxygen.add s nowall
    time
    
fs = require 'fs'
input = fs.readFileSync 'input.txt', 'utf-8'

one = (input, answerCB) ->
    robo = new CPU input
    control = new roboController
    robo.on 'output', (data) ->
        switch data
            when 0
                #console.log "hit wall at #{control.nextPosition()}!"
                control.markExplored "#"
            when 1
                #console.log "moved to #{control.nextPosition()}!"
                control.markExplored "."
                control.confirmMove()
                if control.isDone()
                    robo.halt()
                    if not control.target?
                        throw new Error "Robo failed to find target!"
                    answerCB a_star([0,0], control)
            when 2
                console.log "found mcguffin at #{control.nextPosition()}!"
                control.markExplored "O"
                control.confirmMove()
    
    robo.on 'input', (cb) ->
        way = control.choose()
        control.go way, cb

    robo.on 'halt', (ip) ->
        control.printMap()
    
    robo.run()

two = (input, answerCB) ->
    robo = new CPU input
    control = new roboController
    robo.on 'output', (data) ->
        switch data
            when 0
                #console.log "hit wall at #{control.nextPosition()}!"
                control.markExplored "#"
            when 1
                #console.log "moved to #{control.nextPosition()}!"
                control.markExplored "."
                control.confirmMove()
                if control.isDone()
                    robo.halt()
                    if not control.target?
                        throw new Error "Robo failed to find target!"
                    answerCB fill(control)
            when 2
                console.log "found mcguffin at #{control.nextPosition()}!"
                control.markExplored "O"
                control.confirmMove()
    
    robo.on 'input', (cb) ->
        way = control.choose()
        control.go way, cb

    robo.on 'halt', (ip) ->
        control.printMap()
    
    robo.run()

one input, (answer) ->
    console.log answer

two input, (answer) ->
    console.log answer