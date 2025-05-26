import React, { useState } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import { generateSudoku, validateBoard } from "./utils/sudokuGenrator";
import "./styles/App.css";

function App() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [board, setBoard] = useState<(number | null)[][]>(
    generateSudoku("medium")
  );
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [checkMsg, setCheckMsg] = useState<string>("");

  // Generate a new puzzle
  const handleNewGame = () => {
    const newPuzzle = generateSudoku(difficulty);
    setBoard(newPuzzle);
    setConflicts(new Set());
    setCheckMsg("");
  };

  // Validate board on every change
  const handleSetBoard = (newBoard: (number | null)[][]) => {
    setBoard(newBoard);
    setConflicts(validateBoard(newBoard));
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

  return (
    <div className="App">
      <Header />
      <div className="controls">
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
      <div className="sudoku-container">
        <Board board={board} setBoard={handleSetBoard} conflicts={conflicts} />
      </div>
      <button className="check-btn" onClick={handleCheckSolution}>
        Check Solution
      </button>
      {checkMsg && <div className="check-msg">{checkMsg}</div>}
    </div>
  );
}

export default App;
