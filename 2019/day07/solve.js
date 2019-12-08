const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
//const input = "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5";

function parseInput(input){
    return input.split(",").map(x => Number(x));
}

function permutation(xs) {
    let results = [];
  
    for (let i = 0; i < xs.length; i++) {
      let rest = permutation(xs.slice(0, i).concat(xs.slice(i + 1)));
  
      if(!rest.length) {
        results.push([xs[i]])
      } else {
        for(let j = 0; j < rest.length; j = j + 1) {
          results.push([xs[i]].concat(rest[j]))
        }
      }
    }
    return results;
  }

class InputWaitError extends Error{};

class CPU{
    constructor(program){
        this.ip = 0;
        this.should_run = true;
        this.program = [...program];
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
                this.program[this.program[this.ip+1]] = this.input();
                this.ip += 2;
                break;
            case 4:
                this.sendOutput(this.parameter(1, mode))
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
                console.log("halt!");
                break;
            default:
                throw new Error(`unknown opcode ${opcode} at position ${this.ip}`);
        };   
    }
}

function one(problem){
    let permutations = permutation([0,1,2,3,4]);
    let score = 0;

    for (let order of permutations){
        console.log(`Order: ${order}`);
        let lastOutput = 0;
        let amps = Array.apply(null, Array(5)).map(() => new CPU(problem));
        for (let i = 0; i < order.length; i++){
            console.log(`Running CPU ${i} with phase ${order[i]}`);
            amps[i].sendInput(order[i]).sendInput(lastOutput);
            while (amps[i].should_run){
                amps[i].step();
            }
            lastOutput = amps[i].output();
        }
        if (lastOutput > score){
            console.log(`new high score ${lastOutput}`);
            score = lastOutput;
        }
    }
    return score;
}

function two(problem){
    let permutations = permutation([5,6,7,8,9]);
    let score = 0;
    let lastOutput;

    for (let order of permutations){
        console.log(`Order: ${order}`);
        let amps = Array.apply(null, Array(5)).map(() => new CPU(problem));

        for (let i = 0; i < order.length; i++){
            console.log(`Sending CPU ${i} phase ${order[i]}`);
            amps[i].sendInput(order[i]);
        }
        amps[0].sendInput(0);

        let curAmp = 0;
        while (amps[4].should_run){
            let nextAmp = (curAmp + 1) % 5;
            if (amps[curAmp].should_run) console.log(`CPU ${curAmp} now running.`) ;
            while (amps[curAmp].should_run){
                try{
                    amps[curAmp].step();
                    if (amps[curAmp].hasOutput()){
                        lastOutput = amps[curAmp].output();
                        amps[nextAmp].sendInput(lastOutput);
                    }
                }
                catch (e){
                    if (e instanceof InputWaitError){
                        console.log(`CPU ${curAmp} waiting for input, switching to CPU ${nextAmp}`);
                        break;
                        }
                    else;
                        throw e;
                }
            }
            curAmp = nextAmp;
        }
        if (lastOutput > score){
            console.log(`new high score ${lastOutput}`);
            score = lastOutput;
        }
    }
    return score;
}

//console.log(one(parseInput(input)));
console.log(two(parseInput(input)));