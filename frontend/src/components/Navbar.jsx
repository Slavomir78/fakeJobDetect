import { useLocation, useNavigate } from "react-router-dom";

const links = [
  {
    path: "/", label: "Scan",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
  },
  {
    path: "/history", label: "History",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><polyline points="12 7 12 12 15 15"/></svg>
  },
  {
    path: "/stats", label: "Stats",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  },
  {
    path: "/compare", label: "Compare",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="18"/><rect x="14" y="3" width="7" height="18"/></svg>
  },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header style={{
      borderBottom: "1px solid #21262d",
      background: "rgba(6,8,16,0.9)",
      backdropFilter: "blur(16px)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "60px",
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <div style={{
            width: "34px", height: "34px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "9px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-0.3px", color: "#e6edf3" }}>JobShield</div>
            <div style={{ fontSize: "10px", color: "#4b5563", fontFamily: "'Space Mono', monospace" }}>Fake Job Detector</div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "7px 14px", borderRadius: "8px", border: "none",
                  cursor: "pointer", fontSize: "13px", fontWeight: active ? "700" : "500",
                  fontFamily: "'Syne', sans-serif",
                  color: active ? "#e6edf3" : "#6b7280",
                  background: active ? "#1a1e2e" : "transparent",
                  border: active ? "1px solid #2d3348" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#9ca3af"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#6b7280"; }}
              >
                <span style={{ color: active ? "#6366f1" : "currentColor" }}>{link.icon}</span>
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Status */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontSize: "11px", color: "#10b981",
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          padding: "5px 12px", borderRadius: "99px",
          fontFamily: "'Space Mono', monospace", fontWeight: "700",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
          Live
        </div>
      </div>
    </header>
  );
}
