import * as fs from 'fs';

type Move = 'Rock' | 'Paper' | 'Scissor' | 'Unknown'
type Outcome = 'W' | 'L' | 'T' | ''

interface Play {
  player1: Move,
  player2: Move,
  score: number,
  ogLine: string
}

const readInput = () => {
  const inputFile = fs.readFileSync('day02/input.txt');
  const inputFileString = inputFile.toString();
  return inputFileString;
}

// Rock can be A or X
// Paper can be B or Y
// Scissors can be C or Z

// Total score is the sum of scores for each round
// (1 for rock, 2 for paper, 3 for scissors)
// + Out come of the round (0 if lost, 3 if draw, 6 if won)

const parseInput = (input: string) => {
  const plays = input.split('\n')
  return plays;
}

const input = readInput();
const playsArr = parseInput(input);

const hardCode = (line: string): number => {
  const hardCodeMap = {
    "A X": 4,
    "A Y": 8,
    "A Z": 3,
    "B X": 1,
    "B Y": 5,
    "B Z": 9,
    "C X": 7,
    "C Y": 2,
    "C Z": 6,
  }

  // @ts-expect-error
  return hardCodeMap[line.trim()];
}

const scores = playsArr.map(play => hardCode(play))

const totalScore = scores.reduce((pVal, cVal) => {
  return pVal += cVal;
}, 0)

console.log(`=== Part 1 => Total Score: ${totalScore}`)

// A for Rock, B for Paper, and C for Scissors.
// 1 for Rock, 2 for Paper, and 3 for Scissors
// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win.
// 0 if you lost, 3 if the round was a draw, and 6 if you won

const hardCode2 = (line: string): number => {
  const hardCodeMap2 = {
    "A X": 3,
    "A Y": 4,
    "A Z": 8,
    "B X": 1,
    "B Y": 5,
    "B Z": 9,
    "C X": 2,
    "C Y": 6,
    "C Z": 7,
  }

  // @ts-expect-error
  return hardCodeMap2[line.trim()];
}

const updatedScores = playsArr.map(play => hardCode2(play));

const updatedTotalScore = updatedScores.reduce((pVal, cVal) => {
  return pVal += cVal;
}, 0)

console.log(`=== Part 2 => Total Score: ${updatedTotalScore}`)