import { Link } from "react-router-dom";

const features = [
  {
    icon: "📄",
    title: "Resume Analyzer",
    description:
      "Upload your PDF resume and get an instant ATS score, identify weak sections, missing skills, and actionable formatting improvements powered by AI.",
    to: "/resume",
    color: "from-blue-500/10 to-blue-600/5",
    border: "hover:border-blue-500/60",
    badge: "AI Powered",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    icon: "🎤",
    title: "Mock Interview",
    description:
      "Practice with AI-generated interview questions tailored to your target role, difficulty, and type. Get scored feedback and model answers instantly.",
    to: "/interview",
    color: "from-purple-500/10 to-purple-600/5",
    border: "hover:border-purple-500/60",
    badge: "Interactive",
    badgeColor: "bg-purple-500/20 text-purple-400",
  },
  {
    icon: "🧠",
    title: "Skill Gap Finder",
    description:
      "Discover exactly which skills you're missing for your dream role. Get a personalized 8-week learning roadmap and project ideas to build your portfolio.",
    to: "/skillgap",
    color: "from-emerald-500/10 to-emerald-600/5",
    border: "hover:border-emerald-500/60",
    badge: "Personalized",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
  },
  {
    icon: "📊",
    title: "Dashboard",
    description:
      "Track your career preparation progress at a glance. View your resume score, interview history, skill gaps closed, and personalized improvement tips.",
    to: "/dashboard",
    color: "from-orange-500/10 to-orange-600/5",
    border: "hover:border-orange-500/60",
    badge: "Analytics",
    badgeColor: "bg-orange-500/20 text-orange-400",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Upload or Input",
    desc: "Upload your resume or enter your current skills and target role.",
    icon: "📤",
  },
  {
    step: "02",
    title: "AI Analysis",
    desc: "Our Gemini AI engine analyzes your profile against industry standards.",
    icon: "⚡",
  },
  {
    step: "03",
    title: "Get Insights",
    desc: "Receive detailed feedback, scores, and a personalized action plan.",
    icon: "💡",
  },
  {
    step: "04",
    title: "Land the Job",
    desc: "Apply improvements, practice interviews, and ace your next application.",
    icon: "🚀",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-400 font-medium mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse inline-block"></span>
            Powered by Gemini AI
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Your{" "}
            <span className="gradient-text">AI Career Coach</span>
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl text-gray-300 font-bold">
              — Always Ready for You
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Analyze your resume, practice mock interviews, discover skill gaps, and track
            your progress — all powered by cutting-edge AI. Land your dream job faster
            than ever before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 text-lg"
            >
              <span>📄</span> Analyze My Resume
            </Link>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:-translate-y-0.5 text-lg"
            >
              <span>🎤</span> Start Mock Interview
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">✅ No signup required</span>
            <span className="flex items-center gap-1.5">✅ Free to use</span>
            <span className="flex items-center gap-1.5">✅ Instant AI feedback</span>
            <span className="flex items-center gap-1.5">✅ Privacy-first</span>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Four powerful AI tools working together to accelerate your career journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              className={`group relative bg-gray-900 border border-gray-800 ${feature.border} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl card-hover overflow-hidden`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{feature.icon}</div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>

                {/* CTA */}
                <div className="mt-6 flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 gap-1 transition-all duration-200">
                  Get Started
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Four simple steps to transform your career trajectory.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                {idx < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
                )}

                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gray-900 border border-gray-700 rounded-2xl text-3xl mb-4 mx-auto">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full text-xs text-white font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl" />
          <div className="relative z-10">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who've already transformed their career prospects
              with CareerAI. Start for free — no account needed.
            </p>
            <Link
              to="/skillgap"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 text-lg"
            >
              🧠 Find My Skill Gap
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-white font-semibold">CareerAI</span>
            — AI-Powered Career Preparation Platform. Built with ❤️ using React + Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}