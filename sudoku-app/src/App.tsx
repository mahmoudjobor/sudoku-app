import type { FC } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import ImageUpload from "./components/ImageUpload";
import { useSudokuGame } from "./hooks/useSudokuGame";
import "./styles/App.css";

const App: FC = () => {
  const {
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
  } = useSudokuGame();

  return (
    <div className="App">
      <Header />
      <div className="controls">
        <button className="control-btn clear" onClick={clearBoard}>
          Clear Board
        </button>
        <button className="control-btn solve" onClick={solveBoard}>
          Solve Puzzle
        </button>
        <button className="control-btn hint" onClick={getHint}>
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
        <button className="newgame-btn" onClick={newGame}>
          New Game
        </button>
      </div>
      <ImageUpload
        onBoardRecognized={updateBoard}
        onStatusChange={setMessage}
      />
      <div className="sudoku-container">
        <Board
          board={board}
          setBoard={(newBoard) => updateBoard(newBoard as (number | null)[][])}
          conflicts={conflicts}
          initialCells={initialCells}
        />
      </div>
      <button className="check-btn" onClick={checkSolution}>
        Check Solution
      </button>

      {message && <div className="check-msg">{message}</div>}
    </div>
  );
};

export default App;
