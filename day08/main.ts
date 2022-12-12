import { readInput, parseInput } from "../utils/general";


interface ITree {
  height: number;
  // 0 = not-visible, 1 = visible, 2 = unknown
  visible: 0 | 1 | 2;
  x: number;
  y: number;
  scenicScore?: number;
}

const input = readInput('day08', false);
const splitInput = parseInput(input, (line, y) => {
  return line.split('').map((treeHeight, x): ITree => {
    return {
      height: parseInt(treeHeight, 10),
      visible: 2,
      x,
      y,
    }
  });
})

const getWidth = (trees: ITree[][]) => trees[0].length;
const getHeight = (trees: ITree[][]) => trees.length;

// A tree is visible if all of the trees between it and an edge of
// the forest are shorter than it. We can assume that the trees
// are in a straight line, so we can just check the trees to the
// left, right, top, and bottom of the tree. We can assume all the 
// trees on the edge are already visible.
const isTreeVisible = (tree: ITree, trees: ITree[][], xDef: number, yDef: number) => {
  const width = getWidth(trees);
  const height = getHeight(trees);

  let visibleLeft = true;
  let visibleRight = true;
  let visibleTop = true;
  let visibleBottom = true;

  if (xDef === 0 || xDef === width - 1 || yDef === 0 || yDef === height - 1) return true;

  // Check the trees to the left
  for (let x = xDef - 1; x >= 0; x--) {
    if (trees[yDef][x].height >= tree.height) {
      visibleLeft = false;
    }
  }

  // Check the trees to the right
  for (let x = xDef + 1; x < width; x++) {
    if (trees[yDef][x].height >= tree.height) {
      visibleRight = false;
    }
  }

  // Check the trees above
  for (let y = yDef - 1; y >= 0; y--) {
    if (trees[y][xDef].height >= tree.height) {
      visibleTop = false;
    }
  }

  // Check the trees below
  for (let y = yDef + 1; y < height; y++) {
    if (trees[y][xDef].height >= tree.height) {
      visibleBottom = false;
    }
  }

  return visibleBottom || visibleLeft || visibleRight || visibleTop;
}

const calculateScenicScore = (trees: ITree[][]) => {
  trees.forEach((row, y) => {
    row.forEach((tree, x) => {
      // To measure the viewing distance from a given tree, look up, down, left, and right from that tree; 
      //  stop if you reach an edge or at the first tree that is the same height or taller than the tree
      //  under consideration. (If a tree is right on the edge, at least one of its viewing distances will
      //  be zero.)
      let up = 0;
      let down = 0;
      let left = 0;
      let right = 0;

      // Check up
      for (let yCheck = y - 1; yCheck >= 0; yCheck--) {
        up++;
        if (trees[yCheck][x].height >= tree.height) break;
      }

      // Check down
      for (let yCheck = y + 1; yCheck < getHeight(trees); yCheck++) {
        down++;
        if (trees[yCheck][x].height >= tree.height) break;
      }

      // Check left
      for (let xCheck = x - 1; xCheck >= 0; xCheck--) {
        left++;
        if (trees[y][xCheck].height >= tree.height) break;
      }

      // Check right
      for (let xCheck = x + 1; xCheck < getWidth(trees); xCheck++) {
        right++;
        if (trees[y][xCheck].height >= tree.height) break;
      }

      if (up === 0 || down === 0 || left === 0 || right === 0) {
        tree.scenicScore = 0;
      } else
        tree.scenicScore = up * down * left * right;
    })
  })
}

const findHeightScenicScore = (trees: ITree[][]) => {
  let max = 0;
  trees.forEach((row) => {
    row.forEach((tree) => {
      if (tree.scenicScore && tree.scenicScore > max) {
        max = tree.scenicScore;
      }
    })
  })
  return max;
}

const updateTrees = (trees: ITree[][]): Promise<void> => {
  return new Promise((resolve) => {
    trees.forEach((row, y) => {
      row.forEach((tree, x) => {
        if (tree.visible === 2) {
          tree.visible = isTreeVisible(tree, trees, x, y) ? 1 : 0;
        }
      })
    })
    resolve();
  })
}

const printTrees = (trees: ITree[][]) => {
  trees.forEach((row, y) => {
    const formattedRow = row.map((tree) => {
      return tree.visible === 1 ? 'X' : ' ';
    })
    console.log(formattedRow.join(''));
  })
}

const countVisibleTrees = (trees: ITree[][]) => {
  let count = 0;
  trees.forEach((row) => {
    row.forEach((tree) => {
      if (tree.visible === 1) count++;
    })
  })
  return count;
}

const trees = splitInput;
updateTrees(trees);
calculateScenicScore(trees);
console.log(countVisibleTrees(trees));
console.log(findHeightScenicScore(trees));

printTrees(trees);