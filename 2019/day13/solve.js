// Generated by CoffeeScript 2.4.1
(function() {
  var CPU, Grid, fs, input, one, parseInput, sparseArrayWithDefault, two,
    indexOf = [].indexOf;

  fs = require('fs');

  input = fs.readFileSync('input.txt', 'utf-8');

  parseInput = function(input) {
    var i, len, ref, results, x;
    ref = input.replace(/\n$/, "").split(',');
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      x = ref[i];
      results.push(Number(x));
    }
    return results;
  };

  sparseArrayWithDefault = function(_default) {
    this.extra_keys = {};
    this.get = function(obj, prop) {
      if (prop >= obj.length) {
        if (indexOf.call(this.extra_keys, prop) >= 0) {
          return this.extra_keys[prop];
        } else {
          return _default;
        }
      } else {
        return obj[prop];
      }
    };
    return this.set = function(obj, key, val) {
      if (key >= obj.length) {
        this.extra_keys[key] = val;
      } else {
        obj[key] = val;
      }
      return true;
    };
  };

  CPU = class CPU {
    constructor(program) {
      this.ip = 0;
      this.rel_base = 0;
      this.should_run = true;
      this.program = new Proxy([...program], new sparseArrayWithDefault(0));
      this.callbacks = {};
      this.async = true;
      this.cycleDelay = 0;
    }

    run() {
      var doRun, results;
      doRun = () => {
        if (this.should_run) {
          this.step();
          if (this.cycleDelay > 0) {
            return setTimeout(doRun, this.cycleDelay);
          } else {
            return setImmediate(doRun);
          }
        }
      };
      if (this.async) {
        return setImmediate(doRun);
      } else {
        results = [];
        while (this.should_run) {
          results.push(this.step());
        }
        return results;
      }
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
          return this.program[this.program[this.ip + pos]];
        case 1:
          return this.program[this.ip + pos];
        case 2:
          return this.program[this.program[this.ip + pos] + this.rel_base];
        default:
          throw new Error(`Unknown parameter mode ${this_mode}`);
      }
    }

    setParameter(pos, val) {
      var this_mode;
      this_mode = this.mode[pos];
      switch (this_mode) {
        case 0:
          return this.program[this.program[this.ip + pos]] = val;
        case 2:
          return this.program[this.program[this.ip + pos] + this.rel_base] = val;
        default:
          throw new Error(`Unknown setParameter mode ${this_mode}`);
      }
    }

    decodeOpcode() {
      var modes, opcode, raw;
      raw = this.program[this.ip].toString().padStart(5, '0');
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
          throw new Error(`Unknown opcode ${opcode} at position ${this.ip}!`);
      }
    }

  };

  Grid = class Grid {
    constructor() {
      this.map = new Map();
      this.max = [-2e308, -2e308];
      this.min = [2e308, 2e308];
    }

    get(x, y) {
      var serial;
      serial = `${x},${y}`;
      return this.map.get(serial);
    }

    recordSpecial(x, y, val) {
      switch (val) {
        case 3:
          return this.ball = [x, y];
        case 4:
          return this.paddle = [x, y];
      }
    }

    set(x, y, val) {
      var serial;
      serial = `${x},${y}`;
      this.map.set(`${x},${y}`, val);
      x = Number(x);
      y = Number(y);
      if (x === -1 && y === 0 && val !== 0) {
        this.score = val;
        return;
      }
      this.recordSpecial(x, y, val);
      if (x > this.max[0]) {
        this.max[0] = x;
      }
      if (y > this.max[1]) {
        this.max[1] = y;
      }
      if (x < this.min[0]) {
        this.min[0] = x;
      }
      if (y < this.min[1]) {
        return this.min[1] = y;
      }
    }

    deserial(str) {
      var x, y;
      [x, y] = str.split(",");
      return [Number(x), Number(y)];
    }

    keys() {
      var k, ref, results;
      ref = this.map.keys();
      results = [];
      for (k of ref) {
        results.push(this.deserial(k));
      }
      return results;
    }

    print() {
      var i, j, line, ref, ref1, ref2, ref3, x, y;
      for (y = i = ref = this.min[1], ref1 = this.max[1]; (ref <= ref1 ? i <= ref1 : i >= ref1); y = ref <= ref1 ? ++i : --i) {
        line = [];
        for (x = j = ref2 = this.min[0], ref3 = this.max[0]; (ref2 <= ref3 ? j <= ref3 : j >= ref3); x = ref2 <= ref3 ? ++j : --j) {
          line.push((function() {
            switch (this.get(x, y)) {
              case 0:
                return " ";
              case 1:
                return "+";
              case 2:
                return "#";
              case 3:
                return "_";
              case 4:
                return "*";
            }
          }).call(this));
        }
        console.log(line.join(""));
        line.length = 0;
      }
      return console.log(`Score ${this.score}`);
    }

  };

  one = function(problem, answer_cb) {
    var buffer, cpu, screen;
    cpu = new CPU(problem);
    screen = new Grid;
    buffer = [];
    cpu.on('output', function(data) {
      buffer.push(data);
      if (buffer.length > 2) {
        screen.set(buffer[0], buffer[1], Number(buffer[2]));
        return buffer.length = 0;
      }
    });
    cpu.on('halt', function(ip) {
      var answer, i, len, ref, x, y;
      console.log(`Halted at instruction ${ip}!`);
      answer = 0;
      ref = screen.keys();
      for (i = 0, len = ref.length; i < len; i++) {
        [x, y] = ref[i];
        if (x >= 0 && y >= 0 && screen.get(x, y) === 2) {
          answer += 1;
        }
      }
      screen.print();
      console.log(`Grid dimensions ${screen.min[0]} - ${screen.max[0]}, ${screen.min[1]} - ${screen.max[1]}.`);
      return answer_cb(answer);
    });
    return cpu.run();
  };

  two = function(problem) {
    var buffer, cpu, screen;
    cpu = new CPU(problem);
    screen = new Grid;
    buffer = [];
    cpu.program[0] = 2;
    cpu.on('output', function(data) {
      buffer.push(data);
      if (buffer.length > 2) {
        screen.set(buffer[0], buffer[1], Number(buffer[2]));
        buffer.length = 0;
        process.stdout.write('\u001B[2J\u001B[0;0f');
        screen.print();
        return cpu.outputDelay = 10;
      }
    });
    cpu.on('input', function(cb) {
      var ballx, dir, paddlex;
      ballx = screen.ball[0];
      paddlex = screen.paddle[0];
      dir = 0;
      if (ballx < paddlex) {
        dir = 1;
      } else if (ballx > paddlex) {
        dir = -1;
      }
      return cb(null, dir);
    });
    cpu.on('halt', function(ip) {
      var answer;
      console.log(`Halted at instruction ${ip}!`);
      return answer = 0;
    });
    return cpu.run();
  };

  one(parseInput(input), function(answer) {
    return console.log(answer);
  });

  console.log(two(parseInput(input)));

}).call(this);

//# sourceMappingURL=solve.js.map