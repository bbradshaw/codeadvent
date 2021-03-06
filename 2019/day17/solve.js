// Generated by CoffeeScript 2.4.1
(function() {
  var CPU, RoboController, dfs, fs, input, one, outputHandler, two;

  CPU = class CPU {
    constructor(program) {
      this.ip = 0;
      this.rel_base = 0;
      this.should_run = true;
      this.program = this.parseProgram(program);
      this.callbacks = {};
    }

    parseProgram(input) {
      var i, len, ref, results, x;
      ref = input.replace(/\n$/, "").split(',');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
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

  RoboController = class RoboController {
    constructor() {
      this.rows = new Map;
      this.max_y = 0;
      this.max_x = 0;
    }

    get(x, y) {
      var ref;
      return (ref = this.rows.get(y)) != null ? ref[x] : void 0;
    }

    set(x, y, val) {
      var r;
      if (!this.rows.has(y)) {
        this.rows.set(y, []);
      }
      r = this.rows.get(y);
      r[x] = val;
      if (x > this.max_x) {
        this.max_x = x;
      }
      if (y > this.max_y) {
        return this.max_y = y;
      }
    }

    * travel() {
      var i, ref, results, x, y;
      results = [];
      for (y = i = 0, ref = this.max_y; (0 <= ref ? i <= ref : i >= ref); y = 0 <= ref ? ++i : --i) {
        results.push((yield* (function*() {
          var j, ref1, results1;
          results1 = [];
          for (x = j = 0, ref1 = this.max_x; (0 <= ref1 ? j <= ref1 : j >= ref1); x = 0 <= ref1 ? ++j : --j) {
            results1.push((yield [x, y]));
          }
          return results1;
        }).call(this)));
      }
      return results;
    }

    print() {
      var buffer, i, j, ref, ref1, results, x, y;
      results = [];
      for (y = i = 0, ref = this.max_y; (0 <= ref ? i <= ref : i >= ref); y = 0 <= ref ? ++i : --i) {
        buffer = [];
        for (x = j = 0, ref1 = this.max_x; (0 <= ref1 ? j <= ref1 : j >= ref1); x = 0 <= ref1 ? ++j : --j) {
          buffer.push(this.get(x, y));
        }
        results.push(console.log(buffer.join("")));
      }
      return results;
    }

    neighbors(x, y, filter) {
      var a, dx, dy, i, len, npx, npy, ref;
      a = [];
      ref = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (i = 0, len = ref.length; i < len; i++) {
        [dx, dy] = ref[i];
        [npx, npy] = [x + dx, y + dy];
        if ((this.get(npx, npy) != null) && filter(npx, npy)) {
          a.push([npx, npy]);
        }
      }
      return a;
    }

    findIntersections() {
      var c, i, j, n, ref, ref1, sect, x, y;
      sect = [];
      for (y = i = 0, ref = this.max_y; (0 <= ref ? i <= ref : i >= ref); y = 0 <= ref ? ++i : --i) {
        for (x = j = 0, ref1 = this.max_x; (0 <= ref1 ? j <= ref1 : j >= ref1); x = 0 <= ref1 ? ++j : --j) {
          if (c = this.get(x, y) === "#") {
            n = this.neighbors(x, y, (tx, ty) => {
              return this.get(tx, ty) === "#";
            });
            if (n.length === 4) {
              sect.push([x, y]);
            }
          }
        }
      }
      return sect;
    }

  };

  outputHandler = function(g) {
    var x, y;
    y = 0;
    x = 0;
    return function(chrCode) {
      if (chrCode === 10) {
        y++;
        return x = 0;
      } else {
        g.set(x, y, String.fromCharCode(chrCode));
        return x++;
      }
    };
  };

  dfs = function(graph, v) {
    var answer, fromWhere, i, len, n, ref, valid, visited, work;
    work = [];
    visited = new Set;
    fromWhere = new Map;
    answer = [];
    work.push(v);
    valid = (px, py) => {
      return graph.get(px, py) !== ".";
    };
    while (work.length) {
      v = work.pop();
      if (!visited.has(`${v}`)) {
        visited.add(`${v}`);
        answer.push(v);
        ref = graph.neighbors(...v, valid);
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          work.push(n);
          fromWhere.set(`${n}`, `${v}`);
        }
      }
    }
    return answer;
  };

  one = function(input, answerCB) {
    var control, cpu;
    cpu = new CPU(input);
    control = new RoboController;
    cpu.on('output', outputHandler(control));
    cpu.on('halt', function() {
      var answer, i, ix, iy, len, ref;
      answer = 0;
      ref = control.findIntersections();
      for (i = 0, len = ref.length; i < len; i++) {
        [ix, iy] = ref[i];
        control.set(ix, iy, "O");
        answer += ix * iy;
      }
      control.print();
      return answerCB(answer);
    });
    return cpu.run();
  };

  two = function(input, answerCB) {
    var control, cpu;
    cpu = new CPU(input);
    control = new RoboController;
    cpu.on('output', outputHandler(control));
    cpu.on('halt', function() {
      var buf, i, len, ref, ref1, start, x, y, z;
      start = null;
      ref = control.travel();
      for (z of ref) {
        [x, y] = z;
        if (control.get(x, y) === "^") {
          start = [x, y];
          break;
        }
      }
      buf = [];
      ref1 = dfs(control, start);
      for (i = 0, len = ref1.length; i < len; i++) {
        [x, y] = ref1[i];
        buf.push(`${[x, y]}`);
      }
      return console.log(buf.join(" -> "));
    });
    return cpu.run();
  };

  fs = require('fs');

  input = fs.readFileSync('input.txt', 'utf-8');

  //one input, (ans) ->
  //    console.log ans
  two(input);

}).call(this);

//# sourceMappingURL=solve.js.map
