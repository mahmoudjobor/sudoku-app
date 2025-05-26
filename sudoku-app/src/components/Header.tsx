import React from "react";

const Header: React.FC = () => {
  return (
    <header>
      <h1>Sudoku Game</h1>
      <p>
        Fill in the grid so that each column, each row, and each of the nine 3×3
        boxes contain the digits from 1 to 9.
      </p>
    </header>
  );
};

export default Header;
