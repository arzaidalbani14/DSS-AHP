import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
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
        width: "250px", // Slightly wider for better readability
        background: "#0f172a", // Slate 900
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1e293b",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ padding: "24px", borderBottom: "1px solid #1e293b" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", letterSpacing: "0.5px", color: "white" }}>
            DSS <span style={{ color: "var(--primary-color)" }}>AHP</span>
          </h2>
        </Link>
        <small style={{ color: "#64748b", fontSize: "0.75rem" }}>Decision Support</small>
      </div>

      <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
        {/* ===== GLOBAL MENU ===== */}
        <div style={{ marginBottom: "24px" }}>
          <small style={{ color: "#475569", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
            Main
          </small>
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <NavLink to="/dashboard" style={navStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/project/new" style={navStyle}>
              New Project
            </NavLink>
          </nav>
        </div>

        {/* ===== AHP FLOW ===== */}
        <div>
          <small style={{ color: "#475569", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
            Project Workflow
          </small>
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {ahpMenu.map((item) => {
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
                  title={!showAhpMenu ? "Select a project first" : "Complete the previous step"}
                >
                  {item.label}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / User Info could go here */}
      <div style={{ padding: "16px", borderTop: "1px solid #1e293b", fontSize: "0.75rem", color: "#475569" }}>
        &copy; 2025 DSS AHP
      </div>
    </aside>
  );
}

const navStyle = ({ isActive }) => ({
  color: isActive ? "#ffffff" : "#94a3b8", // Slate 400 inactive
  textDecoration: "none",
  fontWeight: isActive ? 500 : 400,
  padding: "8px 12px",
  borderRadius: "6px",
  backgroundColor: isActive ? "var(--primary-color)" : "transparent",
  transition: "all 0.2s ease",
  display: "block",
  fontSize: "0.9rem",
  marginBottom: "2px"
});

const disabledStyle = {
  color: "#334155", // Slate 700 (darker, less visible)
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "0.9rem",
  cursor: "not-allowed",
  opacity: 0.5,
};

export default Sidebar;
