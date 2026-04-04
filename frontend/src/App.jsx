import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Compare from "./pages/Compare";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#060810", fontFamily: "'Syne', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#060810;color:#e6edf3}
          ::-webkit-scrollbar{width:6px}
          ::-webkit-scrollbar-track{background:#0d1117}
          ::-webkit-scrollbar-thumb{background:#21262d;border-radius:99px}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
          @keyframes scanMove{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
          .fade-up{animation:fadeUp 0.4s ease forwards}
          .scan-line{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#6366f1,transparent);animation:scanMove 3s ease-in-out infinite}
        `}</style>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
// ```

// ---

// ## Your clean final structure:
// ```
// src/
// ├── components/
// │   ├── ui/              ← delete button.tsx inside, can delete folder too
// │   ├── AnalysisDetails.jsx  ✓
// │   ├── JobInputForm.jsx     ✓
// │   ├── Navbar.jsx           ✓
// │   ├── RedFlagsList.jsx     ✓
// │   └── RiskGauge.jsx        ✓
// ├── lib/
// │   └── api.js               ✓
// ├── pages/
// │   ├── Compare.jsx          ✓
// │   ├── History.jsx          ✓
// │   ├── Index.jsx            ✓
// │   └── Stats.jsx            ✓
// ├── App.jsx                  ✓ (update routes)
// ├── main.jsx                 ✓
// ├── index.css                ✓
// └── App.css                  ← delete