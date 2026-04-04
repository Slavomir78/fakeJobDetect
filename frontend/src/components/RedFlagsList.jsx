const severityConfig = {
  high: {
    border: "rgba(239,68,68,0.3)",
    bg: "rgba(239,68,68,0.05)",
    badge: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
    icon: "#ef4444",
    dot: "#ef4444",
  },
  medium: {
    border: "rgba(245,158,11,0.3)",
    bg: "rgba(245,158,11,0.05)",
    badge: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
    icon: "#f59e0b",
    dot: "#f59e0b",
  },
  low: {
    border: "rgba(107,114,128,0.25)",
    bg: "rgba(107,114,128,0.05)",
    badge: { bg: "rgba(107,114,128,0.15)", color: "#9ca3af" },
    icon: "#6b7280",
    dot: "#6b7280",
  },
};

export function RedFlagsList({ flags }) {
  if (!flags || flags.length === 0) {
    return (
      <div style={{
        background: "rgba(16,185,129,0.06)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#10b981",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span style={{ fontSize: "14px", fontWeight: "600" }}>No red flags detected — looks clean!</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#e6edf3" }}>Red Flags</span>
        <span style={{
          background: "rgba(239,68,68,0.15)",
          color: "#ef4444",
          fontSize: "11px",
          fontWeight: "700",
          padding: "2px 8px",
          borderRadius: "99px",
          fontFamily: "'Space Mono', monospace",
        }}>
          {flags.length} found
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {flags.map((flag, i) => {
          const cfg = severityConfig[flag.severity] || severityConfig.low;
          return (
            <div key={i} style={{
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: "10px",
              padding: "14px",
              transition: "transform 0.15s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{
                  width: "6px", height: "6px",
                  borderRadius: "50%",
                  background: cfg.dot,
                  marginTop: "6px",
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${cfg.dot}`,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#e6edf3" }}>
                      {flag.flag}
                    </span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      background: cfg.badge.bg,
                      color: cfg.badge.color,
                      fontFamily: "'Space Mono', monospace",
                    }}>
                      {flag.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", lineHeight: "1.5" }}>
                    {flag.explanation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
