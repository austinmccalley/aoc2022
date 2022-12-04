import * as fs from 'fs';

const readInput = () => {
  const inputFile = fs.readFileSync('day01/input.txt');
  const inputFileString = inputFile.toString();
  return inputFileString;
}

const input = readInput();
const splitInput = input.split('\n');

const parseInput = (input: string[]) => {
  const elfCals: Record<number, number> = {}

  let cElf = 0
  input.forEach((inp) => {
    if (inp === '') {
      // Move cElf to the next one
      cElf += 1;
    } else {
      if (Object.keys(elfCals).includes(cElf.toString()))
        elfCals[cElf] += parseInt(inp, 10);
      else
        elfCals[cElf] = parseInt(inp, 10);
    }
  })

  return elfCals;
}

const findEntryMax = (input: Record<number, number>): number => {
  const allNums = Object.values(input);

  return Math.max(...allNums);
}

const elfCals = parseInput(splitInput);
const maxEntry = findEntryMax(elfCals)
console.log(`=== Max Cals: ${maxEntry}`);

const topThreeMax = (input: Record<number, number>): number => {
  const allNums = Object.values(input);

  allNums.sort((a, b) => b - a);

  const topThree = allNums.splice(0, 3);

  return topThree.reduce((pVal, cVal) => pVal + cVal, 0);
}

console.log(`=== Top Three Sum: ${topThreeMax(elfCals)}`)