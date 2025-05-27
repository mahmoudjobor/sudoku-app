import React, { useState } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import {
  generateSudoku,
  validateBoard,
  solveSudoku,
} from "./utils/sudokuGenrator";
import "./styles/App.css";
import ImageUpload from "./components/ImageUpload";

function App() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [board, setBoard] = useState<(number | null)[][]>(() => {
    const puzzle = generateSudoku("medium");
    return puzzle;
  });
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [checkMsg, setCheckMsg] = useState<string>("");
  const [initialCells, setInitialCells] = useState<boolean[][]>(() => {
    return board.map((row) => row.map((cell) => cell !== null));
  });

  // Generate a new puzzle
  const handleNewGame = () => {
    const newPuzzle = generateSudoku(difficulty);
    setBoard(newPuzzle);
    setConflicts(new Set());
    setCheckMsg("");

    const newInitialCells = newPuzzle.map((row) =>
      row.map((cell) => cell !== null)
    );
    setInitialCells(newInitialCells);

    setConflicts(new Set());
    setCheckMsg("");
  };

  // Validate board on every change
  const handleSetBoard = (newBoard: (number | null)[][]) => {
    setBoard(newBoard);
    setConflicts(validateBoard(newBoard));
    setCheckMsg("");
  };
  const handleBoardRecognition = (recognizedBoard: (number | null)[][]) => {
    setBoard(recognizedBoard);
    // Set all cells as non-read-only by making initialCells all false
    setInitialCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setConflicts(new Set());
    setCheckMsg("");
  };

  const handleCheckSolution = () => {
    const hasEmpty = board.some((row) => row.some((cell) => !cell));
    const currentConflicts = validateBoard(board);
    if (hasEmpty) {
      setCheckMsg("Please fill all cells before checking.");
    } else if (currentConflicts.size === 0) {
      setCheckMsg("Congratulations! Solution is correct.");
    } else {
      setCheckMsg("There are errors in your solution.");
    }
  };
  const handleClearBoard = () => {
    const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(null));
    setBoard(emptyBoard);
    setInitialCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setConflicts(new Set());
    setCheckMsg("");
  };
  const handleSolveAll = () => {
    const solution = solveSudoku([...board.map((row) => [...row])]);
    if (solution) {
      setBoard(solution);
      setConflicts(new Set());
      setCheckMsg("Puzzle solved!");
    } else {
      setCheckMsg("No solution exists for this puzzle!");
    }
  };

  const handleHint = () => {
    const solution = solveSudoku([...board.map((row) => [...row])]);
    if (!solution) {
      setCheckMsg("No solution exists for this puzzle!");
      return;
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!board[i][j] || board[i][j] !== solution[i][j]) {
          const newBoard = board.map((row) => [...row]);
          newBoard[i][j] = solution[i][j];
          setBoard(newBoard);
          setCheckMsg("Hint provided!");
          return;
        }
      }
    }
    setCheckMsg("No more hints needed - puzzle is solved!");
  };

  return (
    <div className="App">
      <Header />
      <div className="controls">
        <button className="control-btn clear" onClick={handleClearBoard}>
          Clear Board
        </button>
        <button className="control-btn solve" onClick={handleSolveAll}>
          Solve Puzzle
        </button>
        <button className="control-btn hint" onClick={handleHint}>
          Get Hint
        </button>
        <label htmlFor="difficulty">Difficulty: </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "easy" | "medium" | "hard")
          }
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="newgame-btn" onClick={handleNewGame}>
          New Game
        </button>
      </div>
      <ImageUpload
        onBoardRecognized={handleBoardRecognition}
        onStatusChange={setCheckMsg}
      />
      <div className="sudoku-container">
        <Board
          board={board}
          setBoard={handleSetBoard}
          conflicts={conflicts}
          initialCells={initialCells}
        />
      </div>
      <button className="check-btn" onClick={handleCheckSolution}>
        Check Solution
      </button>

      {checkMsg && <div className="check-msg">{checkMsg}</div>}
    </div>
  );
}

export default App;
