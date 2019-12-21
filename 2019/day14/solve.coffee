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
            #console.log "    -> taking #{shortfall} #{reagent} from extras pile"
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

binarysearch = (fn, target, low, high) ->
    if low is high
        return low
    midpoint = Math.floor((high + low) /2)
    result = fn(midpoint)
    if result > target
        console.log "#{midpoint} produces too much #{result}"
        return binarysearch(fn, target, low, midpoint)
    else if result < target
        console.log "#{midpoint} produces too little #{result}"
        return binarysearch(fn, target, midpoint + 1, high)
    return midpoint

solve_for_n_fuel = (input, n) ->
    recipes = getRecipes input
    queue = [n, "FUEL"]
    oreNeeded = 0
    leftovers = []
    while queue.length
        needAmount = queue.shift()
        needProductName = queue.shift()
        if needProductName is "ORE"
            oreNeeded += needAmount
            continue
        needProductRecipe = recipes.get(needProductName)
        mult = Math.floor(needAmount / needProductRecipe.amount) or 1
        extra = needProductRecipe.amount*mult - needAmount
        if not takefromLeftovers(needAmount, needProductName, leftovers)
            if (extra > 0)
                leftovers.push extra
                leftovers.push needProductName
            else if (extra < 0)
                queue.push extra*-1
                queue.push needProductName
            for [reagent, num] from needProductRecipe.reagentList.entries()
                queue.push num*mult
                queue.push reagent
    oreNeeded

two = (input) ->
    probSolve = (n) =>
        solve_for_n_fuel(input, n)
    return binarysearch(probSolve, 1000000000000, 1600000, 25000000)


#console.log one input
console.log two input