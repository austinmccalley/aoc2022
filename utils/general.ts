import * as fs from 'fs';

const readInput = (day: string, example = false): string => {
  const inputFile = fs.readFileSync(example ? `${day}/example.txt` : `${day}/input.txt`);
  const inputFileString = inputFile.toString();
  return inputFileString;
}

const parseInput = <T>(input: string, func: (line: string, index: number) => T): T[] => {
  return input.split('\n').map(func)
}


export {
  readInput,
  parseInput
}