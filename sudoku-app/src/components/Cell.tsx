import React from "react";

interface CellProps {
  value: number | null;
  onChange: (value: number | null) => void;
  isConflict?: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onChange, isConflict }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ? parseInt(event.target.value) : null;
    onChange(newValue);
  };

  return (
    <input
      type="number"
      value={value !== null ? value : ""}
      onChange={handleChange}
      min={1}
      max={9}
      className={`cell${isConflict ? " conflict" : ""}`}
    />
  );
};

export default Cell;
