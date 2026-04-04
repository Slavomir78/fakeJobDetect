export function AnalysisDetails({ summary, positiveSignals, recommendations }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: "12px",
        padding: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#6b7280", fontFamily: "'Space Mono', monospace" }}>
            Summary
          </span>
        </div>
        <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.7" }}>{summary}</p>
      </div>

      {positiveSignals && positiveSignals.length > 0 && (
        <div style={{
          background: "rgba(16,185,129,0.05)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "12px",
          padding: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#10b981", fontFamily: "'Space Mono', monospace" }}>
              Positive Signals
            </span>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}>
            {positiveSignals.map((signal, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#9ca3af" }}>
                <span style={{ color: "#10b981", marginTop: "1px", flexShrink: 0 }}>→</span>
                {signal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div style={{
          background: "rgba(99,102,241,0.05)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "12px",
          padding: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#6366f1", fontFamily: "'Space Mono', monospace" }}>
              Recommendations
            </span>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}>
            {recommendations.map((rec, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#9ca3af" }}>
                <span style={{
                  background: "rgba(99,102,241,0.2)",
                  color: "#818cf8",
                  fontSize: "10px",
                  fontWeight: "700",
                  width: "18px", height: "18px",
                  borderRadius: "4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
