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

class RoboController
    constructor: ->
        @rows = new Map
        @max_y = 0
        @max_x = 0
    
    get: (x, y) ->
        @rows.get(y)?[x]
    
    set: (x, y, val) ->
        if not @rows.has y
            @rows.set y, []
        r = @rows.get y
        r[x] = val
        if x > @max_x
            @max_x = x 
        if y > @max_y
            @max_y = y
    
    travel: ->
        for y in [0..@max_y]
            for x in [0..@max_x]
                yield [x,y]
    
    print: ->
        for y in [0..@max_y]
            buffer = []
            for x in [0..@max_x]
                buffer.push @get(x,y)
            console.log(buffer.join "")
    
    neighbors: (x, y, filter) ->
        a = []
        for [dx, dy] in [[1,0], [-1, 0], [0,1], [0,-1]]
            [npx, npy] = [x + dx, y + dy]
            if @get(npx, npy)? and filter(npx, npy)
                a.push [npx, npy]
        a

    findIntersections: ->
        sect = []
        for y in [0..@max_y]
            for x in [0..@max_x]
                if c = @get(x, y) is "#"
                    n = @neighbors x, y, (tx, ty) =>
                        @get(tx, ty) is "#"
                    if n.length is 4
                        sect.push [x,y]
        sect

outputHandler = (g) ->
    y = 0
    x = 0
    (chrCode) ->
        if chrCode is 10
            y++
            x = 0
        else
            g.set(x, y, String.fromCharCode(chrCode))
            x++

dfs = (graph, v) ->
    work = []
    visited = new Set
    fromWhere = new Map
    answer = []
    work.push v
    valid = (px, py) =>
        graph.get(px, py) isnt "."
    while work.length
        v = work.pop()
        if not visited.has "#{v}"
            visited.add "#{v}"
            answer.push v
            for n in graph.neighbors v..., valid
                work.push n
                fromWhere.set "#{n}", "#{v}"
    answer

one = (input, answerCB) ->
    cpu = new CPU(input)
    control = new RoboController

    cpu.on 'output', outputHandler(control)
    cpu.on 'halt', () ->
        answer = 0
        for [ix, iy] in control.findIntersections()
            control.set(ix, iy, "O")
            answer += ix * iy
        control.print()
        answerCB answer
    cpu.run()

two = (input, answerCB) ->
    cpu = new CPU(input)
    control = new RoboController

    cpu.on 'output', outputHandler(control)
    cpu.on 'halt', () ->
        start = null
        for [x,y] from control.travel()
            if control.get(x, y) is "^"
                start = [x,y]
                break
        buf = []
        for [x, y] in dfs(control, start)
            buf.push "#{[x,y]}"
        console.log buf.join " -> "
    cpu.run()

fs = require 'fs'
input = fs.readFileSync 'input.txt', 'utf-8'

#one input, (ans) ->
#    console.log ans

two input 