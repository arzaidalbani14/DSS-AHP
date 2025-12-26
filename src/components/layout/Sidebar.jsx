import React from "react";
import { NavLink } from "react-router-dom";
import useDecisionStore from "../../store/decisionStore";

function Sidebar() {
  const {
    criteria,
    alternatives,
    criteriaWeights,
    finalResult,
  } = useDecisionStore();

  const ahpMenu = [
    {
      label: "Criteria",
      path: "/project/1/criteria",
      enabled: true,
    },
    {
      label: "Compare Criteria",
      path: "/project/1/compare-criteria",
      enabled: criteria.length >= 2,
    },
    {
      label: "Alternatives",
      path: "/project/1/alternatives",
      enabled: criteria.length >= 1,
    },
    {
      label: "Compare Alternatives",
      path: "/project/1/compare-alternatives",
      enabled:
        alternatives.length >= 2 && criteriaWeights.length > 0,
    },
    {
      label: "Result",
      path: "/project/1/result",
      enabled: finalResult.length > 0,
    },
  ];

  return (
    <aside
      style={{
        width: "220px",
        background: "#1e293b",
        color: "#fff",
        padding: "16px",
      }}
    >
      <h2 style={{ marginBottom: "24px" }}>DSS AHP</h2>

      {/* ===== GLOBAL MENU ===== */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        <NavLink to="/dashboard" style={navStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/project/new" style={navStyle}>
          New Project
        </NavLink>
      </nav>

      <hr style={{ borderColor: "#334155", margin: "16px 0" }} />

      {/* ===== AHP FLOW ===== */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {ahpMenu.map((item) =>
          item.enabled ? (
            <NavLink
              key={item.path}
              to={item.path}
              style={navStyle}
            >
              {item.label}
            </NavLink>
          ) : (
            <div
              key={item.path}
              style={disabledStyle}
              title="Lengkapi langkah sebelumnya terlebih dahulu"
            >
              {item.label}
            </div>
          )
        )}
      </nav>
    </aside>
  );
}

const navStyle = ({ isActive }) => ({
  color: isActive ? "#fff" : "#e5e7eb",
  textDecoration: "none",
  fontWeight: isActive ? 600 : 400,
  padding: "6px 8px",
  borderRadius: "6px",
  backgroundColor: isActive ? "#2563eb" : "transparent",
});

const disabledStyle = {
  color: "#9ca3af",
  padding: "6px 8px",
  borderRadius: "6px",
  cursor: "not-allowed",
  opacity: 0.6,
};

export default Sidebar;

// lanjut perbaiki alternatives - belum jalan