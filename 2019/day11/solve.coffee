fs = require('fs')
input = fs.readFileSync 'input.txt', 'utf-8'

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

class InputWaitError extends Error

class CPU
    constructor: (program) ->
        @ip = 0
        @rel_base = 0
        @should_run = true
        @program = new Proxy([program...], new sparseArrayWithDefault(0))
        @_input = []
        @_output = []

    input: -> 
        if not @_input.length
            throw new InputWaitError("Empty input!")
        return @_input.shift()
    
    output: -> @_output.shift()

    hasOutput: -> !!@_output.length

    sendInput: (i) ->
        @_input.push(i)
        this

    sendOutput: (o) ->
        #console.log("    Output: #{o}")
        @_output.push(o)
    
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
                @sendOutput(@parameter(1))
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
                @should_run = false
                console.log("halted!")
            else throw new Error("Unknown opcode #{opcode} at position #{@ip}!")

class PaintGrid
    constructor: () ->
        @map = new Map()
    
    get: (x, y) ->
        serial = "#{x},#{y}"
        if @map.has serial
            @map.get serial
        else
            "."
    
    set: (x, y, val) ->
        console.log("painting #{x}, #{y} to #{val}")
        @map.set "#{x},#{y}", val
    
    print: ->
        highest_y = -Infinity
        lowest_y = Infinity
        highest_x = -Infinity
        lowest_x = Infinity
        for k from @map.keys()
            [x,y] = (Number(n) for n in k.split(","))
            if x > highest_x
                highest_x = x 
            else if x < lowest_x
                lowest_x = x 
            if y > highest_y
                highest_y = y 
            else if y < lowest_y 
                lowest_y = y 
        for y in [highest_y+1..lowest_y-1]
            lb = []
            for x in [lowest_x..highest_x]
                lb.push(@get(x,y))
            console.log(lb.join(""))
    
class Direction
    constructor: () ->
        @current = [0,1]

    left : ->
        switch
            when @current[0] is 0 and @current[1] is 1
                @current = [-1, 0]
            when @current[0] is -1 and @current[1] is 0
                @current = [0, -1]
            when @current[0] is 0 and @current[1] is -1
                @current = [1, 0]
            when @current[0] is 1 and @current[1] is 0
                @current = [0, 1]

    right : ->
        switch
            when @current[0] is 0 and @current[1] is 1
                @current = [1, 0]
            when @current[0] is 1 and @current[1] is 0
                @current = [0, -1]
            when @current[0] is 0 and @current[1] is -1
                @current = [-1, 0]
            when @current[0] is -1 and @current[1] is 0
                @current = [0, 1]

    name : ->
        switch
            when @current[0] is 0 and @current[1] is 1
                "Up"
            when @current[0] is 1 and @current[1] is 0
                "Right"
            when @current[0] is 0 and @current[1] is -1
                "Down"
            when @current[0] is -1 and @current[1] is 0
                "Left"

class Robot
    constructor: (program) ->
        @grid = new PaintGrid
        @dir = new Direction
        @cpu = new CPU(program)
        @pos = [0,0]
    
    runCPU: (stopCondition = null) ->
        while @cpu.should_run
            @cpu.step()
            if stopCondition?()
                return
        throw Error("CPU stopped unexpectedly!")

    step: ->
        try
            @runCPU()
        catch error
            if not (error instanceof InputWaitError)
                throw error                
        color = switch @grid.get(@pos[0], @pos[1])
            when "." then 0
            else 1
        @cpu.sendInput(color)
        @runCPU(() => @cpu.hasOutput())
        new_color = @cpu.output()
        @grid.set(@pos[0], @pos[1], switch new_color
            when 0 then "."
            else "#")
        @runCPU(() => @cpu.hasOutput())
        switch @cpu.output()
            when 0 then @dir.left()
            else @dir.right()
        @pos = [@dir.current[0] + @pos[0], @dir.current[1] + @pos[1]]
        #console.log "turning #{@dir.name()} to pos #{@pos[0]}, #{@pos[1]}"

    should_run: ->
        @cpu.should_run

one = (input) ->
    robo = new Robot(input)
    try
        while robo.should_run
            robo.step()
    Array.from(robo.grid.map.keys()).length

two = (input) ->
    robo = new Robot(input)
    robo.grid.set(0,0,"#")
    try
        while robo.should_run
            robo.step()
    robo.grid.print()

console.log(one(parseInput(input)))
two(parseInput(input))