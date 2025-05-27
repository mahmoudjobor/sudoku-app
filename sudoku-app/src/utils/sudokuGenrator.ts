function generateSudoku(difficulty: "easy" | "medium" | "hard" = "medium") {
  // Generate a complete valid board first
  const fullBoard = generateFullBoard();
  const puzzle = copyBoard(fullBoard);

  // Set number of cells to remove based on difficulty
  const cellsToRemove =
    difficulty === "easy" ? 30 : difficulty === "medium" ? 45 : 54; // hard: remove 60 cells

  // Randomly remove numbers
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== null) {
      const backup = puzzle[row][col];
      puzzle[row][col] = null;

      // Check if puzzle still has unique solution
      if (countSolutions(puzzle, 2) === 1) {
        removed++;
      } else {
        // If multiple solutions possible, restore the number
        puzzle[row][col] = backup;
      }
    }
  }

  return puzzle;
}

// Helper to deep copy a board
function copyBoard(board: (number | null)[][]): (number | null)[][] {
  return board.map((row) => [...row]);
}

// Backtracking solver: fills the board, returns true if solved
function solveBoard(board: (number | null)[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!board[row][col]) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveBoard(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Check if num can be placed at board[row][col]
function isSafe(
  board: (number | null)[][],
  row: number,
  col: number,
  num: number
): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

// Count solutions (for uniqueness check)
function countSolutions(board: (number | null)[][], limit = 2): number {
  let count = 0;
  function helper(b: (number | null)[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!b[row][col]) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(b, row, col, num)) {
              b[row][col] = num;
              if (helper(b)) {
                b[row][col] = null;
                return true;
              }
              b[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }
  helper(copyBoard(board));
  return count;
}

// Generate a full valid board
function generateFullBoard(): (number | null)[][] {
  const board = Array.from({ length: 9 }, () => Array(9).fill(null));
  fillBoardRandom(board);
  return board;
}

// Fill the board using backtracking with random order
function fillBoardRandom(board: (number | null)[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!board[row][col]) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoardRandom(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Shuffle array
function shuffle(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
export function solveSudoku(
  board: (number | null)[][]
): (number | null)[][] | null {
  const emptyCells = findEmptyCells(board);
  if (emptyCells.length === 0) return board;

  const [row, col] = emptyCells[0];

  for (let num = 1; num <= 9; num++) {
    if (isSafe(board, row, col, num)) {
      board[row][col] = num;

      const solution = solveSudoku(board);
      if (solution) return solution;

      board[row][col] = null;
    }
  }

  return null;
}
function findEmptyCells(board: (number | null)[][]): [number, number][] {
  const emptyCells: [number, number][] = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!board[i][j]) emptyCells.push([i, j]);
    }
  }
  return emptyCells;
}

// Returns a Set of cell keys (e.g., 'row-col') that are in conflict
function validateBoard(board: (number | null)[][]): Set<string> {
  const conflicts = new Set<string>();

  // Check rows and columns
  for (let i = 0; i < 9; i++) {
    const rowMap = new Map<number, number[]>();
    const colMap = new Map<number, number[]>();
    for (let j = 0; j < 9; j++) {
      // Row
      const rowVal = board[i][j];
      if (rowVal && rowVal >= 1 && rowVal <= 9) {
        if (!rowMap.has(rowVal)) rowMap.set(rowVal, []);
        rowMap.get(rowVal)!.push(j);
      }
      // Column
      const colVal = board[j][i];
      if (colVal && colVal >= 1 && colVal <= 9) {
        if (!colMap.has(colVal)) colMap.set(colVal, []);
        colMap.get(colVal)!.push(j);
      }
    }

    // Mark row conflicts
    for (const [num, cols] of rowMap.entries()) {
      if (cols.length > 1) {
        cols.forEach((col) => conflicts.add(`${i}-${col}`));
      }
    }
    // Mark col conflicts
    for (const [num, rows] of colMap.entries()) {
      if (rows.length > 1) {
        rows.forEach((row) => conflicts.add(`${row}-${i}`));
      }
    }
  }

  // Check 3x3 blocks
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const blockMap = new Map<number, [number, number][]>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const row = blockRow * 3 + i;
          const col = blockCol * 3 + j;
          const val = board[row][col];
          if (val && val >= 1 && val <= 9) {
            if (!blockMap.has(val)) blockMap.set(val, []);
            blockMap.get(val)!.push([row, col]);
          }
        }
      }
      for (const [num, cells] of blockMap.entries()) {
        if (cells.length > 1) {
          cells.forEach(([row, col]) => conflicts.add(`${row}-${col}`));
        }
      }
    }
  }

  return conflicts;
}

export { generateSudoku, validateBoard };
