import { useState } from "react";
import { askGemini } from "../utils/gemini";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "DevOps Engineer",
  "Mobile Developer (React Native)",
  "Machine Learning Engineer",
  "Cloud Architect",
  "UI/UX Designer",
  "Product Manager",
  "Cybersecurity Analyst",
];

const EXPERIENCE_LEVELS = [
  { value: "Student", label: "🎓 Student", desc: "Currently studying" },
  { value: "Fresher", label: "🌱 Fresher", desc: "0-6 months" },
  { value: "1-2 years", label: "💼 1-2 Years", desc: "Junior level" },
  { value: "3-5 years", label: "🚀 3-5 Years", desc: "Mid level" },
];

function LoadingSpinner({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-emerald-500 rounded-full animate-spin" />
        <div
          className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-emerald-400/50 rounded-full animate-spin"
          style={{ animationDuration: "0.6s" }}
        />
      </div>
      <div className="text-center">
        <p className="text-emerald-400 font-semibold text-lg">{text}</p>
        <p className="text-gray-500 text-sm mt-1">Gemini AI is analyzing your profile…</p>
      </div>
    </div>
  );
}

function MatchRing({ percentage }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - percentage) / 100) * circumference;
  const color =
    percentage >= 75 ? "#22c55e" : percentage >= 50 ? "#eab308" : "#ef4444";
  const label =
    percentage >= 75 ? "Great Match" : percentage >= 50 ? "Moderate Match" : "Large Gap";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={radius} fill="none" stroke="#1f2937" strokeWidth="12" />
          <circle
            cx="65" cy="65" r={radius} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{percentage}%</span>
          <span className="text-xs text-gray-400 font-medium">Match</span>
        </div>
      </div>
      <span
        className="text-sm font-bold px-4 py-1.5 rounded-full"
        style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      >
        {label}
      </span>
    </div>
  );
}

const weekColors = [
  "from-blue-500/20 to-blue-600/10 border-blue-500/30 print:from-white print:to-white print:border-gray-300",
  "from-purple-500/20 to-purple-600/10 border-purple-500/30 print:from-white print:to-white print:border-gray-300",
  "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 print:from-white print:to-white print:border-gray-300",
  "from-orange-500/20 to-orange-600/10 border-orange-500/30 print:from-white print:to-white print:border-gray-300",
];

const projectIcons = ["🛠️", "🌐", "📱", "🤖", "📊", "🔐"];

export default function SkillGap() {
  const [form, setForm] = useState({
    role: "Frontend Developer",
    skills: "",
    experience: "Student",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateDashboardMetrics = (gapData) => {
    // 1. Persist core alignment metrics mapping values
    localStorage.setItem("careerai_skillgap_result", JSON.stringify(gapData));

    // 2. Append live timeline action log notification cards
    const activityLog = localStorage.getItem("careerai_activity_log");
    let logs = [];
    if (activityLog) {
      try { logs = JSON.parse(activityLog); } catch (e) { logs = []; }
    }

    const newEntry = {
      icon: "🧠",
      title: "Skill Gap Analysis",
      desc: `Analyzed gap for ${form.role} role (${gapData.match_percentage}% Match)`,
      time: "Just now",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };

    localStorage.setItem("careerai_activity_log", JSON.stringify([newEntry, ...logs]));
  };

  const analyzeGap = async () => {
    if (!form.skills.trim()) {
      setError("Please enter your current skills.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const prompt = `You are a professional technical career advisor. Analyze the skill gap comprehensively and return ONLY a valid JSON object with NO markdown code fences, backticks, or explanation.
      
      Ensure you accurately categorize common technology variations and output clean values matching this exact schema layout structure:
{
  "match_percentage": 60,
  "required_skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "skills_you_have": ["skill1", "skill2"],
  "skills_to_learn": ["skill3", "skill4", "skill5"],
  "roadmap": [
    { "week": "Week 1-2", "focus": "Topic area focus detail", "tasks": ["task1", "task2", "task3"] },
    { "week": "Week 3-4", "focus": "Topic area focus detail", "tasks": ["task1", "task2", "task3"] },
    { "week": "Week 5-6", "focus": "Topic area focus detail", "tasks": ["task1", "task2", "task3"] },
    { "week": "Week 7-8", "focus": "Topic area focus detail", "tasks": ["task1", "task2", "task3"] }
  ],
  "projects_to_build": ["Detailed actionable project proposal description 1", "Detailed actionable project proposal description 2", "Detailed actionable project proposal description 3"],
  "estimated_ready_in": "2 Months"
}
Target Role: ${form.role}
Current Skills: ${form.skills}
Experience Profile Level: ${form.experience}`;

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
        console.error("Failed skill gap parse. Raw response:", responseText);
        throw new Error("AI returned an unexpected format layout. Please try again.");
      }

      setResult(parsed);
      updateDashboardMetrics(parsed);
    } catch (err) {
      setError(err.message || "Failed to analyze skill gap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
        {/* Header */}
        <div className="text-center mb-12 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-3xl mb-4">
            🧠
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Skill Gap Finder</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover exactly which skills you need for your dream role and get a personalized 8-week roadmap.
          </p>
        </div>

        {/* Form */}
        {!result && !loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🎯 Tell Us About Yourself
            </h2>

            <div className="space-y-6">
              {/* Target Role */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Target Role <span className="text-emerald-400">*</span>
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Current Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Current Skills <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g., HTML, CSS, JavaScript basics, Python, Git, Excel, Figma…"
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors resize-none text-sm placeholder-gray-600"
                />
                <p className="text-gray-600 text-xs mt-1">
                  Separate skills with commas. Be specific — include tools, languages, and frameworks.
                </p>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Experience Level <span className="text-emerald-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setForm({ ...form, experience: lvl.value })}
                      className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                        form.experience === lvl.value
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                      }`}
                    >
                      <div className="font-medium text-sm">{lvl.label}</div>
                      <div className="text-xs mt-0.5 opacity-70">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={analyzeGap}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 text-lg"
              >
                🔍 Analyze My Skill Gap
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl print:hidden">
            <LoadingSpinner text="Analyzing your skill gap…" />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6 fade-in-up print:text-black">
            {/* Print Only Header Row Layout styling rules */}
            <div className="hidden print:block text-center border-b pb-4 mb-6">
              <h1 className="text-3xl font-bold">CareerAI Professional Competency & Skills Roadmap</h1>
              <p className="text-sm text-gray-600">Dynamic Industry Blueprint Alignment Report</p>
            </div>

            {/* Match Score + Skills Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 print:bg-white print:border-gray-300 print:p-4">
              <div className="flex flex-col lg:flex-row items-center gap-8 print:flex-row print:gap-4">
                <MatchRing percentage={result.match_percentage} />
                <div className="flex-1 text-center lg:text-left print:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2 print:text-black">
                    Skill Match for <span className="text-emerald-400 print:text-emerald-600">{form.role}</span>
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 print:text-gray-700">
                    Based on your <span className="text-white font-semibold print:text-black">{form.experience}</span> experience level.
                    You match <span className="text-emerald-400 font-bold print:text-emerald-600">{result.match_percentage}%</span> of the required skills.
                  </p>

                  {/* Estimated Ready */}
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2 print:bg-gray-100 print:border-transparent">
                    <span className="text-2xl print:hidden">⏱️</span>
                    <div>
                      <p className="text-gray-400 text-xs print:text-gray-600">Estimated Ready In</p>
                      <p className="text-blue-400 font-bold print:text-blue-600">{result.estimated_ready_in}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
              {/* Skills You Have */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black">
                  <span>✅</span> Skills You Have
                  <span className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full print:border-gray-300 print:text-black">
                    {result.skills_you_have?.length || 0} skills
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills_you_have?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-full font-medium print:bg-gray-100 print:text-black print:border-transparent"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills to Learn */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black">
                  <span>📚</span> Skills to Learn
                  <span className="ml-auto text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full print:border-gray-300 print:text-black">
                    {result.skills_to_learn?.length || 0} skills
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills_to_learn?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-full font-medium print:bg-gray-100 print:text-black print:border-transparent"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 print:text-black">
                <span>🏆</span> All Required Skills for {form.role}
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.required_skills?.map((skill, i) => {
                  const have = result.skills_you_have?.some(
                    (s) => s.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <span
                      key={i}
                      className={`px-3 py-1.5 text-sm rounded-full font-medium border ${
                        have
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 print:bg-green-50 print:text-green-700"
                          : "bg-gray-800 border-gray-700 text-gray-400 print:bg-gray-50 print:text-gray-400"
                      }`}
                    >
                      {have ? "✓" : "○"} {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 8-Week Roadmap */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2 print:text-black print:border-b print:pb-2">
                <span>🗺️</span> Your 8-Week Learning Roadmap
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-1">
                {result.roadmap?.map((week, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-br ${weekColors[i % weekColors.length]} border rounded-xl p-5 print:page-break-inside-avoid`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-black text-white opacity-30 print:text-gray-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-xs text-gray-400 font-medium print:text-gray-600">{week.week}</p>
                        <p className="text-white font-bold print:text-black">{week.focus}</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {week.tasks?.map((task, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-300 print:text-gray-800">
                          <span className="text-blue-400 flex-shrink-0 mt-0.5 print:text-blue-600">▸</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects to Build */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 print:bg-white print:border-gray-300">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2 print:text-black print:border-b print:pb-2">
                <span>🏗️</span> Projects to Build
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-1">
                {result.projects_to_build?.map((project, i) => (
                  <div
                    key={i}
                    className="bg-gray-800/60 border border-gray-700 hover:border-emerald-500/40 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 print:bg-white print:border-none print:p-0 print:mb-4"
                  >
                    <div className="text-3xl mb-3 print:hidden">{projectIcons[i % projectIcons.length]}</div>
                    <p className="text-white font-medium text-sm leading-relaxed print:text-gray-800">
                      <span className="hidden print:inline font-bold mr-1">Project {i + 1}:</span>
                      {project}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Ready Banner */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center print:bg-gray-50 print:border-gray-300">
              <div className="text-4xl mb-3 print:hidden">🎯</div>
              <h3 className="text-white font-bold text-xl mb-2 print:text-black">
                You could be job-ready in <span className="text-emerald-400 print:text-emerald-600">{result.estimated_ready_in}</span>
              </h3>
              <div className="text-gray-400 text-sm print:text-gray-700">
                Follow the 8-week roadmap above, build the suggested projects, and you'll be ready to apply for <span className="text-white font-medium print:text-black">{form.role}</span> positions.
              </div>
            </div>

            {/* Actions Bar Controls */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button
                onClick={() => { setResult(null); setError(""); }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                🔄 Analyze Another Role
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                📥 Export Roadmap PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}