import { readInput, parseInput } from "../utils/general";


const input = readInput('day06', false);
const splitInput = parseInput(input, (line) => line.split(''))

if (splitInput.length !== 1) throw new Error('Input bad!')

const buffer: string[] = splitInput[0];
// Start-of-packet marker length
const sopMarkerLength = 4;

const allPossibleStarts = buffer.map((char, i) => {
  // Grab the next sopMarkerLength - 1 characters
  const sopMarker = buffer.slice(i, i + sopMarkerLength).join('');

  if (sopMarker.length !== sopMarkerLength) return {}

  return {
    marker: sopMarker,
    containsDuplicates: sopMarker.split('').some((char, i, arr) => arr.indexOf(char) !== i),
    startIndex: i + sopMarkerLength,
  }
}).filter(marker => marker?.marker)


// Find the first marker that doesn't contain duplicates
const firstMarker = allPossibleStarts.find(m => !m.containsDuplicates);
console.log(firstMarker)


// Start-of-message marker
const somMarkerLength = 14;
const allPossibleMessages = buffer.map((char, i) => {
  // Grab the next somMarkerLength - 1 characters
  const somMarker = buffer.slice(i, i + somMarkerLength).join('');

  if (somMarker.length !== somMarkerLength) return {}

  return {
    marker: somMarker,
    containsDuplicates: somMarker.split('').some((char, i, arr) => arr.indexOf(char) !== i),
    startIndex: i + somMarkerLength,
  }
}).filter(marker => marker?.marker)

// Find the first marker that doesn't contain duplicates
const firstMessage = allPossibleMessages.find(m => !m.containsDuplicates);
console.log(firstMessage)