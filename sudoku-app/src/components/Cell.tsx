import React from "react";

interface CellProps {
  value: number | null;
  onChange: (value: number | null) => void;
  isConflict?: boolean;
  readOnly?: boolean;
}

const Cell: React.FC<CellProps> = ({
  value,
  onChange,
  isConflict,
  readOnly,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;

    const newValue = event.target.value ? parseInt(event.target.value) : null;
    if (!newValue || (newValue >= 1 && newValue <= 9)) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="number"
      value={value !== null ? value : ""}
      onChange={handleChange}
      min={1}
      max={9}
      className={`cell${isConflict ? " conflict" : ""}`}
      readOnly={readOnly}
    />
  );
};

export default Cell;
