import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ label, value, sub, color = "#6366f1" }) {
  return (
    <div style={{
      background: "rgba(13,17,23,0.9)", border: "1px solid #1e2330",
      borderRadius: "14px", padding: "22px 24px",
    }}>
      <div style={{ fontSize: "11px", color: "#4b5563", fontFamily: "'Space Mono', monospace", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
        {label}
      </div>
      <div style={{ fontSize: "36px", fontWeight: "800", color, letterSpacing: "-1px", fontFamily: "'Syne', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
            <div style={{
              width: "100%",
              height: `${Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0)}%`,
              background: color || "linear-gradient(180deg,#6366f1,#4f46e5)",
              borderRadius: "4px 4px 0 0",
              transition: "height 0.6s ease",
              minHeight: d.value > 0 ? "4px" : "0",
            }} />
          </div>
          <span style={{ fontSize: "10px", color: "#4b5563", fontFamily: "'Space Mono', monospace", textAlign: "center" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Stats() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("jobshield_history") || "[]");
    setHistory(h);
  }, []);

  const total = history.length;
  const fake = history.filter((h) => h.verdict === "LIKELY_FAKE").length;
  const suspicious = history.filter((h) => h.verdict === "SUSPICIOUS").length;
  const legit = history.filter((h) => h.verdict === "LIKELY_LEGITIMATE").length;
  const avgScore = total ? Math.round(history.reduce((s, h) => s + h.riskScore, 0) / total) : 0;
  const fakeRate = total ? Math.round((fake / total) * 100) : 0;

  // Red flags frequency
  const flagCounts = {};
  history.forEach((h) => {
    (h.redFlags || []).forEach((f) => {
      flagCounts[f.flag] = (flagCounts[f.flag] || 0) + 1;
    });
  });
  const topFlags = Object.entries(flagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([flag, count]) => ({ label: flag.slice(0, 14) + (flag.length > 14 ? "…" : ""), fullLabel: flag, value: count }));

  // Last 7 scans by day
  const last7 = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const count = history.filter((h) => new Date(h.scannedAt).toDateString() === key).length;
      days.push({ label: d.toLocaleDateString("en", { weekday: "short" }), value: count });
    }
    return days;
  })();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 32px", minHeight: "calc(100vh - 60px)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#e6edf3", letterSpacing: "-0.4px" }}>Stats Dashboard</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px", fontFamily: "'Space Mono', monospace" }}>
            Based on {total} total scans
          </p>
        </div>
        {total === 0 && (
          <button onClick={() => navigate("/")} style={{
            padding: "9px 18px", borderRadius: "8px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none",
            color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Syne', sans-serif",
          }}>Start Scanning</button>
        )}
      </div>

      {total === 0 ? (
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
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <p style={{ fontSize: "15px", color: "#374151", fontWeight: "600" }}>No data yet</p>
          <p style={{ fontSize: "12px", color: "#1f2937", marginTop: "6px" }}>Scan some jobs first to see your stats</p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", marginBottom: "22px" }}>
            <StatCard label="Total Scans" value={total} sub="All time" color="#6366f1" />
            <StatCard label="Fake Detected" value={fake} sub={`${fakeRate}% of total`} color="#ef4444" />
            <StatCard label="Suspicious" value={suspicious} sub="Needs review" color="#f59e0b" />
            <StatCard label="Legitimate" value={legit} sub="Passed checks" color="#10b981" />
            <StatCard label="Avg Risk Score" value={`${avgScore}%`} sub="Across all scans" color={avgScore > 60 ? "#ef4444" : avgScore > 35 ? "#f59e0b" : "#10b981"} />
          </div>

          {/* Charts row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "22px" }}>
            {/* Verdict donut */}
            <div style={{ background: "rgba(13,17,23,0.9)", border: "1px solid #1e2330", borderRadius: "14px", padding: "22px 24px" }}>
              <div style={{ fontSize: "11px", color: "#4b5563", fontFamily: "'Space Mono', monospace", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "18px" }}>
                Verdict Breakdown
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <svg width="120" height="120" viewBox="0 0 42 42">
                  {(() => {
                    const segments = [
                      { value: fake, color: "#ef4444" },
                      { value: suspicious, color: "#f59e0b" },
                      { value: legit, color: "#10b981" },
                    ];
                    let offset = 25;
                    return segments.map((seg, i) => {
                      const pct = (seg.value / total) * 100;
                      const el = (
                        <circle key={i} cx="21" cy="21" r="15.9155" fill="transparent"
                          stroke={seg.color} strokeWidth="4"
                          strokeDasharray={`${pct} ${100 - pct}`}
                          strokeDashoffset={offset}
                          style={{ transition: "stroke-dasharray 0.8s ease" }}
                        />
                      );
                      offset -= pct;
                      return el;
                    });
                  })()}
                  <circle cx="21" cy="21" r="13" fill="#0d1117" />
                  <text x="21" y="22" textAnchor="middle" fill="#e6edf3" fontSize="5" fontWeight="bold" fontFamily="Syne">{total}</text>
                  <text x="21" y="27" textAnchor="middle" fill="#4b5563" fontSize="3" fontFamily="Space Mono">scans</text>
                </svg>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { label: "Legitimate", value: legit, color: "#10b981" },
                    { label: "Suspicious", value: suspicious, color: "#f59e0b" },
                    { label: "Likely Fake", value: fake, color: "#ef4444" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: "#9ca3af", flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: item.color, fontFamily: "'Space Mono', monospace" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity */}
            <div style={{ background: "rgba(13,17,23,0.9)", border: "1px solid #1e2330", borderRadius: "14px", padding: "22px 24px" }}>
              <div style={{ fontSize: "11px", color: "#4b5563", fontFamily: "'Space Mono', monospace", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "18px" }}>
                Scans — Last 7 Days
              </div>
              <BarChart data={last7} color="linear-gradient(180deg,#6366f1,#4338ca)" />
            </div>
          </div>

          {/* Top red flags */}
          {topFlags.length > 0 && (
            <div style={{ background: "rgba(13,17,23,0.9)", border: "1px solid #1e2330", borderRadius: "14px", padding: "22px 24px" }}>
              <div style={{ fontSize: "11px", color: "#4b5563", fontFamily: "'Space Mono', monospace", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "18px" }}>
                Most Common Red Flags
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {topFlags.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "11px", color: "#374151", fontFamily: "'Space Mono', monospace", minWidth: "16px" }}>#{i + 1}</span>
                    <span style={{ fontSize: "13px", color: "#9ca3af", flex: 1 }}>{f.fullLabel}</span>
                    <div style={{ width: "140px", background: "#0d1117", borderRadius: "99px", height: "5px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${(f.value / (topFlags[0]?.value || 1)) * 100}%`,
                        background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: "99px",
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#6366f1", fontFamily: "'Space Mono', monospace", minWidth: "24px", textAlign: "right" }}>
                      {f.value}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
