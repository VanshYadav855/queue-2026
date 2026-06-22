import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "18px", fontWeight: 600 }}>QueueCure</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "var(--success)",
              borderRadius: "50%",
            }}
            className="pulse-glow"
          ></span>
          Live System
        </span>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <Link
          to="/receptionist"
          className="pill-button pill-button-secondary"
          style={{ padding: "8px 20px", fontSize: "14px" }}
        >
          Receptionist
        </Link>
        <Link
          to="/patient"
          className="pill-button pill-button-secondary"
          style={{ padding: "8px 20px", fontSize: "14px" }}
        >
          Patient View
        </Link>
      </div>
    </nav>
  );
}
