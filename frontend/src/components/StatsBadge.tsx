interface StatsBadgeProps {
  number: string;
  label: string;
}

export default function StatsBadge({ number, label }: StatsBadgeProps) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "48px",
          fontWeight: 700,
          fontStyle: "italic",
          fontFamily: "var(--font-display)",
          color: "var(--accent-primary)",
        }}
      >
        {number}
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
        {label}
      </div>
    </div>
  );
}
