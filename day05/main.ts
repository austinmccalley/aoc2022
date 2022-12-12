import { readInput, parseInput } from "../utils/general";

interface IMove {
  num: number;
  from: number;
  to: number;
}

type ICrates = Record<number, string[]>;

const example = false;
let drawingHeight = example ? 4 : 9

const input = readInput('day05', example);
const splitInput = parseInput(input, (line) => line)

const crateLine = splitInput[drawingHeight - 1]
const numCrates = crateLine
  .split(' ')
  .map(s => s.trim())
  .filter(s => s.length)
  .map(n => parseInt(n, 10))
  .at(-1)

const generateCrates = (crateLines: string[]): ICrates => {

  // Format of crate line
  // [X]•[Y]•[Z]•...
  // Each line has 3 characters for that crate and then a space to mark the next character
  // A crate can have nothing there if its 3 characters are spaces

  const cratesPerLine = crateLines
    .map((cl) => cl.split('')
      .reduce((acc, char, i) => {
        if (i % 4 === 0) {
          acc.push([char]);
        } else {
          acc[acc.length - 1].push(char);
        }
        return acc;
      }, [] as string[][])
      .map(g => g.filter(c => c !== '[' && c !== ']'))
      .map(g => g.join(''))
      .map(g => g.trim())
    )

  const crates = cratesPerLine.reduceRight((acc, line) => {
    line.forEach((crate, i) => {
      if (crate.length) {
        if (!acc[i + 1]) acc[i + 1] = [];

        acc[i + 1].push(crate);
      }
    })
    return acc;
  }, {} as ICrates)

  return crates;
}


const crateStacks: ICrates = generateCrates(splitInput.slice(0, drawingHeight - 1));

const generateMove = (move: string): IMove => {
  const splitMove = move.split(' ');

  //   0    1     2     3   4   5
  // move {num} from {from} to {to}

  if (splitMove.length !== 6) throw new Error('Incorrect length')

  const parsedMove = {
    num: parseInt(splitMove[1], 10),
    from: parseInt(splitMove[3], 10),
    to: parseInt(splitMove[5], 10),
  }

  return parsedMove;
}

const moves = splitInput.slice(drawingHeight).filter(s => s.length)
const parsedMoves: IMove[] = moves.map(generateMove)

console.log(parsedMoves)
console.log(crateStacks)

// Iterate over all the moves and perform them on crateStacks

parsedMoves.forEach((move) => {
  const { num, from, to } = move;

  const cratesToMove = crateStacks[from].splice(-num);
  crateStacks[to].push(...cratesToMove);

  console.log(`Moved ${cratesToMove} from ${from} to ${to}`)
})

// Get the top crate from each stack
const topCrates = Object.keys(crateStacks).reduce((acc, key) => {
  const stack = crateStacks[parseInt(key)];
  const topCrate = stack[stack.length - 1];
  acc[key] = topCrate;
  return acc;
}, {} as Record<string, string>)

const finalCrates = Object.values(topCrates).join('')

console.log(finalCrates)

