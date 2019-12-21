fs = require 'fs'
input = fs.readFileSync 'input.txt', 'utf-8'

class Recipe
    constructor: (@_str) ->
        [reagents, product] = @_str.split(" => ")
        @product = product.split(" ")[1]
        @amount = Number product.split(" ")[0]
        @reagentList = new Map
        for match in (/(\d+) ([^,]+)/.exec(r) for r in reagents.split(", "))
            @reagentList.set match[2], Number(match[1])
    
    toString: () -> @_str

getRecipes = (input) ->
    recipes = new Map
    for line in input.replace(/\n$/, "").split("\n")
        recipe = new Recipe(line)
        recipes.set(recipe.product, recipe)
    recipes

takefromLeftovers = (shortfall, reagent, leftovers) ->
    leftoverAmts = new Map
    took = false
    while leftovers.length
        [amt, kind] = [leftovers.shift(), leftovers.shift()]
        leftoverAmts.set(kind, (leftoverAmts.get(kind) or 0) + amt)
    if leftoverAmts.has(reagent)
        if leftoverAmts.get(reagent) >= shortfall
            leftoverAmts.set(reagent, leftoverAmts.get(reagent) - shortfall)
            console.log "    -> taking #{shortfall} #{reagent} from extras pile"
            took = true
    for [kind, amt] from leftoverAmts.entries()
        if amt > 0
            leftovers.push(amt)
            leftovers.push(kind)
    return took

one = (input) ->
    recipes = getRecipes input
    queue = [1, "FUEL"]
    results = []
    leftovers = []
    while queue.length
        needAmount = queue.shift()
        needProductName = queue.shift()
        if needProductName is "ORE"
            results.push(needAmount)
            continue
        if not recipes.has(needProductName)
            throw new Error "Can't figure out how to make #{needProductName}!"
        needProductRecipe = recipes.get(needProductName)
        mult = Math.floor(needAmount / needProductRecipe.amount) or 1
        extra = needProductRecipe.amount*mult - needAmount
        console.log "NEED #{needAmount} #{needProductName}"
        if not takefromLeftovers(needAmount, needProductName, leftovers)
            console.log "  -> using recipe #{needProductRecipe} #{mult} times"
            if (extra > 0)
                leftovers.push extra
                leftovers.push needProductName
                console.log "    -> producing extra #{extra}"
            else if (extra < 0)
                queue.push extra*-1
                queue.push needProductName
                console.log "    -> shortfall of #{extra*-1}"
            for [reagent, num] from needProductRecipe.reagentList.entries()
                queue.push num*mult
                queue.push reagent
    sum = results.reduce (acc,v) -> acc + v

leftoverHash = (leftovers) ->
    crypto = require 'crypto'
    hash = crypto.createHash 'sha1'
    asStrings = []
    for i in [0...leftovers.length-1] by 2
        asStrings.push "#{leftovers[i]}#{leftovers[i+1]}"
    asStrings.sort()
    for s in asStrings
        hash.update(s)
    return hash.digest('hex')

two = (input) ->
    recipes = getRecipes input
    queue = [1, "FUEL"]
    fuelProduced = 0
    oreUsed = 0
    totalOreUsed = 0
    leftovers = []
    seen = new Map
    while totalOreUsed < 1000000000000
        if not queue.length
            queue.push 1
            queue.push "FUEL"
            fuelProduced += 1
            hash = leftoverHash leftovers
            #console.log "Fuel Produced #{fuelProduced} Ore Used (this time): #{oreUsed} Leftover Hash:#{leftoverHash leftovers}"
            if seen.has(hash)
                #console.log "skipping next leftover configuration #{hash}, already solved."
                fuelProduced += 1
                totalOreUsed += seen.get hash
            else
                seen.set hash, oreUsed
                totalOreUsed += oreUsed
            oreUsed = 0
        needAmount = queue.shift()
        needProductName = queue.shift()
        if needProductName is "ORE"
            oreUsed += needAmount
            continue
        needProductRecipe = recipes.get(needProductName)
        mult = Math.floor(needAmount / needProductRecipe.amount) or 1
        extra = needProductRecipe.amount*mult - needAmount
        #console.log "NEED TO PRODUCE #{needAmount} #{needProductName}"
        if not takefromLeftovers(needAmount, needProductName, leftovers)
            #console.log "  -> using recipe #{needProductRecipe} #{mult} times"
            if (extra > 0)
                leftovers.push extra
                leftovers.push needProductName
                #console.log "    -> producing extra #{extra}"
            else if (extra < 0)
                queue.push extra*-1
                queue.push needProductName
                #console.log "    -> shortfall of #{extra*-1}"
            for [reagent, num] from needProductRecipe.reagentList.entries()
                queue.push num*mult
                queue.push reagent
    fuelProduced


#console.log one input
console.log two """157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT"""