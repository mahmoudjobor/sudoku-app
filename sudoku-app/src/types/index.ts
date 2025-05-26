export type CellValue = number | null;

export type SudokuBoard = CellValue[][];

export interface CellProps {
  value: CellValue;
  onChange: (value: CellValue) => void;
}

export interface BoardProps {
  board: SudokuBoard;
  onCellChange: (row: number, col: number, value: CellValue) => void;
}
