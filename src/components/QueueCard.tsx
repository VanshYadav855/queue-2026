import type { Patient } from "../mockData";
import PatientRow from "./PatientRow";

interface QueueCardProps {
  queue: Patient[];
  avgTime: number;
  currentToken: number;
}

export default function QueueCard({
  queue,
  avgTime,
  currentToken,
}: QueueCardProps) {
  const waitingCount = queue.filter((p) => p.status === "waiting").length;

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: 600 }}>Waiting Queue</h3>
        <span
          style={{
            backgroundColor: "var(--surface-border)",
            padding: "4px 12px",
            borderRadius: "var(--radius-pill)",
            fontSize: "14px",
          }}
        >
          {waitingCount} waiting
        </span>
      </div>
      <div style={{ 
        maxHeight: "420px", 
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(167, 139, 250, 0.3) transparent",
      }} className="queue-scroll">
        {queue.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>🏥</div>
            <p>No patients in queue yet</p>
          </div>
        ) : (
          queue.map((patient) => (
            <PatientRow
              key={patient.token}
              patient={patient}
              avgTime={avgTime}
              currentToken={currentToken}
            />
          ))
        )}
      </div>
    </div>
  );
}
