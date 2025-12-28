import React from "react";
import { NavLink, useParams } from "react-router-dom";
import useDecisionStore from "../../store/decisionStore";

function Sidebar() {
  const { id: projectId } = useParams();

  // Get project-specific data
  const project = useDecisionStore((s) => s.getProjectById(projectId));

  // Get AHP data from project (or empty defaults)
  const criteria = project?.criteria || [];
  const alternatives = project?.alternatives || [];
  const criteriaWeights = project?.criteriaWeights || [];
  const finalResult = project?.finalResult || [];

  // Only show AHP menu if we're inside a project
  const showAhpMenu = !!projectId;

  const ahpMenu = [
    {
      label: "Overview",
      path: `/project/${projectId}`,
      enabled: true,
      end: true, // Exact match only
    },
    {
      label: "Criteria",
      path: `/project/${projectId}/criteria`,
      enabled: true,
    },
    {
      label: "Alternatives",
      path: `/project/${projectId}/alternatives`,
      enabled: criteria.length >= 1,
    },
    {
      label: "Compare Criteria",
      path: `/project/${projectId}/compare-criteria`,
      enabled: criteria.length >= 2,
    },
    {
      label: "Compare Alternatives",
      path: `/project/${projectId}/compare-alternatives`,
      enabled:
        criteria.length >= 1 &&
        alternatives.length >= 2 &&
        criteriaWeights.length === criteria.length,
    },
    {
      label: "Result",
      path: `/project/${projectId}/result`,
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
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <NavLink to="/dashboard" style={navStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/project/new" style={navStyle}>
          New Project
        </NavLink>
      </nav>

      <hr style={{ borderColor: "#334155", margin: "16px 0" }} />

      {/* ===== AHP FLOW (always visible, disabled when no project) ===== */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {ahpMenu.map((item) => {
          // Item enabled only if inside project AND meets step requirements
          const isEnabled = showAhpMenu && item.enabled;

          return isEnabled ? (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              style={navStyle}
            >
              {item.label}
            </NavLink>
          ) : (
            <div
              key={item.label}
              style={disabledStyle}
              title={!showAhpMenu ? "Pilih project terlebih dahulu" : "Lengkapi langkah sebelumnya"}
            >
              {item.label}
            </div>
          );
        })}
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
