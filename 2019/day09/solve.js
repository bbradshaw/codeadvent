const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');

function parseInput(input){
    return input.split(",").map(x => Number(x));
}

function sparseArrayWithDefault(_default){
    this.extra_keys = {};
    this.get = function(obj, prop){
        if (prop >= obj.length)
            if (prop in this.extra_keys)
                return this.extra_keys[prop];
            else
                return _default;
        else
            return obj[prop];
    };
    this.set = function(obj, key, value){
        if (key >= obj.length)
            this.extra_keys[key] = value;
        else
            obj[key] = value;
        return true;
    }
}
class InputWaitError extends Error{};

class CPU{
    constructor(program){
        this.ip = 0;
        this.rel_base = 0;
        this.should_run = true;
        this.program = new Proxy([...program], new sparseArrayWithDefault(0));
        this._input = [];
        this._output = [];
    }

    input(){
        if (!this._input.length)
            throw new InputWaitError("Empty input!");
        return this._input.shift();
    }

    output(){
        return this._output.shift();
    }

    hasOutput(){
        return !!this._output.length;
    }

    sendInput(i){
        this._input.push(i);
        return this;
    }

    sendOutput(o){
        console.log(`   Output: ${o}`);
        this._output.push(o);
    }

    parameter(pos){
        const this_mode = this.mode[pos];
        switch(this_mode){
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

    setParameter(pos, val){
        const this_mode = this.mode[pos];
        switch(this_mode){
            case 0:
                return this.program[this.program[this.ip + pos]] = val;
            case 2:
                return this.program[this.program[this.ip + pos] + this.rel_base] = val;
            default:
                throw new Error(`Unknown setParameter mode ${this_mode}`);
        }
    }

    decodeOpcode(){
        const raw = this.program[this.ip].toString().padStart(5, '0');
        const opcode = Number(raw.substr(3, 2));
        const modes = {1 : Number(raw[2]), 2: Number(raw[1]), 3: Number(raw[0])}
        return [opcode, modes];
    }

    step(){
        let [opcode, mode] = this.decodeOpcode();
        this.mode = mode;
        //console.log(`processing opcode ${opcode} at pos ${this.ip}.`);
        switch(opcode){
            case 1:
                this.setParameter(3, this.parameter(1) + this.parameter(2))
                this.ip += 4;
                break
            case 2:
                this.setParameter(3, this.parameter(1) * this.parameter(2))
                this.ip += 4;
                break;
            case 3:
                this.setParameter(1, this.input());
                this.ip += 2;
                break;
            case 4:
                this.sendOutput(this.parameter(1))
                this.ip += 2;
                break;
            case 5:
                if (this.parameter(1) !== 0)
                    this.ip = this.parameter(2);
                else
                    this.ip += 3;
                break;
            case 6:
                if (this.parameter(1) === 0)
                    this.ip = this.parameter(2);
                else
                    this.ip += 3;
                break;
            case 7:
                if (this.parameter(1) < this.parameter(2))
                    this.setParameter(3, 1);
                else
                    this.setParameter(3, 0);
                this.ip += 4;
                break;
            case 8:
                if (this.parameter(1) === this.parameter(2))
                    this.setParameter(3, 1);
                else
                    this.setParameter(3, 0);
                this.ip += 4;
                break;
            case 9:
                this.rel_base += this.parameter(1);
                this.ip +=2;
                break;
            case 99:
                this.should_run = false;
                console.log("halt!");
                break;
            default:
                throw new Error(`unknown opcode ${opcode} at position ${this.ip}`);
        };   
    }
}

function one(input){
    let cpu = new CPU(input);
    cpu.sendInput(1);
    while (cpu.should_run)
        cpu.step();
}

function two(input){
    let cpu = new CPU(input);
    cpu.sendInput(2);
    while (cpu.should_run)
        cpu.step();
}

one(parseInput(input));
two(parseInput(input));