// Generated by CoffeeScript 1.12.2
(function() {
  var CPU, Direction, InputWaitError, PaintGrid, Robot, fs, input, one, parseInput, sparseArrayWithDefault, two,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  fs = require('fs');

  input = fs.readFileSync('input.txt', 'utf-8');

  parseInput = function(input) {
    var j, len, ref, results, x;
    ref = input.replace(/\n$/, "").split(',');
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      x = ref[j];
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

  InputWaitError = (function(superClass) {
    extend(InputWaitError, superClass);

    function InputWaitError() {
      return InputWaitError.__super__.constructor.apply(this, arguments);
    }

    return InputWaitError;

  })(Error);

  CPU = (function() {
    function CPU(program) {
      this.ip = 0;
      this.rel_base = 0;
      this.should_run = true;
      this.program = new Proxy(slice.call(program), new sparseArrayWithDefault(0));
      this._input = [];
      this._output = [];
    }

    CPU.prototype.input = function() {
      if (!this._input.length) {
        throw new InputWaitError("Empty input!");
      }
      return this._input.shift();
    };

    CPU.prototype.output = function() {
      return this._output.shift();
    };

    CPU.prototype.hasOutput = function() {
      return !!this._output.length;
    };

    CPU.prototype.sendInput = function(i) {
      this._input.push(i);
      return this;
    };

    CPU.prototype.sendOutput = function(o) {
      return this._output.push(o);
    };

    CPU.prototype.parameter = function(pos) {
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
          throw new Error("Unknown parameter mode " + this_mode);
      }
    };

    CPU.prototype.setParameter = function(pos, val) {
      var this_mode;
      this_mode = this.mode[pos];
      switch (this_mode) {
        case 0:
          return this.program[this.program[this.ip + pos]] = val;
        case 2:
          return this.program[this.program[this.ip + pos] + this.rel_base] = val;
        default:
          throw new Error("Unknown setParameter mode " + this_mode);
      }
    };

    CPU.prototype.decodeOpcode = function() {
      var modes, opcode, raw;
      raw = this.program[this.ip].toString().padStart(5, '0');
      opcode = Number(raw.slice(3));
      modes = {
        1: Number(raw[2]),
        2: Number(raw[1]),
        3: Number(raw[0])
      };
      return [opcode, modes];
    };

    CPU.prototype.step = function() {
      var opcode, ref;
      ref = this.decodeOpcode(), opcode = ref[0], this.mode = ref[1];
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
          this.sendOutput(this.parameter(1));
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
          this.should_run = false;
          return console.log("halted!");
        default:
          throw new Error("Unknown opcode " + opcode + " at position " + this.ip + "!");
      }
    };

    return CPU;

  })();

  PaintGrid = (function() {
    function PaintGrid() {
      this.map = new Map();
    }

    PaintGrid.prototype.get = function(x, y) {
      var serial;
      serial = x + "," + y;
      if (this.map.has(serial)) {
        return this.map.get(serial);
      } else {
        return ".";
      }
    };

    PaintGrid.prototype.set = function(x, y, val) {
      console.log("painting " + x + ", " + y + " to " + val);
      return this.map.set(x + "," + y, val);
    };

    PaintGrid.prototype.print = function() {
      var highest_x, highest_y, j, k, l, lb, lowest_x, lowest_y, n, ref, ref1, ref2, ref3, ref4, ref5, results, x, y;
      highest_y = -2e308;
      lowest_y = 2e308;
      highest_x = -2e308;
      lowest_x = 2e308;
      ref = this.map.keys();
      for (k of ref) {
        ref1 = (function() {
          var j, len, ref1, results;
          ref1 = k.split(",");
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            n = ref1[j];
            results.push(Number(n));
          }
          return results;
        })(), x = ref1[0], y = ref1[1];
        if (x > highest_x) {
          highest_x = x;
        } else if (x < lowest_x) {
          lowest_x = x;
        }
        if (y > highest_y) {
          highest_y = y;
        } else if (y < lowest_y) {
          lowest_y = y;
        }
      }
      results = [];
      for (y = j = ref2 = highest_y + 1, ref3 = lowest_y - 1; ref2 <= ref3 ? j <= ref3 : j >= ref3; y = ref2 <= ref3 ? ++j : --j) {
        lb = [];
        for (x = l = ref4 = lowest_x, ref5 = highest_x; ref4 <= ref5 ? l <= ref5 : l >= ref5; x = ref4 <= ref5 ? ++l : --l) {
          lb.push(this.get(x, y));
        }
        results.push(console.log(lb.join("")));
      }
      return results;
    };

    return PaintGrid;

  })();

  Direction = (function() {
    function Direction() {
      this.current = [0, 1];
    }

    Direction.prototype.left = function() {
      switch (false) {
        case !(this.current[0] === 0 && this.current[1] === 1):
          return this.current = [-1, 0];
        case !(this.current[0] === -1 && this.current[1] === 0):
          return this.current = [0, -1];
        case !(this.current[0] === 0 && this.current[1] === -1):
          return this.current = [1, 0];
        case !(this.current[0] === 1 && this.current[1] === 0):
          return this.current = [0, 1];
      }
    };

    Direction.prototype.right = function() {
      switch (false) {
        case !(this.current[0] === 0 && this.current[1] === 1):
          return this.current = [1, 0];
        case !(this.current[0] === 1 && this.current[1] === 0):
          return this.current = [0, -1];
        case !(this.current[0] === 0 && this.current[1] === -1):
          return this.current = [-1, 0];
        case !(this.current[0] === -1 && this.current[1] === 0):
          return this.current = [0, 1];
      }
    };

    Direction.prototype.name = function() {
      switch (false) {
        case !(this.current[0] === 0 && this.current[1] === 1):
          return "Up";
        case !(this.current[0] === 1 && this.current[1] === 0):
          return "Right";
        case !(this.current[0] === 0 && this.current[1] === -1):
          return "Down";
        case !(this.current[0] === -1 && this.current[1] === 0):
          return "Left";
      }
    };

    return Direction;

  })();

  Robot = (function() {
    function Robot(program) {
      this.grid = new PaintGrid;
      this.dir = new Direction;
      this.cpu = new CPU(program);
      this.pos = [0, 0];
    }

    Robot.prototype.runCPU = function(stopCondition) {
      if (stopCondition == null) {
        stopCondition = null;
      }
      while (this.cpu.should_run) {
        this.cpu.step();
        if (typeof stopCondition === "function" ? stopCondition() : void 0) {
          return;
        }
      }
      throw Error("CPU stopped unexpectedly!");
    };

    Robot.prototype.step = function() {
      var color, error, new_color;
      try {
        this.runCPU();
      } catch (error1) {
        error = error1;
        if (!(error instanceof InputWaitError)) {
          throw error;
        }
      }
      color = (function() {
        switch (this.grid.get(this.pos[0], this.pos[1])) {
          case ".":
            return 0;
          default:
            return 1;
        }
      }).call(this);
      this.cpu.sendInput(color);
      this.runCPU((function(_this) {
        return function() {
          return _this.cpu.hasOutput();
        };
      })(this));
      new_color = this.cpu.output();
      this.grid.set(this.pos[0], this.pos[1], (function() {
        switch (new_color) {
          case 0:
            return ".";
          default:
            return "#";
        }
      })());
      this.runCPU((function(_this) {
        return function() {
          return _this.cpu.hasOutput();
        };
      })(this));
      switch (this.cpu.output()) {
        case 0:
          this.dir.left();
          break;
        default:
          this.dir.right();
      }
      return this.pos = [this.dir.current[0] + this.pos[0], this.dir.current[1] + this.pos[1]];
    };

    Robot.prototype.should_run = function() {
      return this.cpu.should_run;
    };

    return Robot;

  })();

  one = function(input) {
    var robo;
    robo = new Robot(input);
    try {
      while (robo.should_run) {
        robo.step();
      }
    } catch (error1) {}
    return Array.from(robo.grid.map.keys()).length;
  };

  two = function(input) {
    var robo;
    robo = new Robot(input);
    robo.grid.set(0, 0, "#");
    try {
      while (robo.should_run) {
        robo.step();
      }
    } catch (error1) {}
    return robo.grid.print();
  };

  console.log(one(parseInput(input)));

  two(parseInput(input));

}).call(this);

//# sourceMappingURL=solve.js.map
