input = "59796737047664322543488505082147966997246465580805791578417462788780740484409625674676660947541571448910007002821454068945653911486140823168233915285229075374000888029977800341663586046622003620770361738270014246730936046471831804308263177331723460787712423587453725840042234550299991238029307205348958992794024402253747340630378944672300874691478631846617861255015770298699407254311889484508545861264449878984624330324228278057377313029802505376260196904213746281830214352337622013473019245081834854781277565706545720492282616488950731291974328672252657631353765496979142830459889682475397686651923318015627694176893643969864689257620026916615305397"

generatePattern = (pos) ->
    for _ in [0...pos-1]
        yield 0
    for n in [1, 0, -1]
        for _ in [0...pos]
            yield n
    while true
        for n in [0, 1, 0, -1]
            for _ in [0...pos]
                yield n

digitFinder = (input) ->
    len = input.length
    answers = {}
    for i in [1..100]
        answers[i] = {}
    getDigitAt = (phase, pos) ->
        if pos > len
            throw "Exceeded length of array #{len} with position #{pos}"
        if pos is len-1
            return Number input.at(pos)
        else if phase is 0
            return Number input.at(pos)
        else if answers[phase][pos]?
            return answers[phase][pos]
        else
            #console.log "recursing (getDigitAt(#{phase-1}, #{pos}) + getDigitAt(#{phase}, #{pos+1}))"
            return answers[phase][pos] = (getDigitAt(phase-1, pos) + getDigitAt(phase, pos+1)) % 10

applyPhase = (digits, len) ->
    rs = []
    for i in [0...len]
        pattern = generatePattern(i+1)
        sum = 0
        dn = 0
        for n from pattern
            if dn >= len
                break
            sum += n * digits[dn % digits.length]
            dn++
        last = Array.from("#{sum}").pop()
        rs.push Number last
    rs

class repeatArray
    constructor: (@orig) ->
        @length = @orig.length * 10000
    at: (pos) ->
        return @orig[pos % @orig.length]

one = (input) ->
    digits = Array.from(input)
    for _ in [1..100]
        digits = applyPhase(digits, digits.length)
        console.log "Phase #{_}: #{digits.join('')} "
    digits[..7].join("")

two = (input) ->
    original = Array.from(input)
    digits = new repeatArray(original)
    solver = digitFinder(digits)
    offset = Number original[...7].join("")
    answer = []
    for i in [digits.length - 2...offset+7]
        solver(100, i)
    for i in [offset..offset+7]
        answer.push solver(100, i)
    answer.join("")
    
console.log one input 
console.log two input 