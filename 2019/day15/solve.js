// Generated by CoffeeScript 2.4.1
(function() {
  var CPU, a_star, fill, fs, input, neighbors, one, roboController, two,
    indexOf = [].indexOf;

  CPU = class CPU {
    constructor(program) {
      this.ip = 0;
      this.rel_base = 0;
      this.should_run = true;
      this.program = this.parseProgram(program);
      this.callbacks = {};
    }

    parseProgram(input) {
      var j, len, ref, results, x;
      ref = input.replace(/\n$/, "").split(',');
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        x = ref[j];
        results.push(Number(x));
      }
      return results;
    }

    run() {
      var doRun;
      doRun = () => {
        if (this.should_run) {
          this.step();
          return setImmediate(doRun);
        }
      };
      return setImmediate(doRun);
    }

    getMem(loc) {
      if (this.program[loc] != null) {
        return this.program[loc];
      }
      return 0;
    }

    setMem(loc, val) {
      return this.program[loc] = val;
    }

    error(err) {
      var base;
      if (typeof (base = this.callbacks).error === "function" ? base.error() : void 0) {
        return callback.error(err);
      } else {
        throw new Error(err);
      }
    }

    input() {
      if (this.callbacks.input == null) {
        this.error("no input callback and input required");
      }
      return this.callbacks.input(function(err, data) {
        if (err != null) {
          this.error(err);
        }
        return data;
      });
    }

    output(out) {
      if (this.callbacks.output != null) {
        return this.callbacks.output(out);
      } else {
        return console.log(`  Output: ${out}`);
      }
    }

    on(evtName, cb) {
      return this.callbacks[evtName] = cb;
    }

    halt() {
      this.should_run = false;
      if (this.callbacks.halt != null) {
        return this.callbacks.halt(this.ip);
      } else {
        return console.log("halted!");
      }
    }

    parameter(pos) {
      var this_mode;
      this_mode = this.mode[pos];
      switch (this_mode) {
        case 0:
          return this.getMem(this.getMem(this.ip + pos));
        case 1:
          return this.getMem(this.ip + pos);
        case 2:
          return this.getMem(this.getMem(this.ip + pos) + this.rel_base);
        default:
          return this.error(`Unknown parameter mode ${this_mode}`);
      }
    }

    setParameter(pos, val) {
      var this_mode;
      this_mode = this.mode[pos];
      switch (this_mode) {
        case 0:
          return this.setMem(this.getMem(this.ip + pos), val);
        case 2:
          return this.setMem(this.getMem(this.ip + pos) + this.rel_base, val);
        default:
          return this.error(`Unknown setParameter mode ${this_mode}`);
      }
    }

    decodeOpcode() {
      var modes, opcode, raw;
      raw = this.getMem(this.ip).toString().padStart(5, '0');
      opcode = Number(raw.slice(3));
      modes = {
        1: Number(raw[2]),
        2: Number(raw[1]),
        3: Number(raw[0])
      };
      return [opcode, modes];
    }

    step() {
      var opcode;
      [opcode, this.mode] = this.decodeOpcode();
      switch (opcode) {
        case 1:
          this.setParameter(3, this.parameter(1) + this.parameter(2));
          return this.ip += 4;
        case 2:
          this.setParameter(3, this.parameter(1) * this.parameter(2));
          return this.ip += 4;
        case 3:
          this.setParameter(1, this.input());
          return this.ip += 2;
        case 4:
          this.output(this.parameter(1));
          return this.ip += 2;
        case 5:
          if (this.parameter(1) !== 0) {
            return this.ip = this.parameter(2);
          } else {
            return this.ip += 3;
          }
          break;
        case 6:
          if (this.parameter(1) === 0) {
            return this.ip = this.parameter(2);
          } else {
            return this.ip += 3;
          }
          break;
        case 7:
          if (this.parameter(1) < this.parameter(2)) {
            this.setParameter(3, 1);
          } else {
            this.setParameter(3, 0);
          }
          return this.ip += 4;
        case 8:
          if (this.parameter(1) === this.parameter(2)) {
            this.setParameter(3, 1);
          } else {
            this.setParameter(3, 0);
          }
          return this.ip += 4;
        case 9:
          this.rel_base += this.parameter(1);
          return this.ip += 2;
        case 99:
          return this.halt();
        default:
          return this.error(`Unknown opcode ${opcode} at position ${this.ip}!`);
      }
    }

  };

  roboController = class roboController {
    constructor() {
      this.rx = 0;
      this.ry = 0;
      this.lastMove = null;
      this.map = new Map;
      this.max = [null, null];
      this.min = [null, null];
      this.back = new Map;
      this.target = null;
    }

    direction(cmd) {
      switch (cmd) {
        case 1:
          return [0, 1];
        case 2:
          return [0, -1];
        case 3:
          return [-1, 0];
        case 4:
          return [1, 0];
      }
    }

    getCmdToGoTo(start, end) {
      switch (false) {
        case !(start[0] > end[0]):
          return 3;
        case !(start[0] < end[0]):
          return 4;
        case !(start[1] > end[1]):
          return 2;
        case !(start[1] < end[1]):
          return 1;
      }
    }

    go(cmd, roboInputCb) {
      this.lastMove = this.direction(cmd);
      return roboInputCb(null, cmd);
    }

    nextPosition() {
      return [this.rx + this.lastMove[0], this.ry + this.lastMove[1]];
    }

    confirmMove() {
      var prevX, prevY;
      [prevX, prevY] = [this.rx, this.ry];
      [this.rx, this.ry] = this.nextPosition();
      if (!this.back.has(this._serial([this.rx, this.ry]))) {
        this.back.set(this._serial([this.rx, this.ry]), [prevX, prevY]);
      }
      if ((this.max[0] == null) || this.rx > this.max[0]) {
        this.max[0] = this.rx;
      }
      if ((this.max[1] == null) || this.ry > this.max[1]) {
        this.max[1] = this.ry;
      }
      if ((this.min[0] == null) || this.rx < this.min[0]) {
        this.min[0] = this.rx;
      }
      if ((this.min[1] == null) || this.ry < this.min[1]) {
        return this.min[1] = this.ry;
      }
    }

    _serial(pos) {
      return `${pos[0]},${pos[1]}`;
    }

    markExplored(type) {
      if (type === "O") {
        this.target = this.nextPosition();
      }
      return this.map.set(this._serial(this.nextPosition()), type);
    }

    choose() {
      var dir, j, len, prev_place, ref, vec;
      ref = [1, 2, 3, 4];
      for (j = 0, len = ref.length; j < len; j++) {
        dir = ref[j];
        vec = this.direction(dir);
        if (!this.map.has(this._serial([vec[0] + this.rx, vec[1] + this.ry]))) {
          return dir;
        }
      }
      prev_place = this.back.get(this._serial([this.rx, this.ry]));
      return this.getCmdToGoTo([this.rx, this.ry], prev_place);
    }

    printMap() {
      var j, l, line, ref, ref1, ref2, ref3, x, y;
      for (y = j = ref = this.max[1], ref1 = this.min[1]; (ref <= ref1 ? j <= ref1 : j >= ref1); y = ref <= ref1 ? ++j : --j) {
        line = [];
        for (x = l = ref2 = this.min[0], ref3 = this.max[1]; (ref2 <= ref3 ? l <= ref3 : l >= ref3); x = ref2 <= ref3 ? ++l : --l) {
          if (x === this.rx && y === this.ry) {
            line.push("R");
          } else {
            line.push(this.map.get(this._serial([x, y]) || " "));
          }
        }
        console.log(line.join(""));
      }
      return null;
    }

    isDone() {
      var j, len, ref, vec;
      if (this.rx === 0 && this.ry === 0) {
        ref = [[0, 1], [0, -1], [-1, 0], [1, 0]];
        for (j = 0, len = ref.length; j < len; j++) {
          vec = ref[j];
          if (!this._serial(indexOf.call(this.map, vec) >= 0)) {
            return false;
          }
        }
        return true;
      }
    }

  };

  neighbors = function(control, sp) {
    var c, i, j, nowall, p, s, test, vec;
    p = (function() {
      var j, len, ref, results;
      ref = sp.split(",");
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        results.push(Number(c));
      }
      return results;
    })();
    s = control._serial;
    nowall = [];
    for (i = j = 1; j <= 4; i = ++j) {
      vec = control.direction(i);
      test = [p[0] + vec[0], p[1] + vec[1]];
      if (control.map.get(s(test)) !== "#") {
        nowall.push(test);
      }
    }
    return nowall;
  };

  a_star = function(start, control) {
    var calc_g, cameFrom, candidate, cur, f, g, goal, heuristic, j, len, path, ref, s, serCan, visited;
    goal = control.target;
    heuristic = function(p) {
      return Math.abs(goal[1] - p[1]) + Math.abs(goal[0] - p[0]);
    };
    path = function(end) {
      var cur, steps;
      steps = 0;
      cur = end;
      while (cameFrom.has(cur)) {
        cur = cameFrom.get(cur);
        steps += 1;
      }
      return steps;
    };
    s = control._serial;
    visited = new Set([s(start)]);
    cameFrom = new Map;
    g = new Map;
    f = new Map;
    f.set(s(start), heuristic(start));
    g.set(s(start), 0);
    while (visited.size) {
      cur = Array.from(visited).reduce((acc, k) => {
        if (f[k] < f[acc]) {
          return k;
        } else {
          return acc;
        }
      });
      if (cur === s(goal)) {
        return path(cur);
      }
      visited.delete(cur);
      ref = neighbors(control, cur);
      for (j = 0, len = ref.length; j < len; j++) {
        candidate = ref[j];
        calc_g = g.get(cur) + 1;
        serCan = s(candidate);
        if ((g.has(serCan) && g.get(serCan) > calc_g) || (!g.has(serCan))) {
          cameFrom.set(serCan, cur);
          g.set(serCan, calc_g);
          f.set(serCan, g.get(serCan) + heuristic(candidate));
          if (indexOf.call(visited, serCan) < 0) {
            visited.add(serCan);
          }
        }
      }
    }
    throw new Error("Failed to find path!");
  };

  fill = function(control) {
    var j, len, nowall, nowoxygen, oxygen, ref, s, spot, time, v, vacuumLen;
    time = 0;
    s = control._serial;
    oxygen = new Set([s(control.target)]);
    vacuumLen = ((function() {
      var ref, results;
      ref = control.map.values();
      results = [];
      for (v of ref) {
        if (v === ".") {
          results.push(v);
        }
      }
      return results;
    })()).length;
    vacuumLen += 1; //start
    while (oxygen.size < vacuumLen) {
      time += 1;
      nowoxygen = Array.from(oxygen);
      for (spot of nowoxygen) {
        ref = neighbors(control, spot);
        for (j = 0, len = ref.length; j < len; j++) {
          nowall = ref[j];
          oxygen.add(s(nowall));
        }
      }
    }
    return time;
  };

  fs = require('fs');

  input = fs.readFileSync('input.txt', 'utf-8');

  one = function(input, answerCB) {
    var control, robo;
    robo = new CPU(input);
    control = new roboController;
    robo.on('output', function(data) {
      switch (data) {
        case 0:
          //console.log "hit wall at #{control.nextPosition()}!"
          return control.markExplored("#");
        case 1:
          //console.log "moved to #{control.nextPosition()}!"
          control.markExplored(".");
          control.confirmMove();
          if (control.isDone()) {
            robo.halt();
            if (control.target == null) {
              throw new Error("Robo failed to find target!");
            }
            return answerCB(a_star([0, 0], control));
          }
          break;
        case 2:
          console.log(`found mcguffin at ${control.nextPosition()}!`);
          control.markExplored("O");
          return control.confirmMove();
      }
    });
    robo.on('input', function(cb) {
      var way;
      way = control.choose();
      return control.go(way, cb);
    });
    robo.on('halt', function(ip) {
      return control.printMap();
    });
    return robo.run();
  };

  two = function(input, answerCB) {
    var control, robo;
    robo = new CPU(input);
    control = new roboController;
    robo.on('output', function(data) {
      switch (data) {
        case 0:
          //console.log "hit wall at #{control.nextPosition()}!"
          return control.markExplored("#");
        case 1:
          //console.log "moved to #{control.nextPosition()}!"
          control.markExplored(".");
          control.confirmMove();
          if (control.isDone()) {
            robo.halt();
            if (control.target == null) {
              throw new Error("Robo failed to find target!");
            }
            return answerCB(fill(control));
          }
          break;
        case 2:
          console.log(`found mcguffin at ${control.nextPosition()}!`);
          control.markExplored("O");
          return control.confirmMove();
      }
    });
    robo.on('input', function(cb) {
      var way;
      way = control.choose();
      return control.go(way, cb);
    });
    robo.on('halt', function(ip) {
      return control.printMap();
    });
    return robo.run();
  };

  one(input, function(answer) {
    return console.log(answer);
  });

  two(input, function(answer) {
    return console.log(answer);
  });

}).call(this);

//# sourceMappingURL=solve.js.map
