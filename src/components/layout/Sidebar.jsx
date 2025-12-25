import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
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

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/project/new" style={linkStyle}>New Project</Link>
        <Link to="/project/1/criteria" style={linkStyle}>Criteria</Link>
        <Link to="/project/1/alternatives" style={linkStyle}>Alternatives</Link>
        <Link to="/project/1/compare-criteria" style={linkStyle}>Compare Criteria</Link>
        <Link to="/project/1/compare-alternatives" style={linkStyle}>Compare Alternatives</Link>
        <Link to="/project/1/result" style={linkStyle}>Result</Link>
      </nav>
    </aside>
  );
}

const linkStyle = {
  color: "#e5e7eb",
  textDecoration: "none",
};

export default Sidebar;
