# 🎯 CareerAI — Your AI-Powered Career Coach

> A complete AI-powered career preparation web application built with React, Vite, and Tailwind CSS — fully driven by Google Gemini 2.5 Flash.

---

## 📸 Screenshots

| Home | Resume Analyzer | Mock Interview |
|------|----------------|----------------|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

| Skill Gap Finder | Dashboard |
|-----------------|-----------|
| *(screenshot)* | *(screenshot)* |

---

## ✨ Features

### 📄 Resume Analyzer
- Upload any PDF resume in the browser (no server required)[cite: 1]
- Extracts text using `pdfjs-dist` entirely client-side[cite: 1]
- Calls Gemini 2.5 Flash to perform a full, structured ATS analysis
- Returns an **ATS compatibility score (0–100)** with a color-coded circular progress ring[cite: 1]
- Identifies **weak sections**, **missing skills**, and **strong sections**[cite: 1]
- Provides **formatting improvement recommendations** as a numbered list[cite: 1]
- **Export Report PDF:** Download a perfectly styled hard copy of your resume evaluation instantly using native client-side print parameters.
- Drag-and-drop or click-to-upload interface[cite: 1]

### 🎤 Mock Interview
- Configure your target **role** (8 options), **difficulty** (Beginner / Intermediate / Advanced), and **type** (Technical / HR / Mixed)[cite: 1]
- Generates 5 tailored interview questions via Gemini AI[cite: 1]
- User types answers in a large textarea[cite: 1]
- Each answer is scored **/10** with specific, context-aware AI feedback[cite: 1]
- Shows **correct points**, **missing points**, and a **model improved answer**[cite: 1]
- **Export Session PDF:** Instantly generate a printable assessment transcript breakdown including all text questions, your typed responses, and specific AI feedback.
- Final results screen with **overall score**, per-question accordion breakdown, and **Retake** button[cite: 1]

### 🧠 Skill Gap Finder
- Enter your **target role** (12 common roles available), **current skills** (comma-separated), and **experience level**[cite: 1]
- Gemini AI calculates a **match percentage** shown as an animated circular ring[cite: 1]
- Side-by-side comparison: **Skills You Have** (green) vs **Skills to Learn** (red)[cite: 1]
- Full list of **all required skills** for the role with match indicators[cite: 1]
- **8-week visual learning roadmap** with weekly focus areas and explicit learning tasks[cite: 1]
- **3 project ideas** tailored to build for your portfolio to close the gap[cite: 1]
- **Export Roadmap PDF:** Carry your custom weekly action timeline with you offline with an integrated print layout wrapper.
- **Estimated time to job-readiness** banner[cite: 1]

### 📊 Dashboard
- **Dynamic LocalState Persistence:** Completely connected via native browser `localStorage` hooks. Your real resume tracking results, matching alignment ratios, and multi-session mock interview logs dynamically update and persist over page refreshes.
- **Welcome banner** with active streak counter[cite: 1]
- **4 stats cards**: Resume Score, Interviews Completed, Average Interview Score, Skill Gap Closed[cite: 1]
- **Skill proficiency bars** with CSS progress visualization[cite: 1]
- **Interview history** with automatic average scoring logs[cite: 1]
- **Recent activity** timeline linked directly to your feature use actions[cite: 1]
- **Weak topics focus cards** with mini progress bars[cite: 1]
- **Tip of the Day** (randomly selected from a curated list)[cite: 1]
- **Next Actions** priority list with automated urgency markers[cite: 1]
- **Weekly Goals** progress tracker synced directly to your live performance[cite: 1]

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with optimized rendering engines[cite: 1] |
| **Vite 7** | Build tool, fast-refresh modules, and dev server[cite: 1] |
| **Tailwind CSS v4** | Next-generation utility-first styling compile[cite: 1] |
| **React Router DOM v7** | Seamless client-side viewport navigation transitions[cite: 1] |
| **pdfjs-dist** | Sandboxed text token parsing from file binary data stream[cite: 1] |
| **Gemini 2.5 Flash API** | Optimized raw REST JSON response analysis & generation |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20+ installed
- A free [Google Gemini API key](https://aistudio.google.com/app/apikey)[cite: 1]

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/careerai.git](https://github.com/your-username/careerai.git)
cd careerai

```

### 2. Install dependencies

```bash
npm install

```

### 3. Add your Gemini API key

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here

```

> ⚠️ **Never commit your `.env` file!** It's already in `.gitignore`.
> 
> 

Get your free API key at: https://aistudio.google.com/app/apikey

### 4. Start the development server

```bash
npm run dev

```

Open [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build

```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky navigation with active route highlighting
│   ├── ResumeAnalyzer.jsx  # PDF upload + ATS extraction + Export PDF Utility
│   ├── MockInterview.jsx   # 5-question interview flow + Live Scoring + Export Transcript
│   ├── SkillGap.jsx        # Skill gap analysis + 8-week roadmap + Export Roadmap
│   └── Dashboard.jsx       # Analytics dashboard reading live localStorage state entries
├── pages/
│   └── Home.jsx            # Clean landing page hero component with feature callouts
├── utils/
│   ├── gemini.js           # Reusable askGemini() routing to stable production v1 models
│   └── cn.ts               # Tailwinds merge helper class utility
├── App.tsx                 # React Router viewport container setups
├── main.tsx                # App entry point initialization
└── index.css               # Tailwinds custom directives layer configurations

```

---

## 🔑 Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `VITE_GEMINI_API_KEY` | Your Google Gemini 2.5 Flash API key | ✅ Yes |

---

## 🎨 Design System

* **Theme**: Dark mode throughout


* **Background**: `bg-gray-950` (page), `bg-gray-900` (cards)


* **Accent**: Blue — `text-blue-400`, `bg-blue-600`, `border-blue-500`

* **Typography**: Inter font, white headings, `text-gray-400` body


* **Cards**: `rounded-2xl` with `border border-gray-800`

* **Interactions**: Smooth `hover:-translate-y-1` transitions, glow effects



---

## 🌐 API & JSON Safety Ingestion

The application interacts with the stable production endpoint via a direct raw REST interface channel:

```
POST [https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=API_KEY](https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=API_KEY)

```

All requests are executed fully client-side directly from the browser context.

To ensure absolute system stability, all analysis modules implement string parsing sanitization blocks. Before payloads are processed by `JSON.parse()`, an array of regex boundaries isolates the object—preventing runtime crashes from accidental markdown code fences (```json) or text explanations returned by the AI:

```javascript
const cleaned = responseText
  .replace(/```json/gi, "") // Strips structural markdown tags
  .replace(/```/g, "")
  .replace(/^[^{]*/, "")   // Discards preceding descriptive loops
  .replace(/[^}]*$/, "")   // Discards trailing explanations
  .trim();

```

---

## ⚠️ Known Limitations

* PDF text extraction is optimized for native textual document layers and will not process flat scanned images.


* API key is bundled into client-side asset code (acceptable for educational or personal use environments; implement a reverse proxy layout for commercial production scale).



---

## 👥 Contributors

| Name | Role |
| --- | --- |
| *(Your Name)* | Lead Developer

 |

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

```

```