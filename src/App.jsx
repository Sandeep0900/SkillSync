import React, { useState, useEffect } from "react";

// ResultCard Component with Modal
function ResultCard({ index, feedback, question, answer }) {
  const [showModal, setShowModal] = useState(false);
  
  // Extract score from feedback (assuming format like "Score: 8/10" or similar)
  const extractScore = (text) => {
    const match = text.match(/(\d+)\/(\d+)/);
    if (match) return `${match[1]}/${match[2]}`;
    return "N/A";
  };

  const score = extractScore(feedback);

  return (
    <>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-3 shadow-sm hover:shadow-md transition-all border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Question {index + 1}</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {score}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-6 py-2 hover:from-purple-600 hover:to-pink-600 transition-all font-semibold shadow-md hover:shadow-lg"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Question {index + 1} Feedback</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <p className="text-sm font-semibold text-purple-600 mb-2">❓ QUESTION</p>
                <p className="text-gray-800">{question}</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <p className="text-sm font-semibold text-blue-600 mb-2">💬 YOUR ANSWER</p>
                <p className="text-gray-800">{answer || "No answer provided"}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                <p className="text-sm font-semibold text-green-600 mb-2">📊 FEEDBACK</p>
                <p className="text-gray-800 whitespace-pre-line">{feedback}</p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-3 font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
              >
                Got it! ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Main App Component
function App() {
  const API_BASE = "https://skillsync-backend-cbiz.onrender.com";
  
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interviewActive, setInterviewActive] = useState(false);
  const [recording, setRecording] = useState(false);

  const generateQuestions = async () => {
    if (!topic) {
      alert("Please enter a topic first! 🎯");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setAnswers([]);
    setFeedbacks([]);
    setCurrentIndex(0);

    try {
      const res = await fetch(`${API_BASE}/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language }),
      });
      const data = await res.json();
      setQuestions(data.questions);
      setAnswers(Array(data.questions.length).fill(""));
      setInterviewActive(true);
    } catch (err) {
      console.error(err);
      alert("Error generating questions! 😢");
    }
    setLoading(false);
  };

  const speakQuestion = (text, callback) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "Hindi" ? "hi-IN" : "en-US";
    utterance.onend = () => callback();
    synth.speak(utterance);
  };

  const recordAnswer = (index) => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    setRecording(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === "Hindi" ? "hi-IN" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[index] = text;
        return newAnswers;
      });
    };

    recognition.onerror = () => {
      console.error("Speech recognition error");
    };

    recognition.onend = () => {
      setRecording(false);
      if (index + 1 < questions.length) {
        setTimeout(() => {
          setCurrentIndex(index + 1);
        }, 1000);
      } else {
        analyzeAnswers();
      }
    };
  };

  useEffect(() => {
    if (interviewActive && questions.length > 0 && currentIndex < questions.length) {
      const question = questions[currentIndex];
      speakQuestion(question, () => recordAnswer(currentIndex));
    }
  }, [currentIndex, interviewActive, questions]);

  const analyzeAnswers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyze-answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers, language }),
      });
      const data = await res.json();
      setFeedbacks(data.feedbacks);
      setInterviewActive(false);
    } catch (err) {
      console.error(err);
      alert("Error analyzing answers! 😢");
    }
    setLoading(false);
  };

  const resetInterview = () => {
    setTopic("");
    setLanguage("English");
    setQuestions([]);
    setAnswers([]);
    setFeedbacks([]);
    setCurrentIndex(0);
    setInterviewActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            AI Interview
          </h1>
          <p className="text-gray-600 text-lg">Level up your skills with AI-powered practice 🚀</p>
        </div>

        {/* Start Screen */}
        {!interviewActive && feedbacks.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What topic do you want to practice? 🎯
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, Python, Machine Learning..."
                  className="w-full border-2 border-purple-200 p-4 rounded-2xl focus:outline-none focus:border-purple-500 transition-all text-lg"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose your language 🌍
                </label>
                <select
                  className="w-full border-2 border-purple-200 p-4 rounded-2xl focus:outline-none focus:border-purple-500 transition-all text-lg cursor-pointer"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              
              <button
                onClick={generateQuestions}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-5 hover:from-purple-600 hover:to-pink-600 transition-all font-bold text-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "✨ Generating Questions..." : "🚀 Start Interview"}
              </button>
            </div>
          </div>
        )}

        {/* Interview Screen */}
        {interviewActive && currentIndex < questions.length && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-purple-600">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < currentIndex
                          ? "bg-green-500"
                          : i === currentIndex
                          ? "bg-purple-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {questions[currentIndex]}
                </p>
                
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${recording ? "bg-red-500 animate-pulse" : "bg-blue-500 animate-pulse"}`} />
                  <p className="text-lg font-semibold text-gray-700">
                    {recording ? "🎙 Listening to your answer..." : "🔊 Reading question..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {feedbacks.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Interview Complete! 🎉
              </h2>
              <p className="text-gray-600 mb-6">Here's how you did on each question:</p>
              
              <div className="space-y-3">
                {feedbacks.map((feedback, i) => (
                  <ResultCard
                    key={i}
                    index={i}
                    feedback={feedback}
                    question={questions[i]}
                    answer={answers[i]}
                  />
                ))}
              </div>

              <button
                onClick={resetInterview}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 hover:from-blue-600 hover:to-purple-600 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
              >
                🔄 Start New Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;