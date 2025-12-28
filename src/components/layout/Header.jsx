import React from "react";

function Header({ title }) {
  return (
    <header
      style={{
        padding: "16px 24px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem", color: "var(--text-main)", fontWeight: 700 }}>
        {title}
      </h1>

      {/* Placeholder for future user profile or breadcrumbs */}
      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Decision Support System
      </div>
    </header>
  );
}

export default Header;
