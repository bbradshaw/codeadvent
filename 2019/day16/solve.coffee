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

applyPhase = (digits) ->
    rs = []
    for d,i in digits
        pattern = generatePattern(i+1)
        sum = 0
        dn = 0
        for n from pattern
            if dn >= digits.length
                break
            sum += n * digits[dn]
            dn++
        last = Array.from("#{sum}").pop()
        rs.push Number last
    rs

applyPhase2 = (digits) ->
    len = digits.realLen*10000
    for i in [1..len]
        pattern = generatePattern(i)
        sum = 0
        dn = 0
        for n from pattern
            if dn >= len
                break
            sum += n * digits.get(dn)
            dn++
        last = Array.from("#{sum}").pop()
        yield Number last

class DigitGenerator
    constructor: (@prevGen, @realLen) ->
        @digits = []

    get: (n) ->
        n = n % @realLen
        thisDG = exports.chain.indexOf(this)
        while @digits.length <= n
            nxt = @prevGen.next().value
            console.log("DG #{thisDG} derived #{nxt} for #{n}")
            @digits.push nxt

        return @digits[n]

one = (input) ->
    digits = Array.from(input)
    for _ in [1..100]
        digits = applyPhase(digits)
        console.log "Phase #{_}: #{digits.join('')} "
    digits[..7].join("")

two = (input) ->
    digits = Array.from(input)
    len = digits.length
    gen = new DigitGenerator(null, len)
    gen.digits = digits
    exports.chain = [gen]
    for _ in [1..100]
        exports.chain.push new DigitGenerator(applyPhase2(exports.chain[_-1]), len)
    last = exports.chain.pop()
    offset = Number(digits[..6].join(""))
    rs = []
    for i in [offset..offset+7]
        rs.unshift last.get(offset)
    rs.join("")

#console.log one(input)
console.log two "03036732577212944063491565474664"