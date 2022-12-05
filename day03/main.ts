import * as fs from 'fs';

interface IRucksack {
  comp1: string[],
  comp2: string[],
  bag: string[],
  id: number,
  groupNumber: number
}

const prioKey = 'abcdefghijklmnopqrstuvwxyz'
const upperPrioKey = prioKey.toUpperCase()

const readInput = (example: boolean = false) => {
  const inputFile = fs.readFileSync(example ? 'day03/example.txt' : 'day03/input.txt');
  const inputFileString = inputFile.toString();
  return inputFileString;
}

const parseInput = (input: string): IRucksack[] => {
  let groupNumber = 0;
  let currentCount = 0;
  return input.split('\n').map((line, index): IRucksack => {
    // Get the length of the line
    const lineLength = line.length;
    const halfLine = lineLength / 2;

    currentCount += 1;

    if (currentCount > 3) {
      groupNumber += 1;
      currentCount = 1;
    }

    const rucksack: IRucksack = {
      comp1: line.split('').splice(0, halfLine),
      comp2: line.split('').splice(halfLine),
      bag: line.split(''),
      id: index,
      groupNumber
    }

    return rucksack
  })
}


const findDuplicateItems = (comp1: string[], comp2: string[]): string[] => {
  return Array.from(new Set(comp1.filter(c => comp2.includes(c))))
}

const givePrio = (char: string): number => {
  if (char.toUpperCase() === char) {
    //  Is upper
    return upperPrioKey.indexOf(char) + 27;
  } else {
    return prioKey.indexOf(char) + 1;
  }
}

/* 
Every item type is identified by a single lowercase or uppercase letter (that is, a and A refer to different types of items).
*/

const input = readInput();
const rucksacks = parseInput(input)

const duplicateItems = rucksacks.map(rucksack => findDuplicateItems(rucksack.comp1, rucksack.comp2)).flat()
const dupPrios = duplicateItems.map(item => givePrio(item))
const prioritiesSum = dupPrios.reduce((pVal, cVal) => pVal += cVal, 0)

console.log(`=== Part 1 => Priorities Sum: ${prioritiesSum}`)

const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

const groupRucksacks = (rucksacks: IRucksack[]) => {
  return groupBy(rucksacks, (rucksack) => {
    return rucksack.groupNumber.toString()
  })
}

const findDuplicateItems2 = (comp1: string[], comp2: string[], comp3: string[]): string[] => {
  return Array.from(new Set(comp1.filter(c => comp2.includes(c) && comp3.includes(c))))
}

const groupedRucksacks = Object.values(groupRucksacks(rucksacks)).filter(group => group.length === 3)

const groupedDuplicateItems: string[] = groupedRucksacks
  .map(group => findDuplicateItems2(group[0].bag, group[1].bag, group[2].bag))
  .flat()

const groupedDupPrios = groupedDuplicateItems.map(item => givePrio(item));
const groupedPrioSums = groupedDupPrios.reduce((pVal, cVal) => pVal += cVal, 0)

console.log(`=== Part 2 => Group Priorities Sum: ${groupedPrioSums}`)
