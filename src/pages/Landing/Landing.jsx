import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <h1>DSS AHP</h1>

      <p style={{ maxWidth: "420px", textAlign: "center", marginTop: "12px" }}>
        Sistem Pendukung Keputusan berbasis Analytic Hierarchy Process
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "32px",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Masuk ke Dashboard
      </button>
    </div>
  );
}

export default Landing;
