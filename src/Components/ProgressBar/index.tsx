import React from "react";

interface ProgressBarProps {
  progress: number; // Progress in percentage (0-100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="border border-gray-300 rounded w-full h-7">
      <div
        style={{
          width: `${progress}%`,
        }}
        className="grid place-items-center bg-orange text-white h-full"
      >
        Uploaded: {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
