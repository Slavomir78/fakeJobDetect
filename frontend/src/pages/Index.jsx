import { useState } from "react";
import { JobInputForm } from "../components/JobInputForm";
import { RiskGauge } from "../components/RiskGauge";
import { RedFlagsList } from "../components/RedFlagsList";
import { AnalysisDetails } from "../components/AnalysisDetails";
import { analyzeJob } from "../lib/api";

function getRiskGradient(score, verdict) {
  if (!verdict) return "radial-gradient(ellipse at 50% 0%, #0f1729 0%, #060810 60%)";
  if (verdict === "LIKELY_LEGITIMATE") {
    const intensity = Math.max(0.08, (100 - score) / 100 * 0.22);
    return `radial-gradient(ellipse at 50% 0%, rgba(16,185,129,${intensity}) 0%, #060810 60%)`;
  }
  if (verdict === "SUSPICIOUS") {
    const intensity = Math.max(0.08, score / 100 * 0.2);
    return `radial-gradient(ellipse at 50% 0%, rgba(245,158,11,${intensity}) 0%, #060810 60%)`;
  }
  if (verdict === "LIKELY_FAKE") {
    const intensity = Math.max(0.1, score / 100 * 0.28);
    return `radial-gradient(ellipse at 50% 0%, rgba(239,68,68,${intensity}) 0%, #060810 60%)`;
  }
  return "radial-gradient(ellipse at 50% 0%, #0f1729 0%, #060810 60%)";
}

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (data) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const analysis = await analyzeJob(data);
      setResult(analysis);
    } catch (e) {
      setError(e.message || "Failed to analyze job posting");
    } finally {
      setIsLoading(false);
    }
  };

  const verdict = result?.verdict;
  const score = result?.riskScore ?? 0;

  const accentColor = verdict === "LIKELY_FAKE" ? "#ef4444"
    : verdict === "SUSPICIOUS" ? "#f59e0b"
    : verdict === "LIKELY_LEGITIMATE" ? "#10b981"
    : "#6366f1";

  const statusLabel = verdict === "LIKELY_FAKE" ? "High Risk Detected"
    : verdict === "SUSPICIOUS" ? "Suspicious Activity"
    : verdict === "LIKELY_LEGITIMATE" ? "Looks Legitimate"
    : "Ready to Scan";

  return (
    <div style={{
      minHeight: "100vh",
      background: getRiskGradient(score, verdict),
      color: "#e6edf3",
      fontFamily: "'Syne', sans-serif",
      transition: "background 1.8s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#060810}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes scanMove{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
        .result-enter{animation:fadeUp 0.5s ease forwards}
        .scan-line{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#6366f1,transparent);animation:scanMove 3s ease-in-out infinite}
      `}</style>

      {/* Bottom ambient glow based on risk */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: verdict ? (
          verdict === "LIKELY_FAKE"
            ? `radial-gradient(ellipse 80% 35% at 50% 100%, rgba(239,68,68,${score / 500}) 0%, transparent 70%)`
            : verdict === "SUSPICIOUS"
            ? `radial-gradient(ellipse 80% 35% at 50% 100%, rgba(245,158,11,${score / 600}) 0%, transparent 70%)`
            : `radial-gradient(ellipse 80% 35% at 50% 100%, rgba(16,185,129,${(100 - score) / 500}) 0%, transparent 70%)`
        ) : "none",
        transition: "background 1.8s ease",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header style={{
          borderBottom: `1px solid ${verdict ? `${accentColor}25` : "#21262d"}`,
          background: "rgba(6,8,16,0.75)",
          backdropFilter: "blur(16px)",
          position: "sticky", top: 0, zIndex: 10,
          transition: "border-color 1.8s ease",
        }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "17px", fontWeight: "800", letterSpacing: "-0.3px" }}>JobShield</div>
                <div style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'Space Mono', monospace", marginTop: "1px" }}>AI-Powered Fake Job Detector</div>
              </div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "11px", color: accentColor,
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
              padding: "5px 12px", borderRadius: "99px",
              fontFamily: "'Space Mono', monospace", fontWeight: "700",
              transition: "all 1.8s ease",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block", animation: "pulse 2s infinite" }} />
              {statusLabel}
            </div>
          </div>
        </header>

        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <div style={{
              width: "72px", height: "72px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              position: "relative", overflow: "hidden",
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                <path d="M11 8v6M8 11h6"/>
              </svg>
              <div className="scan-line" />
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              Detect Fake Job Postings
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", marginTop: "10px", maxWidth: "520px", margin: "10px auto 0", lineHeight: 1.6 }}>
              Paste any job description — our AI scans for fraud signals, red flags, and deception patterns instantly
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "18px", flexWrap: "wrap" }}>
              {["NLP Analysis", "Risk Scoring", "Red Flag Detection", "Instant Report"].map((b) => (
                <span key={b} style={{
                  fontSize: "10px", fontWeight: "700", letterSpacing: "1px",
                  padding: "4px 12px", borderRadius: "99px",
                  background: "#0d1117", border: "1px solid #21262d",
                  color: "#6b7280", fontFamily: "'Space Mono', monospace",
                }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Global risk bar — appears after result */}
          {result && (
            <div className="result-enter" style={{
              marginBottom: "24px",
              background: "rgba(13,17,23,0.85)",
              border: `1px solid ${accentColor}25`,
              borderRadius: "12px", padding: "14px 20px",
              display: "flex", alignItems: "center", gap: "16px",
              transition: "border-color 1.8s ease",
            }}>
              <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>
                Fraud Risk
              </span>
              <div style={{ flex: 1, background: "#0d1117", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${score}%`,
                  background: verdict === "LIKELY_FAKE"
                    ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                    : verdict === "SUSPICIOUS"
                    ? "linear-gradient(90deg, #10b981, #f59e0b)"
                    : "linear-gradient(90deg, #059669, #10b981)",
                  borderRadius: "99px",
                  transition: "width 1.4s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: `0 0 10px ${accentColor}60`,
                }} />
              </div>
              <span style={{
                fontSize: "13px", fontWeight: "800", color: accentColor,
                fontFamily: "'Space Mono', monospace", minWidth: "40px", textAlign: "right",
                transition: "color 1.8s ease",
              }}>
                {score}%
              </span>
            </div>
          )}

          {/* Main grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{
              background: "rgba(13,17,23,0.85)",
              border: "1px solid #21262d",
              borderRadius: "16px", padding: "24px",
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#6b7280", fontFamily: "'Space Mono', monospace" }}>
                  Job Posting Input
                </span>
              </div>
              <JobInputForm onSubmit={handleAnalyze} isLoading={isLoading} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {!result && !isLoading && !error && (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  minHeight: "300px", border: "1px dashed #21262d", borderRadius: "16px",
                  background: "rgba(13,17,23,0.4)", textAlign: "center", padding: "40px",
                }}>
                  <div style={{
                    width: "64px", height: "64px", background: "#0d1117", border: "1px solid #21262d",
                    borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px",
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: "14px", color: "#4b5563", fontWeight: "600" }}>Results will appear here</p>
                  <p style={{ fontSize: "12px", color: "#374151", marginTop: "4px" }}>Paste a job description and click analyze</p>
                </div>
              )}

              {isLoading && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "16px", minHeight: "300px",
                  justifyContent: "center", border: "1px solid #21262d", borderRadius: "16px",
                  background: "rgba(13,17,23,0.85)", padding: "40px",
                }}>
                  <div style={{
                    width: "40px", height: "40px", border: "3px solid #21262d",
                    borderTop: "3px solid #6366f1", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite", flexShrink: 0,
                    boxShadow: "0 0 16px rgba(99,102,241,0.3)",
                  }} />
                  <div>
                    <p style={{ fontSize: "14px", color: "#9ca3af", fontWeight: "600" }}>Analyzing job posting...</p>
                    <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px", fontFamily: "'Space Mono', monospace" }}>Running NLP fraud detection</p>
                  </div>
                </div>
              )}

              {error && (
                <div style={{
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "12px", padding: "16px", color: "#ef4444", fontSize: "13px",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {result && (
                <div className="result-enter" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <RiskGauge score={score} verdict={verdict} confidence={result.confidence} />
                  <RedFlagsList flags={result.redFlags} />
                  <AnalysisDetails
                    summary={result.summary}
                    positiveSignals={result.positiveSignals}
                    recommendations={result.recommendations}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        <footer style={{
          borderTop: "1px solid #21262d", padding: "20px", textAlign: "center",
          fontSize: "11px", color: "#4b5563", fontFamily: "'Space Mono', monospace",
        }}>
          <span style={{ color: "#6366f1" }}>JobShield</span> · AI-powered NLP analysis · Results are advisory — always verify independently
        </footer>
      </div>
    </div>
  );
}
