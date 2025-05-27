import { useState, useCallback } from "react";
import {
  generateSudoku,
  validateBoard,
  solveSudoku,
} from "../utils/sudokuGenrator";

export type CellValue = number | null;

export interface CellProps {
  value: CellValue;
  onChange: (value: CellValue) => void;
}

export interface BoardProps {
  board: Board;
  onCellChange: (row: number, col: number, value: CellValue) => void;
}
export type Board = (number | null)[][];
export type Coordinates = [number, number];
export type DifficultyLevel = "easy" | "medium" | "hard";
export type ConflictSet = Set<string>;

export function useSudokuGame(initialDifficulty: DifficultyLevel = "medium") {
  const [difficulty, setDifficulty] =
    useState<DifficultyLevel>(initialDifficulty);
  const [board, setBoard] = useState<Board>(() =>
    generateSudoku(initialDifficulty)
  );
  const [conflicts, setConflicts] = useState<ConflictSet>(new Set());
  const [message, setMessage] = useState<string>("");
  const [initialCells, setInitialCells] = useState<boolean[][]>(() =>
    board.map((row) => row.map((cell) => cell !== null))
  );

  const updateBoard = useCallback((newBoard: Board) => {
    setBoard(newBoard);
    setConflicts(validateBoard(newBoard));
    setMessage("");
  }, []);

  const newGame = useCallback(() => {
    const newPuzzle = generateSudoku(difficulty);
    setBoard(newPuzzle);
    setConflicts(new Set());
    setMessage("");
    setInitialCells(newPuzzle.map((row) => row.map((cell) => cell !== null)));
  }, [difficulty]);

  const checkSolution = useCallback(() => {
    const hasEmpty = board.some((row) => row.some((cell) => !cell));
    const currentConflicts = validateBoard(board);

    if (hasEmpty) {
      setMessage("Please fill all cells before checking.");
    } else if (currentConflicts.size === 0) {
      setMessage("Congratulations! Solution is correct.");
    } else {
      setMessage("There are errors in your solution.");
    }
  }, [board]);

  const clearBoard = useCallback(() => {
    const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(null));
    setBoard(emptyBoard);
    setInitialCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setConflicts(new Set());
    setMessage("");
  }, []);

  const solveBoard = useCallback(() => {
    const solution = solveSudoku([...board.map((row) => [...row])]);
    if (solution) {
      setBoard(solution);
      setConflicts(new Set());
      setMessage("Puzzle solved!");
    } else {
      setMessage("No solution exists for this puzzle!");
    }
  }, [board]);

  const getHint = useCallback(() => {
    const solution = solveSudoku([...board.map((row) => [...row])]);
    if (!solution) {
      setMessage("No solution exists for this puzzle!");
      return;
    }

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!board[i][j] || board[i][j] !== solution[i][j]) {
          const newBoard = board.map((row) => [...row]);
          newBoard[i][j] = solution[i][j];
          setBoard(newBoard);
          setMessage("Hint provided!");
          return;
        }
      }
    }
    setMessage("No more hints needed - puzzle is solved!");
  }, [board]);

  return {
    board,
    conflicts,
    message,
    setMessage,
    initialCells,
    difficulty,
    updateBoard,
    setDifficulty,
    newGame,
    checkSolution,
    clearBoard,
    solveBoard,
    getHint,
  };
}
