import { readInput, parseInput } from "../utils/general";

interface ElvesPair {
  elf1: number[],
  elf2: number[],
  overlap: number[],
  id: number
}

const generateNumbers = (input: string): number[] => {
  const numbers = input.split('-');

  const num1 = parseInt(numbers[0], 10)
  const num2 = parseInt(numbers[1], 10)

  return Array(num2 - num1 + 1).fill(0).map((_, i) => num1 + i)
}

const findDuplicates = (arr1: number[], arr2: number[]): number[] => {
  return arr1.filter(num => arr2.includes(num));
}

const overlapIsElfArea = (pair: ElvesPair): boolean => {
  const { overlap, elf1, elf2 } = pair;

  const filElf1 = elf1.every(sec => overlap.includes(sec));
  const filElf2 = elf2.every(sec => overlap.includes(sec));

  return filElf1 || filElf2
}

const input = readInput('day04', false);

const elfPairs: ElvesPair[] = parseInput(input, (line, index): ElvesPair => {

  const elvesSplit = line.split(',');

  const elf1 = generateNumbers(elvesSplit[0])
  const elf2 = generateNumbers(elvesSplit[1])

  return {
    elf1,
    elf2,
    overlap: findDuplicates(elf1, elf2),
    id: index
  }
})

const fullyContainedPairs = elfPairs.filter((pair) => overlapIsElfArea(pair))

console.log(`=== Part 1: Assignment Pairs with Total Overlap: ${fullyContainedPairs.length}`)
console.log(`=== Part 2: Assignment Pairs with Overlap: ${elfPairs.reduce((pVal, cVal) => {
  return pVal += cVal.overlap.length > 0 ? 1 : 0
}, 0)}`)