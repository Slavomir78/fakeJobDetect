import { useEffect, useState } from "react";

const verdictConfig = {
  LIKELY_LEGITIMATE: {
    label: "Likely Legitimate",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
    glow: "0 0 30px rgba(16,185,129,0.15)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  SUSPICIOUS: {
    label: "Suspicious",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    glow: "0 0 30px rgba(245,158,11,0.15)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  LIKELY_FAKE: {
    label: "Likely Fake",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    glow: "0 0 30px rgba(239,68,68,0.15)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
};

export function RiskGauge({ score, verdict, confidence }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = verdictConfig[verdict];

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const gaugeColor = score < 35 ? "#10b981" : score < 65 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: "14px",
      padding: "20px",
      boxShadow: config.glow,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
        <div style={{
          width: "52px", height: "52px",
          background: `${config.color}18`,
          border: `1px solid ${config.color}40`,
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {config.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "20px", fontWeight: "800", color: config.color, letterSpacing: "-0.3px" }}>
            {config.label}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "3px", fontFamily: "'Space Mono', monospace" }}>
            Risk: <span style={{ color: "#e6edf3", fontWeight: "700" }}>{score}/100</span>
            {" · "}
            Confidence: <span style={{ color: "#e6edf3", fontWeight: "700" }}>{confidence}%</span>
          </div>
        </div>
        <div style={{
          fontSize: "32px", fontWeight: "800",
          color: config.color,
          fontFamily: "'Space Mono', monospace",
          lineHeight: 1,
        }}>
          {score}
        </div>
      </div>

      <div style={{ background: "#0d1117", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${animatedScore}%`,
          background: `linear-gradient(90deg, ${gaugeColor}99, ${gaugeColor})`,
          borderRadius: "99px",
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 10px ${gaugeColor}60`,
        }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        <span style={{ fontSize: "10px", color: "#10b981", fontFamily: "'Space Mono', monospace" }}>Safe</span>
        <span style={{ fontSize: "10px", color: "#f59e0b", fontFamily: "'Space Mono', monospace" }}>Suspicious</span>
        <span style={{ fontSize: "10px", color: "#ef4444", fontFamily: "'Space Mono', monospace" }}>Fake</span>
      </div>
    </div>
  );
}
