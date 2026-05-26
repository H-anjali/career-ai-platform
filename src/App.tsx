// @ts-nocheck
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import MockInterview from "./components/MockInterview";
import SkillGap from "./components/SkillGap";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/skillgap" element={<SkillGap />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
