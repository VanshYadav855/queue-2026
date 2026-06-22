import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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
            animation: "slide-in-right 0.6s ease-out",
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
            animation: "slide-in-right 0.8s ease-out",
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
            animation: "slide-in-right 1s ease-out",
          }}
        >
          Millions of clinics across India still rely on paper tokens and manual calling. Queue Cure
          replaces that with live, zero-refresh queue management — built for
          receptionists, designed for patients.
        </p>
        <div
          style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", animation: "slide-in-right 1.2s ease-out" }}
        >
          <Link
            to="/receptionist"
            className="pill-button liquid-glass-strong"
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <span>Open Receptionist View</span>
            <ArrowUpRight style={{ width: "20px", height: "20px" }} />
          </Link>
          <Link
            to="/patient"
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              color: "black",
              backgroundColor: "white",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
          >
            Patient Waiting Room
            <ArrowUpRight style={{ width: "16px", height: "16px" }} />
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
          {[
            { icon: "🏥", title: "Receptionist adds patients", desc: "Enter name, assign token. Set average consultation time. One click to call next." },
            { icon: "⚡", title: "Queue updates instantly", desc: "Socket.io pushes live updates to every connected screen — no polling, no refresh." },
            { icon: "🧍", title: "Patients see their wait", desc: "Current token, position in queue, and a real estimated wait time — not a guess." },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card feature-card"
              style={{
                padding: "32px",
                animation: `slide-in-right ${1.4 + i * 0.2}s ease-out`
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>{feature.title}</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>{feature.desc}</p>
            </div>
          ))}
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
            className="pill-button liquid-glass-strong"
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <span>Open Receptionist View</span>
            <ArrowUpRight style={{ width: "20px", height: "20px" }} />
          </Link>
          <Link
            to="/patient"
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              color: "black",
              backgroundColor: "white",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
          >
            Patient Waiting Room
            <ArrowUpRight style={{ width: "16px", height: "16px" }} />
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
