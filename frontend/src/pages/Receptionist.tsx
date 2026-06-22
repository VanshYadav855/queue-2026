import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import QueueCard from "../components/QueueCard";
import socket from "../socket";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

interface Patient {
  token: number;
  name: string;
  status: "called" | "current" | "waiting" | "skipped";
}

export default function Receptionist() {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [currentToken, setCurrentToken] = useState<number>(0);
  const [avgTime, setAvgTimeState] = useState<number>(7);
  const [tokensToday, setTokensToday] = useState<number>(0);
  const [patientName, setPatientName] = useState<string>("");
  const [buttonPulse, setButtonPulse] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showUndoToast, setShowUndoToast] = useState<boolean>(false);
  const [toastToken, setToastToken] = useState<number>(0);
  const [avgTimeError, setAvgTimeError] = useState<string | null>(null);
  const [completedCollapsed, setCompletedCollapsed] = useState<boolean>(true);

  useEffect(() => {
    // Fetch initial state on mount
    fetch(`${BACKEND_URL}/state`)
      .then(res => res.json())
      .then(data => {
        setQueue(data.queue);
        setCurrentToken(data.currentToken);
        setAvgTimeState(data.avgTime);
        setTokensToday(data.tokensToday);
      });

    // Listen for queue updates
    const handleQueueUpdate = (data: any) => {
      setQueue(data.queue);
      setCurrentToken(data.currentToken);
      setAvgTimeState(data.avgTime);
      setTokensToday(data.tokensToday);
    };
    socket.on("queue_update", handleQueueUpdate);

    // Cleanup
    return () => {
      socket.off("queue_update", handleQueueUpdate);
    };
  }, []);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    socket.emit("add_patient", { name: patientName, avgTime });
    setPatientName("");
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCallNext = () => {
    setButtonPulse(true);
    setTimeout(() => setButtonPulse(false), 150);
    socket.emit("call_next");
    // Show undo toast
    const nextToken = queue.find((p) => p.status === "waiting")?.token || 0;
    setToastToken(nextToken);
    setShowUndoToast(true);
    setTimeout(() => setShowUndoToast(false), 10000);
  };

  const handleAvgTimeChange = (value: number) => {
    setAvgTimeState(value);
    socket.emit("set_avg_time", { avgTime: value });
  };

  const handleAvgTimeBlur = () => {
    if (avgTime < 1 || avgTime > 120) {
      setAvgTimeError("Enter a time between 1 and 120 minutes.");
    } else {
      setAvgTimeError(null);
    }
  };

  const handleQuickAvgTime = (value: number) => {
    handleAvgTimeChange(value);
    setAvgTimeError(null);
  };

  const handleSkipConfirm = () => {
    socket.emit("skip_patient", { token: currentToken });
    setShowSkipConfirm(false);
  };

  const handleUndo = () => {
    socket.emit("undo_call");
    setShowUndoToast(false);
  };

  const handleResetConfirm = () => {
    socket.emit("reset_day");
    setShowResetModal(false);
  };

  const currentPatient = queue.find((p) => p.status === "current");
  const nextPatient = queue.find(
    (p) => p.token > currentToken && p.status === "waiting"
  );
  const waitingQueue = queue.filter((p) =>
    p.status === "waiting" || p.status === "current"
  );
  const completedQueue = queue.filter((p) =>
    p.status === "called" || p.status === "skipped"
  );

  return (
    <div style={{ minHeight: "100vh", padding: "24px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          ← Back
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600 }}>Receptionist Dashboard</h2>
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "var(--success)",
              borderRadius: "50%",
            }}
            className="pulse-glow"
          ></span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span
            className="glass-card"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            Today: {tokensToday} tokens
          </span>
          <button
            onClick={() => setShowResetModal(true)}
            className="pill-button pill-button-secondary"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            Reset Day
          </button>
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Add Patient</h3>
            <form onSubmit={handleAddPatient} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                  }}
                >
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface-border)",
                    backgroundColor: "transparent",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                  }}
                >
                  Avg. Consultation Time (min)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={avgTime}
                  onChange={(e) => handleAvgTimeChange(Number(e.target.value))}
                  onBlur={handleAvgTimeBlur}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface-border)",
                    backgroundColor: "transparent",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
                {avgTimeError && (
                  <p style={{ color: "#EF4444", fontSize: "12px", marginTop: "8px" }}>
                    {avgTimeError}
                  </p>
                )}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  {[5, 10, 15].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAvgTime(val)}
                      className="pill-button pill-button-secondary"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      {val} min
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="pill-button pill-button-primary"
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  opacity: !patientName.trim() ? 0.5 : 1,
                  cursor: !patientName.trim() ? "not-allowed" : "pointer",
                }}
                disabled={!patientName.trim()}
              >
                {added ? "✓ Added!" : "Add to Queue +"}
              </button>
            </form>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                marginTop: "12px",
              }}
            >
              Token number assigned automatically
            </p>
          </div>
          <div className="glass-card" style={{ padding: "24px" }}>
            <button
              onClick={handleCallNext}
              disabled={!nextPatient}
              className={`pill-button pill-button-primary ${buttonPulse ? "button-pulse" : ""}`}
              style={{
                width: "100%",
                padding: "16px 24px",
                fontSize: "18px",
                marginBottom: showSkipConfirm ? "12px" : "24px",
              }}
            >
              {!nextPatient ? "Queue is empty" : "Call Next Token →"}
            </button>
            {showSkipConfirm ? (
              <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "14px", marginBottom: "12px" }}>
                  Skip token #{String(currentToken).padStart(2, "0")}?
                </p>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                  <button
                    onClick={handleSkipConfirm}
                    className="pill-button pill-button-primary"
                    style={{ padding: "8px 16px", fontSize: "14px" }}
                  >
                    Yes, skip
                  </button>
                  <button
                    onClick={() => setShowSkipConfirm(false)}
                    className="pill-button pill-button-secondary"
                    style={{ padding: "8px 16px", fontSize: "14px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSkipConfirm(true)}
                className="pill-button pill-button-secondary"
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  fontSize: "14px",
                  marginBottom: "24px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "var(--text-muted)",
                }}
              >
                Skip / No-show
              </button>
            )}
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "8px" }}>
                Now Calling
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "36px",
                }}
              >
                Token #{String(currentToken).padStart(2, "0")}
              </p>
              {currentPatient && (
                <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
                  {currentPatient.name}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <QueueCard
            queue={waitingQueue}
            avgTime={avgTime}
            currentToken={currentToken}
          />
          <div style={{ marginTop: "16px" }}>
            <button
              onClick={() => setCompletedCollapsed(!completedCollapsed)}
              style={{
                width: "100%",
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {completedCollapsed ? "▶" : "▼"} Completed today ({completedQueue.length})
            </button>
            {!completedCollapsed && completedQueue.length > 0 && (
              <div className="glass-card" style={{ padding: "16px", marginTop: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {completedQueue.map((patient) => (
                    <div
                      key={patient.token}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        opacity: 0.4,
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>
                        #{String(patient.token).padStart(2, "0")} · {patient.name}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {patient.status === "called" ? "Called" : "Skipped"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Undo Toast */}
      {showUndoToast && (
        <div
          className="glass-card"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: 1000,
          }}
        >
          <span style={{ fontSize: "14px" }}>
            Token #{String(toastToken).padStart(2, "0")} is now serving.
          </span>
          <button
            onClick={handleUndo}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "var(--accent-primary)",
              cursor: "pointer",
              fontSize: "14px",
              padding: 0,
            }}
          >
            Undo
          </button>
        </div>
      )}

      {/* Reset Modal */}
      {showResetModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="glass-card" style={{ padding: "32px", maxWidth: "400px", width: "100%" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Start a new day?</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              This will clear all completed tokens. Current queue will be preserved.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowResetModal(false)}
                className="pill-button pill-button-secondary"
                style={{ padding: "10px 20px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="pill-button pill-button-primary"
                style={{ padding: "10px 20px", backgroundColor: "#EF4444" }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
