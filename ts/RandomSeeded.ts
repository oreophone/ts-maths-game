/* 
The SplitMix32 PRNG, taken from:
https://github.com/bryc/code/blob/master/jshash/PRNGs.md
Chosen for its speed, statistical quality, and easy seeding
so I don't have to faff around with a seeder or 4 inputs or
anything like that.
*/

import { numberRange } from "./QuestionTemplate";

export function randomSeeded(a: number | null = null): () => number {
    // Seed seems to need to be a whole number; [0, 2^32 - 1] chosen 
    // because the algorithm is 32 bit so idk
    var seed = a === null ? Math.floor(Math.random() * 4294967296) : a;
    return function() {
        seed |= 0; seed = seed + 0x9e3779b9 | 0;
        var t = seed ^ seed >>> 16; t = Math.imul(t, 0x21f0aaad);
            t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
      }
}

// Range is [min,max], inclusive
export function genFromRange(rng: () => number, range: numberRange): number {
    let min = range[0]; let max = range[1]; let r = max - min + 1;
    return Math.floor(rng() * r) + min;
}

// TODO implement distributions
export function genSample(
    rng: () => number,
    sample: any[],
    numItems: number,
    dist: number[] | null = null,
): any[] {
    var returnSample = [];
    for (let i = 0; i < numItems; i++) {
        let curIndex = genFromRange(rng, [0,sample.length - 1]);
        returnSample.push(sample[curIndex]);
    }
    return returnSample;
}

// TODO write genSample without replacement

function test(seed: number | null, numTests: number) {
    let rng = randomSeeded(seed);
    for(var i = 0; i < numTests; i++) {
        console.log(rng());
    } 
}

function testGenSample(seed: number | null) {
    let rng = randomSeeded(seed);
    console.log(genSample(rng, [
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,
    ], 8))
    console.log(genSample(rng, [
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,
    ], 5))
    console.log(genSample(rng, [
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,
    ], 21))
}

testGenSample(13333337)
