import { useState, useEffect } from "react";
import socket from "../socket";

export default function ConnectionStatus() {
  const [status, setStatus] = useState<"connected" | "reconnecting" | "disconnected">("connected");

  useEffect(() => {
    const handleConnect = () => setStatus("connected");
    const handleDisconnect = () => setStatus("disconnected");
    const handleReconnecting = () => setStatus("reconnecting");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnecting", handleReconnecting);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnecting", handleReconnecting);
    };
  }, []);

  const getDotColor = () => {
    switch (status) {
      case "connected":
        return "#34D399";
      case "reconnecting":
        return "#F59E0B";
      case "disconnected":
        return "#EF4444";
      default:
        return "#EF4444";
    }
  };

  const getText = () => {
    switch (status) {
      case "connected":
        return "Live";
      case "reconnecting":
        return "Reconnecting…";
      case "disconnected":
        return "Updates paused";
      default:
        return "Disconnected";
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "8px 16px",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        zIndex: 1000,
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: getDotColor(),
          borderRadius: "50%",
        }}
        className={status === "connected" ? "pulse-glow" : ""}
      ></span>
      {getText()}
    </div>
  );
}
