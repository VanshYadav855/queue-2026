import type { Patient } from "../mockData";

interface PatientRowProps {
  patient: Patient;
  avgTime: number;
  currentToken: number;
}

export default function PatientRow({
  patient,
  avgTime,
  currentToken,
}: PatientRowProps) {
  const getEstimatedWait = () => {
    if (patient.status === "called" || patient.status === "current") return "—";
    const ahead = patient.token - currentToken - 1;
    return `~${ahead * avgTime} min`;
  };

  const getStatusColor = () => {
    switch (patient.status) {
      case "called":
        return "var(--text-muted)";
      case "current":
        return "var(--success)";
      case "waiting":
        return "#F59E0B";
      default:
        return "var(--text-muted)";
    }
  };

  const getStatusText = () => {
    switch (patient.status) {
      case "called":
        return "Called";
      case "current":
        return "Now Seeing";
      case "waiting":
        return "Waiting";
      default:
        return "";
    }
  };

  return (
    <div
      className="slide-in-right"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid var(--surface-border)",
        opacity: patient.status === "called" ? 0.4 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "white",
            padding: "4px 12px",
            borderRadius: "var(--radius-pill)",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          #{String(patient.token).padStart(2, "0")}
        </span>
        <span style={{ 
          fontSize: "16px",
          textDecoration: patient.status === "called" ? "line-through" : "none",
          color: patient.status === "called" ? "#6B7280" : "var(--text-primary)",
        }}>{patient.name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          {getEstimatedWait()}
        </span>
        <span
          style={{
            backgroundColor:
              patient.status === "current"
                ? "rgba(52, 211, 153, 0.1)"
                : patient.status === "waiting"
                  ? "rgba(245, 158, 11, 0.1)"
                  : "transparent",
            color: getStatusColor(),
            padding: "4px 10px",
            borderRadius: "var(--radius-pill)",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {getStatusText()}
        </span>
      </div>
    </div>
  );
}
