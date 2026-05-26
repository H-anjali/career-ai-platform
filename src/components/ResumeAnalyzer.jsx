import { useState, useRef } from "react";
import { askGemini } from "../utils/gemini";
import * as pdfjsLib from "pdfjs-dist";

// Use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

function CircularScore({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  const color =
    score >= 75
      ? "#22c55e"
      : score >= 50
      ? "#eab308"
      : "#ef4444";

  const label =
    score >= 75 ? "Excellent" : score >= 50 ? "Average" : "Needs Work";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{score}</span>
          <span className="text-xs text-gray-400 font-medium">/ 100</span>
        </div>
      </div>
      <span
        className="text-sm font-bold px-3 py-1 rounded-full"
        style={{
          color,
          backgroundColor: `${color}20`,
          border: `1px solid ${color}40`,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function LoadingSpinner({ text = "Processing..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-blue-400/50 rounded-full animate-spin" style={{ animationDuration: "0.6s" }} />
      </div>
      <div className="text-center">
        <p className="text-blue-400 font-semibold text-lg">{text}</p>
        <p className="text-gray-500 text-sm mt-1">This may take a few seconds…</p>
      </div>
    </div>
  );
}

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    fullText += strings.join(" ") + "\n";
  }
  return fullText.trim();
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const printAreaRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResult(null);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  };

  const handleExportPDF = () => {
    if (!result) return;
    window.print();
  };

  const updateDashboardMetrics = (scoreData) => {
    // Save target core analysis metric object
    localStorage.setItem("careerai_resume_result", JSON.stringify(scoreData));

    // Append a live activity tracking feed to recent logs
    const activityLog = localStorage.getItem("careerai_activity_log");
    let logs = [];
    if (activityLog) {
      try { logs = JSON.parse(activityLog); } catch (e) { logs = []; }
    }
    
    const newEntry = {
      icon: "📄",
      title: "Resume Analyzed",
      desc: `Your resume scored ${scoreData.ats_score}/100 on ATS compatibility`,
      time: "Just now",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    };

    localStorage.setItem("careerai_activity_log", JSON.stringify([newEntry, ...logs]));
  };

  const analyzeResume = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const resumeText = await extractTextFromPDF(file);

      if (!resumeText || resumeText.length < 50) {
        throw new Error("Could not extract text from PDF. The file may be image-based or corrupted.");
      }

      const prompt = `You are an expert ATS resume analyzer. Analyze this resume and return ONLY a valid JSON object. Do not include markdown formatting, backticks (\`\`\`), or the word "json". Return a raw JSON structure matching this schema:

{
  "ats_score": 75,
  "overall_feedback": "text summary goes here",
  "weak_sections": ["section1", "section2"],
  "missing_skills": ["skill1", "skill2"],
  "formatting_improvements": ["improvement1", "improvement2"],
  "strong_sections": ["section1", "section2"]
}

Resume Text to analyze:
${resumeText}`;

      const responseText = await askGemini(prompt);

      let parsed;
      try {
        const cleaned = responseText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/^[^{]*/, "") 
          .replace(/[^}]*$/, "")  
          .trim();
        parsed = JSON.parse(cleaned);
      } catch (jsonErr) {
        console.error("Raw response received:", responseText);
        throw new Error("AI returned an unexpected format. Please try again.");
      }

      setResult(parsed);
      updateDashboardMetrics(parsed);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
        {/* Header */}
        <div className="text-center mb-12 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-3xl mb-4">
            📄
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Resume Analyzer</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload your PDF resume and get an instant ATS score with detailed feedback powered by Gemini AI.
          </p>
        </div>

        {/* Upload Area */}
        {!loading && !result && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 print:hidden">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-blue-500 bg-blue-500/5"
                  : file
                  ? "border-green-500/60 bg-green-500/5"
                  : "border-gray-700 hover:border-blue-500/60 hover:bg-blue-500/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-5xl">✅</span>
                  <div>
                    <p className="text-white font-semibold text-lg">{file.name}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {(file.size / 1024).toFixed(1)} KB — Click to change
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-5xl">📤</span>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Supports PDF files only · Max 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <span className="text-red-400 text-xl">⚠️</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={analyzeResume}
                disabled={!file}
                className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {file ? "🔍 Analyze Resume" : "Select a PDF to start"}
              </button>
              {file && (
                <button
                  onClick={() => { setFile(null); setResult(null); setError(""); }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Tips */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "⚡", title: "Instant Results", desc: "AI analysis in under 30 seconds" },
                { icon: "🎯", title: "ATS Score", desc: "Know your resume's pass rate" },
                { icon: "🔒", title: "Private", desc: "Data never stored or shared" },
              ].map((tip) => (
                <div key={tip.title} className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <span className="text-2xl">{tip.icon}</span>
                  <p className="text-white font-medium text-sm mt-2">{tip.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl print:hidden">
            <LoadingSpinner text="Analyzing your resume..." />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div ref={printAreaRef} className="space-y-6 fade-in-up print:text-black">
            {/* Print Header styling block visibility rule */}
            <div className="hidden print:block text-center border-b pb-4 mb-6">
              <h1 className="text-3xl font-bold">CareerAI Resume Evaluation Report</h1>
              <p className="text-sm text-gray-600">Generated dynamically using Gemini AI Intelligence</p>
            </div>

            {/* Score Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 print:bg-white print:border-gray-300 print:p-4">
              <div className="flex flex-col lg:flex-row items-center gap-8 print:flex-row print:gap-4">
                <CircularScore score={result.ats_score} />
                <div className="flex-1 text-center lg:text-left print:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2 print:text-black">ATS Compatibility Score</h2>
                  <p className="text-gray-400 leading-relaxed print:text-gray-700">{result.overall_feedback}</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start print:justify-start">
                    <span className="text-xs px-3 py-1 bg-gray-800 rounded-full text-gray-400 print:bg-gray-200 print:text-gray-800">
                      📄 {file?.name || "Resume document"}
                    </span>
                    <span className="text-xs px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 print:bg-gray-100 print:text-blue-600 print:border-transparent">
                      ✨ AI Analyzed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
              {/* Strong Sections */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black">
                  <span className="print:hidden">💪</span> Strong Sections
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.strong_sections?.map((section, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-full font-medium print:bg-green-50 print:text-green-700 print:border-transparent"
                    >
                      ✓ {section}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weak Sections */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black">
                  <span className="print:hidden">⚠️</span> Weak Sections
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.weak_sections?.map((section, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-full font-medium print:bg-red-50 print:text-red-700 print:border-transparent"
                    >
                      ✗ {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black">
                <span className="print:hidden">🔧</span> Missing Skills
                <span className="ml-auto text-xs text-gray-500 font-normal print:text-gray-600">
                  Add these to strengthen your resume
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm rounded-full font-medium print:bg-orange-50 print:text-orange-700 print:border-transparent"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Formatting Improvements */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black">
                <span className="print:hidden">✏️</span> Formatting Improvements
              </h3>
              <ol className="space-y-3">
                {result.formatting_improvements?.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold print:bg-gray-200 print:text-black print:border-transparent">
                      {i + 1}
                    </span>
                    <p className="text-gray-300 text-sm leading-relaxed pt-0.5 print:text-gray-800">{improvement}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Item Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button
                onClick={() => { setResult(null); setFile(null); setError(""); }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                📄 Analyze Another Resume
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                📥 Export Report PDF
              </button>
              <button
                onClick={analyzeResume}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                🔄 Re-analyze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}