import React from "react";

function ResultCard({ index, feedback }) {
  return (
    <div className="border rounded p-3 mb-3 bg-gray-50">
      <p>
        <strong>Q{index + 1}:</strong> {feedback}
      </p>
    </div>
  );
}

export default ResultCard;
