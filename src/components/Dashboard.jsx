import { useState, useEffect } from "react";

const fallbackRecentActivity = [
  {
    icon: "📄",
    title: "Resume Analyzed",
    desc: "Your resume scored 78/100 on ATS compatibility",
    time: "2 hours ago",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: "🎤",
    title: "Mock Interview Completed",
    desc: "Frontend Developer — Intermediate — Technical",
    time: "Yesterday, 4:30 PM",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: "🧠",
    title: "Skill Gap Analysis",
    desc: "Analyzed gap for Full Stack Developer role",
    time: "2 days ago",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
];

const weakTopics = [
  {
    topic: "System Design",
    score: 35,
    icon: "🏗️",
    suggestion: "Practice designing scalable systems like URL shorteners, Twitter feeds.",
    color: "from-red-500/10 to-red-600/5 border-red-500/20",
    badge: "text-red-400 bg-red-500/10 border-red-500/30",
  },
  {
    topic: "Data Structures & Algorithms",
    score: 48,
    icon: "🧩",
    suggestion: "Focus on trees, graphs, and dynamic programming problems daily.",
    color: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
    badge: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  },
  {
    topic: "TypeScript",
    score: 52,
    icon: "💙",
    suggestion: "Build 2 projects using TypeScript to solidify generics and type inference.",
    color: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
    badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  },
  {
    topic: "Database Design",
    score: 60,
    icon: "🗃️",
    suggestion: "Practice normalization, indexing strategies, and SQL query optimization.",
    color: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
    badge: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
];

const skillProgress = [
  { name: "JavaScript", level: 80, color: "bg-yellow-500" },
  { name: "React", level: 72, color: "bg-blue-500" },
  { name: "CSS/Tailwind", level: 85, color: "bg-cyan-500" },
  { name: "Node.js", level: 55, color: "bg-green-500" },
  { name: "TypeScript", level: 40, color: "bg-blue-400" },
  { name: "SQL", level: 60, color: "bg-orange-500" },
];

const fallbackInterviewHistory = [
  { role: "Frontend Dev", score: 7.8, type: "Technical", date: "Yesterday" },
  { role: "Backend Dev", score: 6.4, type: "HR", date: "3 days ago" },
];

const tips = [
  "🌟 Practice one LeetCode problem daily — consistency beats intensity!",
  "💡 Tailor your resume keywords to match each job description you apply for.",
  "🎯 Prepare 3-5 strong STAR method stories for behavioral interviews.",
  "📚 Read one tech blog article daily to stay current with industry trends.",
  "🤝 Reach out to 2-3 professionals on LinkedIn this week for informational interviews.",
];

function StatCard({ icon, label, value, sub, color, trend }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden hover:border-gray-700 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className={`text-3xl font-black ${color}`}>{value}</p>
          {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
          <span>↑</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tipIndex] = useState(() => Math.floor(Math.random() * tips.length));
  
  // State management values driven dynamically from local storage hooks
  const [resumeScore, setResumeScore] = useState(78);
  const [interviews, setInterviews] = useState(fallbackInterviewHistory);
  const [activities, setActivities] = useState(fallbackRecentActivity);
  const [skillGapMatch, setSkillGapMatch] = useState(65);

  useEffect(() => {
    // 1. Fetch Dynamic Resume Score Tracking
    const storedResume = localStorage.getItem("careerai_resume_result");
    if (storedResume) {
      try {
        const parsedResume = JSON.parse(storedResume);
        if (parsedResume.ats_score) {
          setResumeScore(parsedResume.ats_score);
        }
      } catch (e) {
        console.error("Error reading resume metric:", e);
      }
    }

    // 2. Fetch Dynamic Interview Session Log
    const storedInterviews = localStorage.getItem("careerai_interview_history");
    if (storedInterviews) {
      try {
        setInterviews(JSON.parse(storedInterviews));
      } catch (e) {
        console.error("Error reading interview history:", e);
      }
    }

    // 3. Fetch Dynamic Global Activity Timeline feeds
    const storedActivities = localStorage.getItem("careerai_activity_log");
    if (storedActivities) {
      try {
        setActivities(JSON.parse(storedActivities));
      } catch (e) {
        console.error("Error reading activity registry:", e);
      }
    }

    // 4. Fetch Dynamic Skill Alignment Percentage Values
    const storedSkillGap = localStorage.getItem("careerai_skillgap_result");
    if (storedSkillGap) {
      try {
        const parsedGap = JSON.parse(storedSkillGap);
        if (parsedGap.match_percentage) {
          setSkillGapMatch(parsedGap.match_percentage);
        }
      } catch (e) {
        console.error("Error reading skillgap state details:", e);
      }
    }
  }, []);

  // Compute runtime running math variations safely across arrays
  const totalInterviewCount = interviews.length;
  const avgInterviewScore = totalInterviewCount > 0
    ? (interviews.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / totalInterviewCount).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">
                Welcome back, Student 👋
              </h1>
              <p className="text-gray-400">
                You're making great progress! Keep up the momentum — your dream job is closer than you think.
              </p>
            </div>
            <div className="flex-shrink-0 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl px-5 py-3 text-center">
              <p className="text-gray-400 text-xs font-medium">Active Streak</p>
              <p className="text-3xl font-black text-orange-400">7 🔥</p>
              <p className="text-gray-500 text-xs">days</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="📄"
            label="Resume Score"
            value={resumeScore}
            sub="/ 100 ATS Score"
            color="text-blue-400"
            trend={resumeScore > 75 ? "Maintained excellent score" : "Target 85+ for high pass chance"}
          />
          <StatCard
            icon="🎤"
            label="Interviews"
            value={totalInterviewCount}
            sub="Mock interviews done"
            color="text-purple-400"
            trend={`${totalInterviewCount} recorded total`}
          />
          <StatCard
            icon="⭐"
            label="Avg Score"
            value={avgInterviewScore}
            sub="/ 10 per interview"
            color="text-yellow-400"
            trend="Target 8.0+ for job-readiness"
          />
          <StatCard
            icon="📈"
            label="Gap Closed"
            value={`${skillGapMatch}%`}
            sub="Skill gap filled"
            color="text-emerald-400"
            trend="Synchronized from target role alignment"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Skill Progress */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              📊 Skill Proficiency
              <span className="ml-auto text-xs text-gray-500 font-normal">Self + AI assessed</span>
            </h2>
            <div className="space-y-5">
              {skillProgress.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                    <span className="text-gray-400 text-sm">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview History */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              🎤 Interview History
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {interviews.map((item, i) => {
                const scoreColor =
                  item.score >= 8 ? "text-green-400" : item.score >= 6 ? "text-yellow-400" : "text-red-400";
                const scoreBg =
                  item.score >= 8 ? "bg-green-500/10 border-green-500/30" : item.score >= 6 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30";
                return (
                  <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-white text-sm font-medium truncate">{item.role}</p>
                      <p className="text-gray-500 text-xs truncate">{item.type} &bull; {item.date || "Completed"}</p>
                    </div>
                    <span className={`text-sm font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${scoreColor} ${scoreBg}`}>
                      {Number(item.score).toFixed(1)}/10
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-gray-800/30 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs text-center">
                Average across performance logs:{" "}
                <span className="text-yellow-400 font-bold">{avgInterviewScore}/10</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              🕐 Recent Activity
            </h2>
            <div className="space-y-3">
              {activities.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-800/40 transition-colors">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${item.color || "text-blue-400 bg-blue-500/10 border-blue-500/20"}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{item.desc}</p>
                  </div>
                  <span className="text-gray-600 text-xs flex-shrink-0">{item.time || "Recent"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip of the Day */}
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                💡 Tip of the Day
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm">{tips[tipIndex]}</p>
              <div className="mt-4 text-xs text-gray-500">Updated daily &bull; AI Curated</div>
            </div>

            {/* Next Action */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                🎯 Next Actions
              </h2>
              <div className="space-y-2">
                {[
                  { icon: "📄", text: "Re-analyze resume with new skills", urgent: true },
                  { icon: "🎤", text: "Complete more mock interviews", urgent: false },
                  { icon: "🧠", text: "Revisit skill gap after learning frameworks", urgent: false },
                ].map((action, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-lg flex-shrink-0">{action.icon}</span>
                    <span className={action.urgent ? "text-white" : "text-gray-400"}>
                      {action.text}
                    </span>
                    {action.urgent && (
                      <span className="ml-auto text-xs bg-orange-500/10 border border-orange-500/30 text-orange-400 px-2 py-0.5 rounded-full flex-shrink-0">
                        Priority
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            ⚠️ Focus Areas — Topics to Improve
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {weakTopics.map((topic) => (
              <div
                key={topic.topic}
                className={`bg-gradient-to-br ${topic.color} border rounded-xl p-5 hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{topic.icon}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${topic.badge}`}>
                    {topic.score}%
                  </span>
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{topic.topic}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{topic.suggestion}</p>

                {/* Progress bar */}
                <div className="mt-3 w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      topic.score >= 60 ? "bg-blue-500" : topic.score >= 45 ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            🏆 Weekly Goals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { goal: "Resume Score", target: "85+", current: resumeScore, max: 100, icon: "📄", color: "bg-blue-500" },
              { goal: "Mock Interviews", target: "5 total", current: totalInterviewCount > 5 ? 5 : totalInterviewCount, max: 5, icon: "🎤", color: "bg-purple-500" },
              { goal: "Skills Learned", target: "3 new skills", current: 2, max: 3, icon: "🧠", color: "bg-emerald-500" },
            ].map((goal) => (
              <div key={goal.goal} className="bg-gray-800/40 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{goal.goal}</p>
                      <p className="text-gray-500 text-xs">Target: {goal.target}</p>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {goal.current}/{goal.max}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${goal.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(goal.current / goal.max) * 100}%` }}
                  />
                </div>
                <p className="text-right text-xs text-gray-500 mt-1">
                  {Math.round((goal.current / goal.max) * 100)}% complete
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}