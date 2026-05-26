import { NavLink, Link } from "react-router-dom";

const navLinks = [
  { to: "/resume", label: "Resume" },
  { to: "/interview", label: "Interview" },
  { to: "/skillgap", label: "Skill Gap" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <span className="text-2xl">🎯</span>
            <span>CareerAI</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
