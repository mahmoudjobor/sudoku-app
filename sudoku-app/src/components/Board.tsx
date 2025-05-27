import React from "react";
import Cell from "./Cell";

interface BoardProps {
  board: (number | null)[][];
  setBoard: React.Dispatch<React.SetStateAction<(number | null)[][]>>;
  conflicts: Set<string>;
  initialCells: boolean[][];
}

const Board: React.FC<BoardProps> = ({
  board,
  setBoard,
  conflicts,
  initialCells,
}) => {
  const handleCellChange = (row: number, col: number, value: number | null) => {
    if (initialCells[row][col]) return;
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = value;
    setBoard(newBoard);
  };

  return (
    <div className="sudoku-container">
      {board.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => {
          // Add thick borders for 3x3 blocks
          const borderClass = [
            rowIndex % 3 === 0 ? "border-top" : "",
            colIndex % 3 === 0 ? "border-left" : "",
            rowIndex === 8 ? "border-bottom" : "",
            colIndex === 8 ? "border-right" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const isConflict = conflicts.has(`${rowIndex}-${colIndex}`);
          return (
            <div
              className={`sudoku-cell ${borderClass}`}
              key={`${rowIndex}-${colIndex}`}
            >
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cellValue}
                onChange={(value) =>
                  handleCellChange(rowIndex, colIndex, value)
                }
                isConflict={conflicts.has(`${rowIndex}-${colIndex}`)}
                readOnly={initialCells[rowIndex][colIndex]}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default Board;
