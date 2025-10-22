import React from "react";

function QuestionCard({ index, question, answer, onSpeech, onAnswerChange }) {
  return (
    <div className="border rounded p-3 mb-3 shadow-sm">
      <p className="font-semibold mb-2">
        {index + 1}. {question}
      </p>
      <textarea
        rows="2"
        className="border w-full p-2 rounded mb-2"
        placeholder="Your answer..."
        value={answer}
        onChange={onAnswerChange}
      />
      <button
        onClick={onSpeech}
        className="bg-purple-600 text-white rounded px-3 py-1 hover:bg-purple-700"
      >
        🎙 Speak Answer
      </button>
    </div>
  );
}

export default QuestionCard;
