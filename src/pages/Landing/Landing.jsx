import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        background: "radial-gradient(circle at 50% 50%, #f8fafc 0%, #e2e8f0 100%)",
        color: "var(--text-main)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ textAlign: "center" }}
      >
        <h1
          className="mb-3"
          style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, var(--primary-color), #1e293b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          DECISION SUPPORT SYSTEM
        </h1>

        <p className="text-muted" style={{ maxWidth: "480px", margin: "0 auto 2rem", fontSize: "1.1rem", lineHeight: "1.6" }}>
          Sistem Pendukung Keputusan Profesional Berbasis <br />
          <strong style={{ color: "var(--primary-color)" }}>Analytic Hierarchy Process</strong>
        </p>

        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: "16px 48px",
            fontSize: "1.1rem",
            fontWeight: "600",
            borderRadius: "50px",
            border: "none",
            background: "var(--primary-color)",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
            letterSpacing: "0.5px"
          }}
        >
          Masuk ke Dashboard
        </motion.button>

        <div style={{ marginTop: "3rem", fontSize: "0.875rem", color: "#94a3b8" }}>
          &copy; 2025 Advanced Decision Systems
        </div>
      </motion.div>
    </div>
  );
}

export default Landing;
