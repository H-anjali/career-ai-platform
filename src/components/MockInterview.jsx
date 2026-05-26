import { useState } from "react";
import { askGemini } from "../utils/gemini";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile Developer",
  "Data Scientist",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const TYPES = ["Technical", "HR", "Mixed"];
const TOTAL_QUESTIONS = 5;

function LoadingSpinner({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
      <p className="text-blue-400 font-semibold">{text}</p>
      <p className="text-gray-500 text-sm">Gemini AI is thinking…</p>
    </div>
  );
}

function ScoreBadge({ score }) {
  const numScore = Number(score) || 0;
  const color =
    numScore >= 8 ? "text-green-400 bg-green-500/10 border-green-500/30"
    : numScore >= 5 ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
    : "text-red-400 bg-red-500/10 border-red-500/30";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${color}`}>
      {numScore}/10
    </span>
  );
}

function OverallScoreCircle({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const maxScore = 10;
  const progress = ((maxScore - score) / maxScore) * circumference;
  const color = score >= 8 ? "#22c55e" : score >= 5 ? "#eab308" : "#ef4444";
  const label = score >= 8 ? "Excellent" : score >= 5 ? "Good" : "Needs Practice";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{score.toFixed(1)}</span>
          <span className="text-xs text-gray-400">/ 10</span>
        </div>
      </div>
      <span className="text-sm font-bold px-3 py-1 rounded-full"
        style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
        {label}
      </span>
    </div>
  );
}

function AccordionItem({ question, evaluation, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden print:border-gray-300 print:mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-gray-990 bg-gray-900 hover:bg-gray-800/60 transition-colors text-left print:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm font-medium print:text-black">Q{index + 1}</span>
          <span className="text-white text-sm font-medium line-clamp-1 print:text-black print:line-clamp-none">{question}</span>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0 print:hidden">
          <ScoreBadge score={evaluation.score} />
          <span className="text-gray-400 text-lg">{open ? "▲" : "▼"}</span>
        </div>
        <div className="hidden print:block font-bold">
          Score: {evaluation.score}/10
        </div>
      </button>

      <div className={`${open ? "block" : "hidden"} p-5 bg-gray-900/50 border-t border-gray-800 space-y-4 print:block print:bg-white print:border-gray-300`}>
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 print:text-gray-700">💬 AI Feedback</h4>
          <p className="text-gray-300 text-sm leading-relaxed print:text-black">{evaluation.feedback}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
          <div>
            <h4 className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2 print:text-green-800">✅ Correct Points</h4>
            <ul className="space-y-1">
              {evaluation.correct_points?.map((p, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2 print:text-black">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">•</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2 print:text-red-800">❌ Missing Points</h4>
            <ul className="space-y-1">
              {evaluation.missing_points?.map((p, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2 print:text-black">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>{p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 print:bg-gray-50 print:border-gray-200">
          <h4 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2 print:text-blue-800">⭐ Improved Answer</h4>
          <p className="text-gray-300 text-sm leading-relaxed print:text-black">{evaluation.improved_answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function MockInterview() {
  const [step, setStep] = useState("setup"); 
  const [config, setConfig] = useState({
    role: "Frontend Developer",
    difficulty: "Intermediate",
    type: "Technical",
  });

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [error, setError] = useState("");

  const startInterview = async () => {
    setStep("loading");
    setError("");
    try {
      const prompt = `Generate exactly 5 ${config.type} interview questions for a ${config.role} position at ${config.difficulty} level. Return ONLY a valid JSON string array with NO markdown, no backticks, and no explaining text. Follow this format: ["Q1?", "Q2?", "Q3?", "Q4?", "Q5?"]`;

      const responseText = await askGemini(prompt);
      
      let parsed;
      try {
        const cleaned = responseText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/^[^\[]*/, "") 
          .replace(/[^\]]*$/, "")  
          .trim();
        parsed = JSON.parse(cleaned);
      } catch (jsonErr) {
        console.error("Failed array parse. Raw response:", responseText);
        throw new Error("AI output formatting mismatch. Please try starting again.");
      }

      if (!Array.isArray(parsed) || parsed.length < 5) {
        throw new Error("AI returned an incomplete list of questions. Please try again.");
      }

      setQuestions(parsed.slice(0, TOTAL_QUESTIONS));
      setCurrentQ(0);
      setAnswers([]);
      setEvaluations([]);
      setCurrentAnswer("");
      setStep("interview");
    } catch (err) {
      setError(err.message || "Failed to generate questions. Please try again.");
      setStep("setup");
    }
  };

  const saveInterviewSessionToDashboard = (finalEvaluations) => {
    const finalScore = finalEvaluations.reduce((sum, e) => sum + (Number(e.score) || 0), 0) / finalEvaluations.length;
    
    // 1. Persist Session Summary inside History logs
    const historicalRecords = localStorage.getItem("careerai_interview_history");
    let history = [];
    if (historicalRecords) {
      try { history = JSON.parse(historicalRecords); } catch (e) { history = []; }
    }
    const newSession = {
      role: config.role,
      score: Number(finalScore.toFixed(1)),
      type: config.type,
      date: "Just now"
    };
    localStorage.setItem("careerai_interview_history", JSON.stringify([newSession, ...history]));

    // 2. Dispatch Live Timeline Event Notification feed card
    const activityLog = localStorage.getItem("careerai_activity_log");
    let activities = [];
    if (activityLog) {
      try { activities = JSON.parse(activityLog); } catch (e) { activities = []; }
    }
    const newActivity = {
      icon: "🎤",
      title: "Mock Interview Completed",
      desc: `${config.role} — ${config.difficulty} — ${config.type} (Scored ${finalScore.toFixed(1)}/10)`,
      time: "Just now",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    };
    localStorage.setItem("careerai_activity_log", JSON.stringify([newActivity, ...activities]));
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    const answersCopy = [...answers, currentAnswer];
    setAnswers(answersCopy);
    setStep("evaluating");
    setError("");

    try {
      const prompt = `Evaluate this interview answer and return ONLY a valid JSON object with NO markdown, no backticks, and no conversational text.
      Target Object Format:
      {
        "score": 8,
        "feedback": "Your evaluation details here.",
        "correct_points": ["point1", "point2"],
        "missing_points": ["point1", "point2"],
        "improved_answer": "An exemplary response snippet."
      }
      Question context: ${questions[currentQ]}
      User Answer input: ${currentAnswer}`;

      const responseText = await askGemini(prompt);
      
      let evaluation;
      try {
        const cleaned = responseText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/^[^{]*/, "") 
          .replace(/[^}]*$/, "")  
          .trim();
        evaluation = JSON.parse(cleaned);
      } catch (jsonErr) {
        console.error("Failed object parse. Raw response:", responseText);
        throw new Error("AI evaluation formatting error. Repeating step...");
      }

      const newEvaluations = [...evaluations, evaluation];
      setEvaluations(newEvaluations);

      if (currentQ + 1 >= TOTAL_QUESTIONS) {
        saveInterviewSessionToDashboard(newEvaluations);
        setStep("results");
      } else {
        setCurrentQ(currentQ + 1);
        setCurrentAnswer("");
        setStep("interview");
      }
    } catch (err) {
      setError(err.message || "Failed to evaluate your answer. Returning to input question state.");
      setStep("interview");
    }
  };

  const retake = () => {
    setStep("setup");
    setQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setEvaluations([]);
    setCurrentAnswer("");
    setError("");
  };

  const handleExportPDF = () => {
    window.print();
  };

  const avgScore =
    evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + (Number(e.score) || 0), 0) / evaluations.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-950 py-12 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
        {/* Header */}
        <div className="text-center mb-10 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-3xl mb-4">
            🎤
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Mock Interview</h1>
          <p className="text-gray-400 text-lg">
            Practice with AI-generated questions and get instant scored feedback.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 print:hidden">
            <span className="text-red-400 text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* SETUP SCREEN */}
        {step === "setup" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              ⚙️ Configure Your Interview
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Target Role
                </label>
                <select
                  value={config.role}
                  onChange={(e) => setConfig({ ...config, role: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Difficulty
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setConfig({ ...config, difficulty: d })}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          config.difficulty === d
                            ? "bg-blue-600/20 border-blue-500 text-blue-400"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                        }`}
                      >
                        {d === "Beginner" ? "🌱" : d === "Intermediate" ? "🔥" : "💎"} {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setConfig({ ...config, type: t })}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          config.type === t
                            ? "bg-purple-600/20 border-purple-500 text-purple-400"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                        }`}
                      >
                        {t === "Technical" ? "💻" : t === "HR" ? "👤" : "🔀"} {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">
                  You'll answer <span className="text-white font-semibold">5 {config.type}</span> questions
                  for a <span className="text-white font-semibold">{config.role}</span> role at{" "}
                  <span className="text-white font-semibold">{config.difficulty}</span> level.
                  Each answer will be scored out of 10.
                </p>
              </div>

              <button
                onClick={startInterview}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 text-lg"
              >
                🚀 Start Interview
              </button>
            </div>
          </div>
        )}

        {/* LOADING — generating questions */}
        {step === "loading" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl print:hidden">
            <LoadingSpinner text="Generating interview questions…" />
          </div>
        )}

        {/* INTERVIEW SCREEN */}
        {step === "interview" && questions.length > 0 && (
          <div className="fade-in-up space-y-6 print:hidden">
            {/* Progress */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎤</span>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                      {config.role} · {config.difficulty} · {config.type}
                    </p>
                    <p className="text-white font-bold">
                      Question {currentQ + 1} of {TOTAL_QUESTIONS}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-blue-400">{currentQ + 1}</span>
                  <span className="text-gray-500">/{TOTAL_QUESTIONS}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${(currentQ / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>

              {/* Question dots */}
              <div className="flex gap-2 mt-3">
                {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      i < currentQ
                        ? "bg-green-500"
                        : i === currentQ
                        ? "bg-blue-500"
                        : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                  Q
                </div>
                <p className="text-white text-lg font-medium leading-relaxed">
                  {questions[currentQ]}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Answer
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here… Be as detailed as possible. Mention specific examples, technologies, or approaches you'd use."
                  rows={7}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm leading-relaxed placeholder-gray-600"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600 text-xs">
                    {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <span className="text-gray-600 text-xs">Press Submit when ready</span>
                </div>
              </div>

              <button
                onClick={submitAnswer}
                disabled={!currentAnswer.trim()}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {currentQ + 1 === TOTAL_QUESTIONS ? "🏁 Submit Final Answer" : "Submit Answer →"}
              </button>
            </div>
          </div>
        )}

        {/* EVALUATING */}
        {step === "evaluating" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl print:hidden">
            <LoadingSpinner text={`Evaluating answer ${currentQ + 1}/${TOTAL_QUESTIONS}…`} />
          </div>
        )}

        {/* RESULTS SCREEN */}
        {step === "results" && (
          <div className="space-y-6 fade-in-up print:text-black">
            {/* Print Only Header */}
            <div className="hidden print:block text-center border-b pb-4 mb-6">
              <h1 className="text-3xl font-bold">CareerAI Interview Evaluation Transcript</h1>
              <p className="text-sm text-gray-600">{config.role} &bull; {config.type} Assessment Session</p>
            </div>

            {/* Overall Score */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center print:bg-white print:border-gray-300 print:p-4">
              <h2 className="text-2xl font-bold text-white mb-6 print:text-black print:mb-2">🏆 Interview Complete!</h2>
              <OverallScoreCircle score={parseFloat(avgScore.toFixed(1))} />
              <div className="mt-6 grid grid-cols-3 gap-4 print:hidden">
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-2xl font-black text-blue-400">{TOTAL_QUESTIONS}</p>
                  <p className="text-gray-400 text-xs mt-1">Questions</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-2xl font-black text-green-400">
                    {evaluations.filter((e) => (Number(e.score) || 0) >= 7).length}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Good Answers</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-2xl font-black text-purple-400">{config.difficulty}</p>
                  <p className="text-gray-400 text-xs mt-1">Level</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400 print:text-gray-700">
                Difficulty Level: <span className="text-white font-medium print:text-black">{config.difficulty}</span>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black">
                💡 Performance Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-2">
                {evaluations.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3 print:bg-gray-50 print:border">
                    <span className="text-gray-400 text-sm print:text-black">Question {i + 1}</span>
                    <span className="print:hidden"><ScoreBadge score={ev.score} /></span>
                    <span className="hidden print:block font-bold">Score: {ev.score}/10</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-Question Accordion Breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-none print:p-0">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black print:border-b print:pb-2">
                📋 Detailed Breakdown <span className="text-gray-500 text-sm font-normal ml-1 print:hidden">(click to expand)</span>
              </h3>
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <AccordionItem
                    key={i}
                    question={q}
                    evaluation={evaluations[i] || {}}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Actions Footer Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button
                onClick={retake}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
              >
                🔄 Retake Interview
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                📥 Export Session PDF
              </button>
              <button
                onClick={() => {
                  setConfig({ ...config, difficulty: "Advanced" });
                  retake();
                  setTimeout(startInterview, 100);
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                ⬆️ Try Harder Level
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}