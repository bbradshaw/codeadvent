
fs = require('fs')
input = fs.readFileSync('input.txt', 'utf-8')


parseInput = (input) ->
    Number(x) for x in input.replace(/\n$/, "").split(',')

sparseArrayWithDefault = (_default) ->
    @extra_keys = {}
    @get = (obj, prop) ->
        if prop >= obj.length
            if prop in @extra_keys
                return @extra_keys[prop]
            else
                return _default
        else
            return obj[prop]
    
    @set = (obj, key, val) ->
        if key >= obj.length
            @extra_keys[key] = val
        else
            obj[key] = val
        true

class CPU
    constructor: (program) ->
        @ip = 0
        @rel_base = 0
        @should_run = true
        @program = new Proxy([program...], new sparseArrayWithDefault(0))
        @callbacks = {}
        @async = true
        @cycleDelay = 0
    
    run: ->
        doRun = () =>
            if @should_run
                @step()
                if @cycleDelay > 0
                    setTimeout doRun, @cycleDelay
                else
                    setImmediate doRun
        if @async
                setImmediate doRun
        else
            while @should_run
                @step()
    
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
            when 0 then @program[@program[@ip + pos]]
            when 1 then @program[@ip + pos]
            when 2 then @program[@program[@ip + pos] + @rel_base]
            else throw new Error("Unknown parameter mode #{this_mode}")
    
    setParameter: (pos, val) ->
        this_mode = @mode[pos]
        switch this_mode
            when 0 then @program[@program[@ip + pos]] = val
            when 2 then @program[@program[@ip + pos] + @rel_base] = val
            else throw new Error("Unknown setParameter mode #{this_mode}")

    decodeOpcode: ->
        raw = @program[@ip].toString().padStart(5, '0')
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
            else throw new Error("Unknown opcode #{opcode} at position #{@ip}!")

class Grid
    constructor: () ->
        @map = new Map()
        @max = [-Infinity, -Infinity]
        @min = [Infinity, Infinity]
    
    get: (x, y) ->
        serial = "#{x},#{y}"
        @map.get serial
    
    recordSpecial: (x, y, val) ->
        switch(val)
            when 3 then @ball = [x,y]
            when 4 then @paddle = [x,y]

    set: (x, y, val) ->
        serial = "#{x},#{y}"
        @map.set "#{x},#{y}", val
        x= Number(x)
        y= Number(y)
        if x is -1 and y is 0 and val isnt 0
            @score = val
            return
        @recordSpecial(x,y,val)
        if x > @max[0]
            @max[0] = x
        if y > @max[1]
            @max[1] = y
        if x < @min[0]
            @min[0] = x
        if y < @min[1]
           @min[1] = y

    deserial: (str) ->
        [x,y] = str.split(",")
        return [Number(x), Number(y)]
    
    keys: ->
        for k from @map.keys()
            @deserial k
    
    print: ->
        for y in [@min[1]..@max[1]]
            line = []
            for x in [@min[0]..@max[0]]
                line.push switch @get(x, y)
                    when 0 then " "
                    when 1 then "+"
                    when 2 then "#"
                    when 3 then "_"
                    when 4 then "*"
            console.log line.join ""
            line.length = 0
        console.log "Score #{@score}"

one = (problem, answer_cb) ->
    cpu = new CPU(problem)
    screen = new Grid
    buffer = []
    cpu.on 'output', (data) ->
        buffer.push data
        if buffer.length > 2
            screen.set(buffer[0], buffer[1], Number(buffer[2]))
            buffer.length = 0
    cpu.on 'halt', (ip) ->
        console.log "Halted at instruction #{ip}!"
        answer = 0
        for [x,y] in screen.keys()
            if x >= 0 and y >=0 and screen.get(x,y) == 2
                answer +=1
        screen.print()
        console.log "Grid dimensions #{screen.min[0]} - #{screen.max[0]}, #{screen.min[1]} - #{screen.max[1]}."
        answer_cb(answer)
    cpu.run()
   

two = (problem) ->
    cpu = new CPU(problem)
    screen = new Grid
    buffer = []
    cpu.program[0] = 2
    cpu.on 'output', (data) ->
        buffer.push data
        if buffer.length > 2
            screen.set(buffer[0], buffer[1], Number(buffer[2]))
            buffer.length = 0
            process.stdout.write('\u001B[2J\u001B[0;0f')
            screen.print()
            cpu.outputDelay = 10
    cpu.on 'input', (cb) ->
        ballx = screen.ball[0]
        paddlex = screen.paddle[0]
        dir = 0
        if ballx < paddlex 
            dir = 1 
        else if ballx > paddlex
            dir = -1
        cb null, dir
    cpu.on 'halt', (ip) ->
        console.log "Halted at instruction #{ip}!"
        answer = 0
    cpu.run()

one parseInput(input), (answer) ->
    console.log answer
console.log two parseInput input