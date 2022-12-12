import * as fs from 'fs';

const readInput = (day: string, example = false): string => {
  const inputFile = fs.readFileSync(example ? `${day}/example.txt` : `${day}/input.txt`);
  const inputFileString = inputFile.toString();
  return inputFileString;
}

const input = readInput('day07', false);

// An interface for a tree node which will be used to build the tree of the filesystem
interface INode {
  name: string;
  children: INode[];
  parent: INode | null;
  isFile: boolean;
  size?: number;
}


const parseInput = (input: string) => {
  const lineSplit = input.split('\n').map(s => s.trim());

  /*
    Each line will either be a command or an output of a command.
    Lines that start with a $ are commands. The possible commands are:
    - cd <directory>
      - cd / - go to root
      - cd .. - go up a directory
      - cd <directory> - go to directory
    - ls

    Lines that do not start with a $ are the output of a command.
    The possible format of outputs are:
    - <number> <filename>
    - <directory>

    Generate a tree of the filesystem given the input
  */

  const root: INode = {
    name: '/',
    children: [],
    parent: null,
    isFile: false,
    size: 0
  }

  let currentDirectory = root;

  lineSplit.forEach((line, i) => {
    // Check if the line is a command
    if (line.startsWith('$')) {
      // Check if the command is a cd command
      if (line.startsWith('$ cd')) {
        // Check if the command is a cd to root
        if (line === '$ cd /') {
          currentDirectory = root;
        } else if (line === '$ cd ..') {
          const { parent } = currentDirectory;
          if (parent)
            currentDirectory = parent;
        } else {
          // Get the directory name
          const directoryName = line.split(' ').at(-1);
          // Generate a new directory node
          const newDirectory: INode = {
            name: directoryName || 'unknown',
            children: [],
            parent: currentDirectory,
            isFile: false
          }

          // Check if the directory already exists
          const existingDirectory = currentDirectory.children.find(c => c.name === directoryName);

          if (!existingDirectory) {
            // Add the new directory to the current directory
            currentDirectory.children.push(newDirectory);
          }

          // Set the current directory to the new directory
          currentDirectory = existingDirectory || newDirectory;
        }
      }
      // Check if the command is an ls command
      else if (line.startsWith('$ ls')) {
        // Get the output of the ls command which is every line until the next command
        let nextCommandFound = false;

        /*
          lsOutput will be an array of strings where each string is a file or directory
          in the current directory.

          The output of ls will be in the format:
          <number> <filename>
          dir <dirname>
        */
        const lsOutput = lineSplit.slice(i + 1)
          .map(l => l.trim())
          .reduce((acc, l) => {
            if (l.startsWith('$')) {
              nextCommandFound = true;
            }
            if (!nextCommandFound) {
              acc.push(l);
            }
            return acc;
          }, [] as string[])

        // Generate a new file node for each file in the ls output
        lsOutput.forEach((file) => {
          // Check if the file is a directory
          if (file.startsWith('dir')) {
            const directoryName = file.split(' ').at(-1);
            const newDirectory: INode = {
              name: directoryName || 'unknown',
              children: [],
              parent: currentDirectory,
              isFile: false
            }
            // Push the new directory to the current directory if it is not already there
            if (!currentDirectory.children.find(c => c.name === newDirectory.name))
              currentDirectory.children.push(newDirectory);
          } else {
            const newFile: INode = {
              name: file,
              children: [],
              parent: currentDirectory,
              isFile: true,
              size: parseInt(file.split(' ').at(0) || '0', 10)
            }
            currentDirectory.children.push(newFile);
          }

        })
      }
    }
  })

  return root;
}

const rootNode = parseInput(input)

// A function to print the tree of the filesystem
const printTree = (node: INode, depth = 0) => {
  const indent = ' '.repeat(depth * 2);
  console.log(`${indent}${node.name} ${node?.size ? `(size: ${node.size})` : ''}`);
  node.children.forEach(child => printTree(child, depth + 1));
}

const findNode = (node: INode, name: string): INode | null => {
  if (node.name === name) {
    return node;
  }
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const found = findNode(child, name);
    if (found) {
      return found;
    }
  }
  return null;
}

const computeDirectorySize = (node: INode): number => {
  if (node.isFile) {
    return node.size || 0;
  }
  let size = 0;
  node.children.forEach(child => {
    size += computeDirectorySize(child);
  })
  return size;
}

// Compute the size of each directory
const computeAllDirectorySizes = (node: INode) => {
  node.children.forEach(child => {
    if (!child.isFile) {
      child.size = computeDirectorySize(child);
      computeAllDirectorySizes(child);
    }
  })
}

const computeRootSize = (node: INode) => {
  node.size = computeDirectorySize(node);
}

computeAllDirectorySizes(rootNode);
computeRootSize(rootNode);

// Find all directories that are under some threshold
const findDirectoriesUnderThreshold = (node: INode, threshold: number): INode[] => {
  const directories: INode[] = [];
  if (!node.isFile && node.size && node.size < threshold) {
    directories.push(node);
  }
  node.children.forEach(child => {
    const childDirectories = findDirectoriesUnderThreshold(child, threshold);
    directories.push(...childDirectories);
  })
  return directories;
}

const directories = findDirectoriesUnderThreshold(rootNode, 100_000);

console.log(`All directories under 10k summed up gives us a total size of ${directories.reduce((acc, d) => acc + (d?.size || 0), 0)} bytes`);

/*
  We have a total space of 70000000 and we need at least 30000000 free.
  The root directory will give us the total size that we currently have.
*/

// Calculate the total size of the filesystem
const totalSize = computeDirectorySize(rootNode);

console.log(`Currently we have used ${totalSize} bytes of space out of 70000000 bytes (` + `${(totalSize / 70000000 * 100).toFixed(2)}% usage)`);
console.log(`We need to find a directory of size ${70000000 - totalSize} bytes to free up space`)


/*
  Find all directories that are larger than some size. As well is not the root directory.
*/
const findDirectoriesToDelete = (node: INode, size: number): Promise<INode[]> => {
  return new Promise((resolve, reject) => {
    const directories: INode[] = [];
    if (!node.isFile && node.size && node.size > size && node.name !== 'root') {
      directories.push(node);
    }
    node.children.forEach(child => {
      findDirectoriesToDelete(child, size).then(childDirectories => {
        directories.push(...childDirectories);
        if (directories.length > 0) {
          resolve(directories);
        }
      }).catch(err => reject(err))
    })
    if (directories.length > 0) {
      resolve(directories);
    }
  })
}

const totalFree = 70_000_000 - totalSize;
const totalNeeded = 30000000 - totalFree;
console.log(`We need to find a directory of size at least ${totalNeeded} bytes to free up space`)

findDirectoriesToDelete(rootNode, totalNeeded).then(directoryToDelete => {
  console.log(`Did we find a directory to delete? ${directoryToDelete ? 'Yes' : 'No'}`)

  // Find the smallest directory in the list
  const smallestDirectory = directoryToDelete.reduce((acc, d) => {
    if (d.size && acc.size && d.size < acc.size) {
      return d;
    }
    return acc;
  }, directoryToDelete[0]);

  console.log(`The smallest directory we can delete is ${smallestDirectory.name} with a size of ${smallestDirectory.size} bytes`)
}).catch(err => console.error(err))
