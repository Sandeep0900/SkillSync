import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Interview({ questions, language }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (index < questions.length) {
      speakQuestion(questions[index]);
      startRecording();
    }
  }, [index]);

  const speakQuestion = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language.toLowerCase().includes("hindi") ? "hi-IN" : "en-US";
    synth.speak(utter);
  };

  const startRecording = () => {
    const recognition =
      new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language.toLowerCase().includes("hindi") ? "hi-IN" : "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const answer = event.results[0][0].transcript;
      setAnswers((prev) => [...prev, answer]);
      setIndex((prev) => prev + 1);
    };

    recognition.onerror = (err) => {
      console.error(err);
      alert("Speech recognition error. Try again.");
    };
  };

  const finishInterview = async () => {
    try {
      const res = await axios.post("http://localhost:5000/analyze-answers", {
        questions,
        answers,
        language,
      });
      setFeedbacks(res.data.feedbacks);
      setFinished(true);
    } catch (err) {
      console.error(err);
      alert("Failed to get feedback. Check backend.");
    }
  };

  if (finished)
    return (
      <div>
        <h2>✅ Interview Completed!</h2>
        {feedbacks.map((fb, i) => (
          <div key={i} style={{ margin: "10px 0", textAlign: "left" }}>
            <b>Q{i + 1}:</b> {questions[i]} <br />
            <b>Answer:</b> {answers[i]} <br />
            <b>Feedback & Score:</b> {fb}
            <hr />
          </div>
        ))}
      </div>
    );

  if (index >= questions.length)
    return (
      <div>
        <h2>All questions answered.</h2>
        <button onClick={finishInterview}>Get Feedback & Score</button>
      </div>
    );

  return (
    <h2>
      Question {index + 1} of {questions.length}: {questions[index]}
    </h2>
  );
}
