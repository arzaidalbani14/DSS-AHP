import React, { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import { useTheme } from "../../store/ThemeContext";

function Header({ title, onMobileMenuClick }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <>
      <header
        style={{
          padding: "16px 24px",
          background: isDark ? "rgba(18, 18, 18, 0.85)" : "rgba(255, 255, 255, 0.8)",
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onMobileMenuClick}
            className="burger-btn d-md-none"
            aria-label="Open main menu"
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "var(--text-main)", fontWeight: 700 }}>
            {title}
          </h1>
        </div>

        {/* Burger Menu Button (Settings) - Hide on mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="burger-btn d-none d-md-flex"
          aria-label="Open settings"
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>
      </header>

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

export default Header;
