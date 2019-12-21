// Generated by CoffeeScript 2.4.1
(function() {
  var Moon, Vector3, combinations, findCommon, findGCD, findLCM, gravityAdjust, input, one, parseVec, simulate, two;

  input = "<x=3, y=15, z=8>\n<x=5, y=-1, z=-2>\n<x=-10, y=8, z=2>\n<x=8, y=4, z=-5>";

  findGCD = function(x, y) {
    var remain;
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
      remain = x % y;
      x = y;
      y = remain;
    }
    return x;
  };

  findLCM = function(x, y) {
    return x * y / findGCD(x, y);
  };

  Vector3 = class Vector3 {
    constructor(x1 = 0, y1 = 0, z = 0) {
      this.x = x1;
      this.y = y1;
      this.z = z;
    }

    set(vec) {
      this.x = vec.x;
      this.y = vec.y;
      return this.z = vec.z;
    }

    add(vec) {
      return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

  };

  Moon = class Moon {
    constructor(pos) {
      this.pos = pos;
      this.vel = new Vector3;
    }

    pnrg() {
      return Math.abs(this.pos.x) + Math.abs(this.pos.y) + Math.abs(this.pos.z);
    }

    knrg() {
      return Math.abs(this.vel.x) + Math.abs(this.vel.y) + Math.abs(this.vel.z);
    }

  };

  parseVec = function(str) {
    var m;
    m = /<x=([^,]+), y=([^,]+), z=([^,]+)>/.exec(str);
    return new Vector3(Number(m[1]), Number(m[2]), Number(m[3]));
  };

  combinations = function(array) {
    return array.reduce( (acc, v, i) => acc.concat(array.slice(i+1).map( w => [v,w])), []);
  };

  gravityAdjust = function(m1, m2) {
    var avg, d, i, len, m, ref, results;
    ref = ['x', 'y', 'z'];
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      avg = (m1.pos[d] + m2.pos[d]) / 2;
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = [m1, m2];
        results1 = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          m = ref1[j];
          if (avg > m.pos[d]) {
            m.vel[d] += 1;
          }
          if (avg < m.pos[d]) {
            results1.push(m.vel[d] -= 1);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };

  simulate = function(system, n) {
    var i, j, len, moon, pair, pairs, ref, results, step;
    pairs = combinations(system);
    results = [];
    for (step = i = 0, ref = n; (0 <= ref ? i < ref : i > ref); step = 0 <= ref ? ++i : --i) {
      for (j = 0, len = pairs.length; j < len; j++) {
        pair = pairs[j];
        gravityAdjust(pair[0], pair[1]);
      }
      results.push((function() {
        var k, len1, results1;
        results1 = [];
        for (k = 0, len1 = system.length; k < len1; k++) {
          moon = system[k];
          results1.push(moon.pos.set(moon.pos.add(moon.vel)));
        }
        return results1;
      })());
    }
    return results;
  };

  findCommon = function(system) {
    var answer, dimension, i, j, k, len, len1, len2, moon, o, pair, pairs, ref, s, seen, seenD, serialize, step;
    pairs = combinations(system);
    seen = {};
    ref = ['x', 'y', 'z'];
    for (i = 0, len = ref.length; i < len; i++) {
      dimension = ref[i];
      seen[dimension] = new Set;
    }
    serialize = function(sys, d) {
      var j, len1, m, r;
      r = "";
      for (j = 0, len1 = sys.length; j < len1; j++) {
        m = sys[j];
        r += `${m.pos[d]},${m.vel[d]},`;
      }
      return r;
    };
    answer = {};
    for (step = j = 0; j < 10000000; step = ++j) {
      for (k = 0, len1 = pairs.length; k < len1; k++) {
        pair = pairs[k];
        gravityAdjust(pair[0], pair[1]);
      }
      for (o = 0, len2 = system.length; o < len2; o++) {
        moon = system[o];
        moon.pos.set(moon.pos.add(moon.vel));
      }
      for (dimension in seen) {
        seenD = seen[dimension];
        s = serialize(system, dimension);
        if (seenD.has(s)) {
          answer[dimension] = step;
          delete seen[dimension];
          console.log(`${dimension} repeats at ${step}!`);
        }
        seenD.add(s);
      }
      if (Object.keys(seen).length < 1) {
        break;
      }
    }
    return answer;
  };

  one = function(problem) {
    var l, moon, nrg, system;
    system = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = problem.length; i < len; i++) {
        l = problem[i];
        results.push(new Moon(parseVec(l)));
      }
      return results;
    })();
    simulate(system, 1000);
    nrg = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = system.length; i < len; i++) {
        moon = system[i];
        results.push(moon.pnrg() * moon.knrg());
      }
      return results;
    })();
    return nrg.reduce(function(acc, v) {
      return acc + v;
    }, 0);
  };

  two = function(problem) {
    var answer, l, system;
    system = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = problem.length; i < len; i++) {
        l = problem[i];
        results.push(new Moon(parseVec(l)));
      }
      return results;
    })();
    answer = findCommon(system);
    return findLCM(findLCM(answer.x, answer.y), answer.z);
  };

  //console.log(one(input.split("\n")))
  console.log(two(input.split("\n")));

}).call(this);

//# sourceMappingURL=solve.js.map