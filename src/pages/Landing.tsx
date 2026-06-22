import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsBadge from "../components/StatsBadge";

export default function Landing() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "0 24px" }}>
      <Navbar />
      <section
      
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "100px 0 80px 0",
        }}
      >
        <span
          style={{
            border: "1px solid var(--accent-primary)",
            padding: "6px 16px",
            borderRadius: "var(--radius-pill)",
            fontSize: "14px",
            color: "var(--accent-primary)",
            marginBottom: "24px",
          }}
        >
          Real-time · No refresh · No paper slips
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(40px, 8vw, 72px)",
            lineHeight: "1.1",
            marginBottom: "16px",
            maxWidth: "800px",
          }}
        >
          Clinics run on chaos.
          <br />
          <span style={{ color: "var(--accent-primary)" }}>We fixed the wait.</span>
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "18px",
            fontWeight: 300,
            maxWidth: "520px",
            marginBottom: "32px",
          }}
        >
          Millions of clinics across India still rely on paper tokens and manual calling. Queue Cure
          replaces that with live, zero-refresh queue management — built for
          receptionists, designed for patients.
        </p>
        <div
          style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            to="/receptionist"
            className="pill-button pill-button-primary"
            style={{ padding: "14px 32px", fontSize: "16px" }}
          >
            Open Receptionist View →
          </Link>
          <Link
            to="/patient"
            className="pill-button pill-button-secondary"
            style={{ padding: "14px 32px", fontSize: "16px" }}
          >
            Patient Waiting Room →
          </Link>
        </div>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginTop: "32px",
          }}
        >
          Built for Queue Cure '26 Hackathon · Wooble
        </p>
      </section>
      <section
        style={{
          padding: "0 24px 80px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(32px, 5vw, 48px)",
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          Two screens. One live system.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          <div className="glass-card feature-card" style={{ padding: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏥</div>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>
              Receptionist adds patients
            </h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Enter name, assign token. Set average consultation time. One click to
              call next.
            </p>
          </div>
          <div className="glass-card feature-card" style={{ padding: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>
              Queue updates instantly
            </h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Socket.io pushes live updates to every connected screen — no polling,
              no refresh.
            </p>
          </div>
          <div className="glass-card feature-card" style={{ padding: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧍</div>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>
              Patients see their wait
            </h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Current token, position in queue, and a real estimated wait time — not
              a guess.
            </p>
          </div>
        </div>
      </section>
      <section
        className="glass-card"
        style={{
          padding: "48px 24px",
          margin: "0 24px 80px",
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          <StatsBadge number="76%" label="of clinics still use paper tokens" />
          <StatsBadge number="2–3 hrs" label="average patient wait with no visibility" />
          <StatsBadge number="0 ms" label="delay on queue update (WebSocket)" />
        </div>
      </section>
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(32px, 5vw, 48px)",
            marginBottom: "32px",
          }}
        >
          Ready to kill the waiting room chaos?
        </h2>
        <div
          style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            to="/receptionist"
            className="pill-button pill-button-primary"
            style={{ padding: "14px 32px", fontSize: "16px" }}
          >
            Open Receptionist View →
          </Link>
          <Link
            to="/patient"
            className="pill-button pill-button-secondary"
            style={{ padding: "14px 32px", fontSize: "16px" }}
          >
            Patient Waiting Room →
          </Link>
        </div>
        <footer
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginTop: "48px",
          }}
        >
          © Queue Cure '26 · Built on Wooble Hackathon
        </footer>
      </section>
    </div>
  );
}
