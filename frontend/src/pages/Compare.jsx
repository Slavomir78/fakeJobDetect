import { useState } from "react";
import { analyzeJob } from "../lib/api";

function MiniGauge({ score, verdict }) {
  const color = verdict === "LIKELY_FAKE" ? "#ef4444" : verdict === "SUSPICIOUS" ? "#f59e0b" : "#10b981";
  const label = verdict === "LIKELY_FAKE" ? "Likely Fake" : verdict === "SUSPICIOUS" ? "Suspicious" : "Legitimate";
  return (
    <div style={{
      background: `${color}10`, border: `1px solid ${color}28`,
      borderRadius: "12px", padding: "16px 20px", marginBottom: "14px",
      display: "flex", alignItems: "center", gap: "14px",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "18px", fontWeight: "800", color, letterSpacing: "-0.3px" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px", fontFamily: "'Space Mono', monospace" }}>
          Risk score: <span style={{ color: "#e6edf3", fontWeight: "700" }}>{score}/100</span>
        </div>
      </div>
      <div style={{ fontSize: "32px", fontWeight: "800", color, fontFamily: "'Space Mono', monospace" }}>{score}</div>
    </div>
  );
}

function InputPanel({ label, num, data, setData, result, isLoading, onAnalyze }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Input card */}
      <div style={{
        background: "rgba(13,17,23,0.9)", border: "1px solid #1e2330",
        borderRadius: "16px", padding: "22px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: num === 1 ? "rgba(99,102,241,0.2)" : "rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: num === 1 ? "#6366f1" : "#10b981", fontFamily: "'Space Mono', monospace" }}>{num}</span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#9ca3af" }}>{label}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
          {["jobTitle", "company"].map((field) => (
            <div key={field}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "#4b5563", marginBottom: "5px", fontFamily: "'Space Mono', monospace" }}>
                {field === "jobTitle" ? "Job Title" : "Company"}
              </label>
              <input
                type="text"
                value={data[field]}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                placeholder={field === "jobTitle" ? "e.g. Developer" : "e.g. Acme Inc"}
                style={{
                  width: "100%", background: "#0d1117", border: "1px solid #21262d",
                  borderRadius: "7px", padding: "8px 12px", color: "#e6edf3",
                  fontSize: "13px", outline: "none", fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                onBlur={(e) => e.target.style.borderColor = "#21262d"}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "#4b5563", marginBottom: "5px", fontFamily: "'Space Mono', monospace" }}>
            Job Description *
          </label>
          <textarea
            value={data.jobDescription}
            onChange={(e) => setData({ ...data, jobDescription: e.target.value })}
            placeholder="Paste job description here..."
            rows={6}
            style={{
              width: "100%", background: "#0d1117", border: "1px solid #21262d",
              borderRadius: "7px", padding: "10px 12px", color: "#e6edf3",
              fontSize: "13px", outline: "none", resize: "none", lineHeight: "1.6",
              fontFamily: "inherit",
            }}
            onFocus={(e) => e.target.style.borderColor = "#6366f1"}
            onBlur={(e) => e.target.style.borderColor = "#21262d"}
          />
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || data.jobDescription.trim().length < 20}
          style={{
            width: "100%", padding: "11px", borderRadius: "9px", border: "none",
            background: isLoading || data.jobDescription.trim().length < 20
              ? "#1f2937" : num === 1 ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#059669,#10b981)",
            color: isLoading || data.jobDescription.trim().length < 20 ? "#4b5563" : "#fff",
            fontSize: "13px", fontWeight: "700", cursor: isLoading || data.jobDescription.trim().length < 20 ? "not-allowed" : "pointer",
            fontFamily: "'Syne', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            transition: "all 0.2s",
          }}
        >
          {isLoading ? (
            <><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Analyzing...</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> Analyze Job {num}</>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
          <MiniGauge score={result.riskScore} verdict={result.verdict} />
          <div style={{ background: "rgba(13,17,23,0.9)", border: "1px solid #1e2330", borderRadius: "12px", padding: "16px" }}>
            <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.7", marginBottom: "12px" }}>{result.summary}</p>
            {result.redFlags?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {result.redFlags.slice(0, 4).map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0, background: f.severity === "high" ? "#ef4444" : f.severity === "medium" ? "#f59e0b" : "#6b7280" }} />
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>{f.flag}</span>
                    <span style={{
                      fontSize: "10px", padding: "1px 7px", borderRadius: "99px", marginLeft: "auto",
                      background: f.severity === "high" ? "rgba(239,68,68,0.12)" : f.severity === "medium" ? "rgba(245,158,11,0.12)" : "rgba(107,114,128,0.12)",
                      color: f.severity === "high" ? "#ef4444" : f.severity === "medium" ? "#f59e0b" : "#6b7280",
                      fontFamily: "'Space Mono', monospace",
                    }}>{f.severity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const emptyData = { jobTitle: "", company: "", jobDescription: "" };

export default function Compare() {
  const [data1, setData1] = useState({ ...emptyData });
  const [data2, setData2] = useState({ ...emptyData });
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const analyze = async (data, setResult, setLoading) => {
    setLoading(true);
    try {
      const r = await analyzeJob(data);
      setResult(r);
    } catch (e) {
      alert(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const winner = result1 && result2
    ? result1.riskScore < result2.riskScore ? 1 : result2.riskScore < result1.riskScore ? 2 : 0
    : null;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 32px", minHeight: "calc(100vh - 60px)" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#e6edf3", letterSpacing: "-0.4px" }}>Compare Jobs</h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px", fontFamily: "'Space Mono', monospace" }}>
          Analyze two job postings side by side
        </p>
      </div>

      {/* Winner banner */}
      {winner !== null && (
        <div style={{
          marginBottom: "22px", padding: "14px 22px", borderRadius: "12px",
          background: winner === 0 ? "rgba(107,114,128,0.1)" : "rgba(16,185,129,0.08)",
          border: winner === 0 ? "1px solid rgba(107,114,128,0.2)" : "1px solid rgba(16,185,129,0.22)",
          display: "flex", alignItems: "center", gap: "12px",
          animation: "fadeUp 0.4s ease forwards",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={winner === 0 ? "#9ca3af" : "#10b981"} strokeWidth="2">
            <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
          <span style={{ fontSize: "14px", fontWeight: "700", color: winner === 0 ? "#9ca3af" : "#10b981" }}>
            {winner === 0 ? "Both jobs have equal risk scores — it's a tie!" : `Job ${winner} is safer — ${winner === 1 ? result1?.riskScore : result2?.riskScore}% vs ${winner === 1 ? result2?.riskScore : result1?.riskScore}% risk`}
          </span>
        </div>
      )}

      {/* Comparison score bar */}
      {result1 && result2 && (
        <div style={{
          marginBottom: "22px", background: "rgba(13,17,23,0.9)", border: "1px solid #1e2330",
          borderRadius: "12px", padding: "16px 22px",
          animation: "fadeUp 0.4s ease forwards",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: winner === 1 ? "#10b981" : "#9ca3af", fontFamily: "'Space Mono', monospace" }}>
              {data1.jobTitle || "Job 1"} — {result1.riskScore}%
            </span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: winner === 2 ? "#10b981" : "#9ca3af", fontFamily: "'Space Mono', monospace" }}>
              {result2.riskScore}% — {data2.jobTitle || "Job 2"}
            </span>
          </div>
          <div style={{ display: "flex", height: "8px", borderRadius: "99px", overflow: "hidden", background: "#0d1117" }}>
            <div style={{
              width: `${result1.riskScore}%`,
              background: result1.verdict === "LIKELY_FAKE" ? "linear-gradient(90deg,#f59e0b,#ef4444)" : result1.verdict === "SUSPICIOUS" ? "linear-gradient(90deg,#10b981,#f59e0b)" : "#10b981",
              transition: "width 1.2s ease",
            }} />
            <div style={{
              width: `${result2.riskScore}%`,
              background: result2.verdict === "LIKELY_FAKE" ? "linear-gradient(90deg,#f59e0b,#ef4444)" : result2.verdict === "SUSPICIOUS" ? "linear-gradient(90deg,#10b981,#f59e0b)" : "#10b981",
              marginLeft: "auto",
              transition: "width 1.2s ease",
            }} />
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px" }}>
        <InputPanel label="First Job Posting" num={1} data={data1} setData={setData1} result={result1} isLoading={loading1}
          onAnalyze={() => analyze(data1, setResult1, setLoading1)} />
        <InputPanel label="Second Job Posting" num={2} data={data2} setData={setData2} result={result2} isLoading={loading2}
          onAnalyze={() => analyze(data2, setResult2, setLoading2)} />
      </div>
    </div>
  );
}
