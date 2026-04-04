import { useState } from "react";

export function JobInputForm({ onSubmit, isLoading }) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobDescription.trim().length < 20) return;
    onSubmit({ jobDescription, jobTitle, company });
  };

  const charCount = jobDescription.length;
  const isReady = jobDescription.trim().length >= 20;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={styles.label}>Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
          />
        </div>
        <div>
          <label style={styles.label}>Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Google"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
          />
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <label style={styles.label}>Job Description *</label>
          <span style={{
            fontSize: "11px",
            fontFamily: "'Space Mono', monospace",
            color: isReady ? "#10b981" : "#6b7280",
            transition: "color 0.3s"
          }}>
            {isReady ? `${charCount} chars ✓` : `${20 - charCount} more needed`}
          </span>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={7}
          style={styles.textarea}
          onFocus={(e) => Object.assign(e.target.style, styles.textareaFocus)}
          onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
        />
        <div style={{
          height: "3px",
          background: "#1f2937",
          borderRadius: "99px",
          marginTop: "6px",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            width: `${Math.min((charCount / 200) * 100, 100)}%`,
            background: isReady ? "linear-gradient(90deg, #10b981, #34d399)" : "linear-gradient(90deg, #6366f1, #8b5cf6)",
            borderRadius: "99px",
            transition: "width 0.3s ease, background 0.3s ease"
          }} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !isReady}
        style={{
          ...styles.btn,
          ...(isLoading || !isReady ? styles.btnDisabled : styles.btnActive)
        }}
      >
        {isLoading ? (
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={styles.spinner} />
            Analyzing...
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Analyze Job Posting
          </span>
        )}
      </button>
    </form>
  );
}

const styles = {
  label: {
    display: "block",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: "6px",
    fontFamily: "'Space Mono', monospace",
  },
  input: {
    width: "100%",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#e6edf3",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputFocus: {
    width: "100%",
    background: "#0d1117",
    border: "1px solid #6366f1",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#e6edf3",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#e6edf3",
    fontSize: "13px",
    outline: "none",
    resize: "none",
    lineHeight: "1.6",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  textareaFocus: {
    width: "100%",
    background: "#0d1117",
    border: "1px solid #6366f1",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#e6edf3",
    fontSize: "13px",
    outline: "none",
    resize: "none",
    lineHeight: "1.6",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  btn: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "none",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  btnActive: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
  },
  btnDisabled: {
    background: "#1f2937",
    color: "#4b5563",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};
