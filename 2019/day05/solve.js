const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');

function parseInput(input){
    return input.split(",").map(x => Number(x));
}

class CPU{
    constructor(program){
        this.ip = 0;
        this.should_run = true;
        this.program = program;
        this._input = [];
    }

    get input(){
        return this._input.pop();
    }

    setInput(x){
        this._input = x;
    }

    parameter(pos, mode){
        const this_mode = mode[pos];
        switch(this_mode){
            case 0:
                return this.program[this.program[this.ip + pos]];
            case 1:
                return this.program[this.ip + pos];
            default:
                throw new Error(`Unknown parameter mode ${this_mode}`);
        }
    }                   

    decodeOpcode(){
        const raw = this.program[this.ip].toString().padStart(5, '0');
        const opcode = Number(raw.substr(3, 2));
        const modes = {1 : Number(raw[2]), 2: Number(raw[1]), 3: Number(raw[0])}
        return [opcode, modes];
    }

    output(o){
        console.log(`   Output: ${o}`);
    }

    step(){
        let [opcode, mode] = this.decodeOpcode();
        //console.log(`processing opcode ${opcode} at pos ${this.ip}.`);
        switch(opcode){
            case 1:
                this.program[this.program[this.ip+3]] = this.parameter(1, mode) + this.parameter(2, mode)
                this.ip += 4;
                break
            case 2:
                this.program[this.program[this.ip+3]] = this.parameter(1, mode) * this.parameter(2, mode)
                this.ip += 4;
                break;
            case 3:
                this.program[this.program[this.ip+1]] = this.input;
                this.ip += 2;
                break;
            case 4:
                this.output(this.parameter(1, mode))
                this.ip += 2;
                break;
            case 5:
                if (this.parameter(1, mode) !== 0)
                    this.ip = this.parameter(2, mode);
                else
                    this.ip += 3;
                break;
            case 6:
                if (this.parameter(1, mode) === 0)
                    this.ip = this.parameter(2, mode);
                else
                    this.ip += 3;
                break;
            case 7:
                if (this.parameter(1, mode) < this.parameter(2, mode))
                    this.program[this.program[this.ip+3]] = 1;
                else
                    this.program[this.program[this.ip+3]] = 0;
                this.ip += 4;
                break;
            case 8:
                if (this.parameter(1, mode) === this.parameter(2, mode))
                    this.program[this.program[this.ip+3]] = 1;
                else
                    this.program[this.program[this.ip+3]] = 0;
                this.ip += 4;
                break;
            case 99:
                this.should_run = false;
                break;
            default:
                throw new Error(`unknown opcode ${opcode} at position ${this.ip}`);
        };   
    }
}

function one(program){
    let cpu = new CPU(program);
    cpu.setInput([1]);
    while (cpu.should_run){
        cpu.step();
    }
}

function two(program){
    let cpu = new CPU(program);
    cpu.setInput([5]);
    while (cpu.should_run){
        cpu.step();
    }
}
const program = parseInput(input);
console.log(one([...program]));
console.log(two([...program]));