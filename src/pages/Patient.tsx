import { useState, useEffect } from "react";
import socket from "../socket";

interface Patient {
  token: number;
  name: string;
  status: "called" | "current" | "waiting" | "skipped";
}

const formatName = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return parts[0] + " " + parts[parts.length - 1][0] + ".";
};

export default function PatientPage() {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [currentToken, setCurrentToken] = useState<number>(0);
  const [avgTime, setAvgTime] = useState<number>(7);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [myToken, setMyToken] = useState<number | null>(null);
  const [inputToken, setInputToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial state on mount
    fetch("http://localhost:3001/state")
      .then(res => res.json())
      .then(data => {
        setQueue(data.queue);
        setCurrentToken(data.currentToken);
        setAvgTime(data.avgTime);
        setLastUpdated(new Date());
      });

    // Listen for queue updates
    const handleQueueUpdate = (data: any) => {
      setQueue(data.queue);
      setCurrentToken(data.currentToken);
      setAvgTime(data.avgTime);
      setLastUpdated(new Date());
    };
    socket.on("queue_update", handleQueueUpdate);

    // Cleanup
    return () => {
      socket.off("queue_update", handleQueueUpdate);
    };
  }, []);

  // Update "seconds ago" every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
      setSecondsAgo(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenNum = Number(inputToken);
    if (isNaN(tokenNum)) {
      setError("Please enter a valid token number");
      return;
    }
    const exists = queue.some(p => p.token === tokenNum);
    if (exists) {
      setMyToken(tokenNum);
      setError(null);
    } else {
      setError("Token not found in queue. Check your slip.");
    }
  };

  const myPatient = myToken ? queue.find((p) => p.token === myToken) : null;
  const currentPatient = queue.find((p) => p.status === "current");
  const tokensAhead = myToken ? queue.filter(p => p.status === "waiting" && p.token < myToken).length : 0;
  const estimatedWait = tokensAhead * avgTime;
  const upcomingTokens = queue.filter((p) => p.token >= currentToken);

  let tokenState: "serving" | "passed" | "waiting" = "waiting";
  if (myPatient?.status === "current") {
    tokenState = "serving";
  } else if (myPatient?.status === "called" || myPatient?.status === "skipped") {
    tokenState = "passed";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {myToken === null ? (
        <>
          <div
            className="glass-card"
            style={{
              padding: "24px",
              maxWidth: "560px",
              width: "100%",
              border: "1px solid rgba(167, 139, 250, 0.25)",
              boxShadow: "0 0 60px rgba(167, 139, 250, 0.18)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
              Enter your token number
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="07"
                style={{
                  width: "160px",
                  margin: "0 auto",
                  textAlign: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--accent-primary)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "64px",
                  appearance: "none",
                }}
              />
              {error && (
                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "-8px" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="pill-button pill-button-primary"
                style={{ width: "100%", padding: "12px 24px", fontSize: "16px" }}
              >
                Track My Wait →
              </button>
            </form>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "16px" }}>
              Your token number is printed on your slip
            </p>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setMyToken(null)}
            style={{
              position: "absolute",
              top: "24px",
              left: "24px",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "14px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            ← Change Token
          </button>
          {tokenState === "serving" ? (
            <div
              className="glass-card"
              style={{
                padding: "40px",
                maxWidth: "560px",
                width: "100%",
                border: "1px solid #34D399",
                boxShadow: "0 0 60px rgba(52, 211, 153, 0.18)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "72px", marginBottom: "16px" }}>✅</div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "48px",
                  color: "#34D399",
                  marginBottom: "16px",
                }}
              >
                It's your turn!
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "18px" }}>
                Please proceed to reception now.
              </p>
            </div>
          ) : tokenState === "passed" ? (
            <div
              className="glass-card"
              style={{
                padding: "40px",
                maxWidth: "560px",
                width: "100%",
                border: "1px solid #F59E0B",
                boxShadow: "0 0 60px rgba(245, 158, 11, 0.18)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "72px", marginBottom: "16px" }}>⚠️</div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "32px",
                  color: "#F59E0B",
                  marginBottom: "16px",
                }}
              >
                Your token has passed.
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "18px" }}>
                Token #{String(myToken).padStart(2, "0")} was already called. Please contact reception.
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  marginBottom: "24px",
                  padding: "6px 16px",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--surface-border)",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
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
                Live Updates · Auto-sync
              </div>
              <div
                className="glass-card"
                style={{
                  padding: "24px",
                  maxWidth: "560px",
                  width: "100%",
                  border: "1px solid rgba(167, 139, 250, 0.25)",
                  boxShadow: "0 0 60px rgba(167, 139, 250, 0.18)",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "8px" }}>
                    Now Serving
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "96px",
                      color: "var(--accent-primary)",
                    }}
                  >
                    #{String(currentToken).padStart(2, "0")}
                  </p>
                  {currentPatient && (
                    <p style={{ color: "var(--text-muted)" }}>{formatName(currentPatient.name)}</p>
                  )}
                </div>
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid var(--surface-border)",
                    margin: "32px 0",
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "8px" }}>
                    Your Token
                  </p>
                  <p
                    style={{
                      fontSize: "64px",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    #{String(myToken).padStart(2, "0")}
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <span
                      className="glass-card"
                      style={{ padding: "8px 16px", fontSize: "14px" }}
                    >
                      {tokensAhead} ahead of you
                    </span>
                    <span
                      className="glass-card"
                      style={{ padding: "8px 16px", fontSize: "14px" }}
                    >
                      ~{estimatedWait} min estimated wait
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      marginTop: "24px",
                    }}
                  >
                    Your estimated wait updates automatically as the queue moves.
                  </p>
                </div>
              </div>
              <div
                style={{
                  marginTop: "32px",
                  textAlign: "center",
                  maxWidth: "560px",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                  {upcomingTokens.slice(0, 8).map((patient) => (
                    <span
                      key={patient.token}
                      style={{
                        backgroundColor:
                          patient.token === myToken
                            ? "var(--accent-primary)"
                            : patient.status === "current"
                              ? "var(--success)"
                              : "var(--surface)",
                        color:
                          patient.token === myToken || patient.status === "current"
                            ? "white"
                            : "var(--text-primary)",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-pill)",
                        fontSize: "14px",
                        fontWeight: patient.token === myToken ? 600 : 500,
                        boxShadow: patient.token === myToken ? "0 0 12px rgba(167, 139, 250, 0.5)" : "none",
                      }}
                    >
                      #{String(patient.token).padStart(2, "0")}
                      {patient.token === myToken ? " (you)" : ""}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    marginTop: "16px",
                  }}
                >
                  Last updated {secondsAgo === 0 ? "just now" : `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`} · Refreshes automatically
                </p>
              </div>
            </>
          )}
          <footer
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "48px",
            }}
          >
            Queue Cure '26 · Wooble Hackathon
          </footer>
        </>
      )}
    </div>
  );
}
