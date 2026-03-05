import React from "react";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import useDecisionStore from "../../store/decisionStore";
import { useAuth } from "../../store/AuthContext";
import { useTheme } from "../../store/ThemeContext";

function Sidebar({ isOpen, onClose }) {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  // Get project-specific data
  const project = useDecisionStore((s) => s.getProjectById(projectId));

  // Auth & Theme for mobile settings
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

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
    <aside className={`main-sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ padding: "24px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none" }} onClick={onClose}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", letterSpacing: "0.5px", color: "white" }}>
            DSS <span style={{ color: "var(--primary-color)" }}>AHP</span>
          </h2>
          <small style={{ color: "#64748b", fontSize: "0.75rem", display: "block" }}>Decision Support</small>
        </Link>
        <button
          className="d-md-none"
          onClick={onClose}
          style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.5rem", padding: "0" }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
        {/* ===== GLOBAL MENU ===== */}
        <div style={{ marginBottom: "24px" }}>
          <small style={{ color: "#475569", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
            Main
          </small>
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <NavLink to="/dashboard" style={navStyle} onClick={onClose}>
              Dashboard
            </NavLink>
            <NavLink to="/project/new" style={navStyle} onClick={onClose}>
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
                  onClick={onClose}
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

      {/* Mobile Settings Block */}
      <div className="d-md-none" style={{ padding: "16px", borderTop: "1px solid #1e293b" }}>
        <small style={{ color: "#475569", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
          Settings
        </small>
        <div className="mobile-settings-item" onClick={() => { toggleTheme(); onClose(); }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
            <span>Switch to {isDark ? "Light" : "Dark"} Mode</span>
          </div>
        </div>
        <div className="mobile-settings-item" onClick={() => { logout(); onClose(); navigate("/"); }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Footer / User Info could go here */}
      <div className="d-none d-md-block" style={{ padding: "16px", borderTop: "1px solid #1e293b", fontSize: "0.75rem", color: "#475569" }}>
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
