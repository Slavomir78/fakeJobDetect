import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function VerdictBadge({ verdict, score }) {
  const cfg = verdict === "LIKELY_FAKE"
    ? { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", label: "Likely Fake" }
    : verdict === "SUSPICIOUS"
    ? { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", label: "Suspicious" }
    : { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", label: "Legitimate" };
  return (
    <span style={{
      fontSize: "11px", fontWeight: "700", padding: "3px 10px",
      borderRadius: "99px", background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color, fontFamily: "'Space Mono', monospace",
    }}>{cfg.label} · {score}%</span>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("jobshield_history") || "[]");
    setHistory(h);
  }, []);

  const clearAll = () => {
    if (confirm("Clear all history?")) {
      localStorage.removeItem("jobshield_history");
      setHistory([]);
    }
  };

  const deleteOne = (id) => {
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem("jobshield_history", JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 32px", minHeight: "calc(100vh - 60px)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#e6edf3", letterSpacing: "-0.4px" }}>Scan History</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px", fontFamily: "'Space Mono', monospace" }}>
            {history.length} scan{history.length !== 1 ? "s" : ""} stored locally
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {history.length > 0 && (
            <button onClick={clearAll} style={{
              padding: "8px 16px", borderRadius: "8px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444", fontSize: "12px", fontWeight: "700",
              cursor: "pointer", fontFamily: "'Space Mono', monospace",
            }}>Clear All</button>
          )}
          <button onClick={() => navigate("/")} style={{
            padding: "8px 16px", borderRadius: "8px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none",
            color: "#fff", fontSize: "12px", fontWeight: "700",
            cursor: "pointer", fontFamily: "'Syne', sans-serif",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            New Scan
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "400px", border: "1px dashed #1e2330", borderRadius: "16px",
          background: "rgba(13,17,23,0.5)", textAlign: "center", padding: "48px",
        }}>
          <div style={{
            width: "70px", height: "70px", background: "#0d1117", border: "1px solid #1e2330",
            borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2d3142" strokeWidth="1.5">
              <path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><polyline points="12 7 12 12 15 15"/>
            </svg>
          </div>
          <p style={{ fontSize: "15px", color: "#374151", fontWeight: "600" }}>No history yet</p>
          <p style={{ fontSize: "12px", color: "#1f2937", marginTop: "6px" }}>Scanned jobs will appear here automatically</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {history.map((item) => {
            const isOpen = expanded === item.id;
            const accentColor = item.verdict === "LIKELY_FAKE" ? "#ef4444" : item.verdict === "SUSPICIOUS" ? "#f59e0b" : "#10b981";
            return (
              <div key={item.id} style={{
                background: "rgba(13,17,23,0.9)", border: `1px solid ${isOpen ? accentColor + "22" : "#1e2330"}`,
                borderRadius: "12px", overflow: "hidden",
                transition: "border-color 0.2s",
              }}>
                {/* Row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr auto auto auto",
                    alignItems: "center", gap: "16px",
                    padding: "16px 20px", cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#e6edf3" }}>
                        {item.jobTitle || "Untitled Role"}
                      </span>
                      {item.company && (
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>@ {item.company}</span>
                      )}
                    </div>
                    <div style={{ fontSize: "11px", color: "#374151", marginTop: "3px", fontFamily: "'Space Mono', monospace" }}>
                      {new Date(item.scannedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <VerdictBadge verdict={item.verdict} score={item.riskScore} />
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteOne(item.id); }}
                    style={{
                      padding: "5px 8px", borderRadius: "6px", border: "1px solid #1e2330",
                      background: "transparent", color: "#4b5563", cursor: "pointer", fontSize: "11px",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${accentColor}18`, padding: "18px 20px", background: "rgba(0,0,0,0.2)" }}>
                    <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.7", marginBottom: "14px" }}>
                      {item.summary}
                    </p>
                    {item.redFlags?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {item.redFlags.map((f, i) => (
                          <span key={i} style={{
                            fontSize: "11px", padding: "3px 10px", borderRadius: "99px",
                            background: f.severity === "high" ? "rgba(239,68,68,0.1)" : f.severity === "medium" ? "rgba(245,158,11,0.1)" : "rgba(107,114,128,0.1)",
                            color: f.severity === "high" ? "#ef4444" : f.severity === "medium" ? "#f59e0b" : "#6b7280",
                            border: `1px solid ${f.severity === "high" ? "rgba(239,68,68,0.2)" : f.severity === "medium" ? "rgba(245,158,11,0.2)" : "rgba(107,114,128,0.2)"}`,
                            fontFamily: "'Space Mono', monospace",
                          }}>
                            {f.flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
