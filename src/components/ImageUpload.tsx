import React, { useState } from "react";
import { createWorker, createScheduler } from "tesseract.js";

interface ImageUploadProps {
  onBoardRecognized: (board: (number | null)[][]) => void;
  onStatusChange: (message: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onBoardRecognized,
  onStatusChange,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const buildTemplate = (imageSize: number) => {
    const gridTotalHeight = imageSize;
    const margin = Math.floor(0.02 * gridTotalHeight);
    const cellHeight = Math.floor(gridTotalHeight / 9);
    const fudgeFactor = Math.ceil(0.003 * gridTotalHeight);

    const grid = Array.from({ length: 9 }, (_, rowIndex) =>
      Array.from({ length: 9 }, (_, colIndex) => ({
        left:
          colIndex * cellHeight +
          margin / 2 +
          fudgeFactor * (Math.floor(colIndex / 3) + 1),
        top:
          rowIndex * cellHeight +
          margin / 2 +
          fudgeFactor * (Math.floor(rowIndex / 3) + 1),
        width: cellHeight - margin - fudgeFactor,
        height: cellHeight - margin - fudgeFactor,
      }))
    );

    return grid;
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    onStatusChange("Processing image...");

    try {
      const img = await createImageFromFile(file);
      const size = Math.min(img.width, img.height);
      const gridTemplate = buildTemplate(size);
      const board = await recognizeGrid(gridTemplate, file);

      if (validateRecognizedBoard(board)) {
        onBoardRecognized(board);
        onStatusChange("Board recognized successfully!");
      } else {
        onStatusChange("Could not recognize a valid board. Please try again.");
      }
    } catch (error) {
      console.error(error);
      onStatusChange("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const recognizeGrid = async (
    grid: any[][],
    imageFile: File
  ): Promise<(number | null)[][]> => {
    const scheduler = createScheduler();
    const worker1 = await createWorker("eng");
    const worker2 = await createWorker("eng");
    const worker3 = await createWorker("eng");

    await Promise.all(
      [worker1, worker2, worker3].map(async (worker) => {
        await worker.setParameters({
          tessedit_char_whitelist: "123456789",
        });
        scheduler.addWorker(worker);
      })
    );

    const imageUrl = URL.createObjectURL(imageFile);
    const results = await Promise.all(
      grid
        .flat()
        .map((rectangle) =>
          scheduler.addJob("recognize", imageUrl, { rectangle })
        )
    );

    await scheduler.terminate();
    URL.revokeObjectURL(imageUrl);

    // Convert results to 9x9 board
    const board: (number | null)[][] = Array.from({ length: 9 }, () =>
      Array(9).fill(null)
    );

    results.forEach((result, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const text = result.data.text.trim();
      const num = parseInt(text);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        board[row][col] = num;
      }
    });

    return board;
  };

  const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img);
      };
    });
  };

  const validateRecognizedBoard = (board: (number | null)[][]): boolean => {
    let count = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== null) count++;
      }
    }
    return count >= 8;
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])}
        disabled={isProcessing}
        className="image-upload-input"
      />
      {isProcessing && (
        <div className="processing-indicator">Processing image...</div>
      )}
    </div>
  );
};

export default ImageUpload;
