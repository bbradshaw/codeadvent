// Generated by CoffeeScript 2.4.1
(function() {
  var Recipe, binarysearch, fs, getRecipes, input, one, solve_for_n_fuel, takefromLeftovers, two;

  fs = require('fs');

  input = fs.readFileSync('input.txt', 'utf-8');

  Recipe = class Recipe {
    constructor(_str) {
      var i, len, match, product, r, reagents, ref;
      this._str = _str;
      [reagents, product] = this._str.split(" => ");
      this.product = product.split(" ")[1];
      this.amount = Number(product.split(" ")[0]);
      this.reagentList = new Map;
      ref = (function() {
        var j, len, ref, results1;
        ref = reagents.split(", ");
        results1 = [];
        for (j = 0, len = ref.length; j < len; j++) {
          r = ref[j];
          results1.push(/(\d+) ([^,]+)/.exec(r));
        }
        return results1;
      })();
      for (i = 0, len = ref.length; i < len; i++) {
        match = ref[i];
        this.reagentList.set(match[2], Number(match[1]));
      }
    }

    toString() {
      return this._str;
    }

  };

  getRecipes = function(input) {
    var i, len, line, recipe, recipes, ref;
    recipes = new Map;
    ref = input.replace(/\n$/, "").split("\n");
    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];
      recipe = new Recipe(line);
      recipes.set(recipe.product, recipe);
    }
    return recipes;
  };

  takefromLeftovers = function(shortfall, reagent, leftovers) {
    var amt, kind, leftoverAmts, ref, took, x;
    leftoverAmts = new Map;
    took = false;
    while (leftovers.length) {
      [amt, kind] = [leftovers.shift(), leftovers.shift()];
      leftoverAmts.set(kind, (leftoverAmts.get(kind) || 0) + amt);
    }
    if (leftoverAmts.has(reagent)) {
      if (leftoverAmts.get(reagent) >= shortfall) {
        leftoverAmts.set(reagent, leftoverAmts.get(reagent) - shortfall);
        //console.log "    -> taking #{shortfall} #{reagent} from extras pile"
        took = true;
      }
    }
    ref = leftoverAmts.entries();
    for (x of ref) {
      [kind, amt] = x;
      if (amt > 0) {
        leftovers.push(amt);
        leftovers.push(kind);
      }
    }
    return took;
  };

  one = function(input) {
    var extra, leftovers, mult, needAmount, needProductName, needProductRecipe, num, queue, reagent, recipes, ref, results, sum, x;
    recipes = getRecipes(input);
    queue = [1, "FUEL"];
    results = [];
    leftovers = [];
    while (queue.length) {
      needAmount = queue.shift();
      needProductName = queue.shift();
      if (needProductName === "ORE") {
        results.push(needAmount);
        continue;
      }
      if (!recipes.has(needProductName)) {
        throw new Error(`Can't figure out how to make ${needProductName}!`);
      }
      needProductRecipe = recipes.get(needProductName);
      mult = Math.floor(needAmount / needProductRecipe.amount) || 1;
      extra = needProductRecipe.amount * mult - needAmount;
      console.log(`NEED ${needAmount} ${needProductName}`);
      if (!takefromLeftovers(needAmount, needProductName, leftovers)) {
        console.log(`  -> using recipe ${needProductRecipe} ${mult} times`);
        if (extra > 0) {
          leftovers.push(extra);
          leftovers.push(needProductName);
          console.log(`    -> producing extra ${extra}`);
        } else if (extra < 0) {
          queue.push(extra * -1);
          queue.push(needProductName);
          console.log(`    -> shortfall of ${extra * -1}`);
        }
        ref = needProductRecipe.reagentList.entries();
        for (x of ref) {
          [reagent, num] = x;
          queue.push(num * mult);
          queue.push(reagent);
        }
      }
    }
    return sum = results.reduce(function(acc, v) {
      return acc + v;
    });
  };

  binarysearch = function(fn, target, low, high) {
    var midpoint, result;
    if (low === high) {
      return low;
    }
    midpoint = Math.floor((high + low) / 2);
    result = fn(midpoint);
    if (result > target) {
      console.log(`${midpoint} produces too much ${result}`);
      return binarysearch(fn, target, low, midpoint);
    } else if (result < target) {
      console.log(`${midpoint} produces too little ${result}`);
      return binarysearch(fn, target, midpoint + 1, high);
    }
    return midpoint;
  };

  solve_for_n_fuel = function(input, n) {
    var extra, leftovers, mult, needAmount, needProductName, needProductRecipe, num, oreNeeded, queue, reagent, recipes, ref, x;
    recipes = getRecipes(input);
    queue = [n, "FUEL"];
    oreNeeded = 0;
    leftovers = [];
    while (queue.length) {
      needAmount = queue.shift();
      needProductName = queue.shift();
      if (needProductName === "ORE") {
        oreNeeded += needAmount;
        continue;
      }
      needProductRecipe = recipes.get(needProductName);
      mult = Math.floor(needAmount / needProductRecipe.amount) || 1;
      extra = needProductRecipe.amount * mult - needAmount;
      if (!takefromLeftovers(needAmount, needProductName, leftovers)) {
        if (extra > 0) {
          leftovers.push(extra);
          leftovers.push(needProductName);
        } else if (extra < 0) {
          queue.push(extra * -1);
          queue.push(needProductName);
        }
        ref = needProductRecipe.reagentList.entries();
        for (x of ref) {
          [reagent, num] = x;
          queue.push(num * mult);
          queue.push(reagent);
        }
      }
    }
    return oreNeeded;
  };

  two = function(input) {
    var probSolve;
    probSolve = (n) => {
      return solve_for_n_fuel(input, n);
    };
    return binarysearch(probSolve, 1000000000000, 1600000, 25000000);
  };

  //console.log one input
  console.log(two(input));

}).call(this);

//# sourceMappingURL=solve.js.map
