import React, { useState } from "react";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useDecisionStore from "../../store/decisionStore";
import { useAuth } from "../../store/AuthContext";
import { useTheme } from "../../store/ThemeContext";
import { useLanguage } from "../../store/LanguageContext";

function Sidebar({ isOpen, onClose }) {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "id", name: "Bahasa Indonesia" },
  ];

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
      label: t("overview"),
      path: `/project/${projectId}`,
      enabled: true,
      end: true, // Exact match only
    },
    {
      label: t("criteria"),
      path: `/project/${projectId}/criteria`,
      enabled: true,
    },
    {
      label: t("alternatives"),
      path: `/project/${projectId}/alternatives`,
      enabled: criteria.length >= 1,
    },
    {
      label: t("compareCriteria"),
      path: `/project/${projectId}/compare-criteria`,
      enabled: criteria.length >= 2,
    },
    {
      label: t("compareAlternatives"),
      path: `/project/${projectId}/compare-alternatives`,
      enabled:
        criteria.length >= 1 &&
        alternatives.length >= 2 &&
        criteriaWeights.length === criteria.length,
    },
    {
      label: t("results"),
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
          <small style={{ color: "#64748b", fontSize: "0.75rem", display: "block" }}>{t("decisionSupport")}</small>
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
            {t("main")}
          </small>
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <NavLink to="/dashboard" style={navStyle} onClick={onClose}>
              {t("dashboard")}
            </NavLink>
            <NavLink to="/project/new" style={navStyle} onClick={onClose}>
              {t("createNewProject")}
            </NavLink>
          </nav>
        </div>

        {/* ===== AHP FLOW ===== */}
        <div>
          <small style={{ color: "#475569", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
            {t("workflow")}
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
                  title={!showAhpMenu ? t("selectProjectFirst") : t("completePreviousStep")}
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
          {t("settings")}
        </small>
        <div 
          className="mobile-settings-item" 
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{t("language")}</div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{languages.find(l => l.code === language)?.name || "English"}</div>
            </div>
            <span style={{ color: "#94a3b8", fontSize: "1rem" }}>›</span>
          </div>
        </div>
        
        <AnimatePresence>
          {showLanguageMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", marginBottom: "8px" }}
            >
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setShowLanguageMenu(false);
                    onClose();
                  }}
                  style={{
                    padding: "10px 16px 10px 44px",
                    cursor: "pointer",
                    background: language === lang.code ? "var(--primary-color)" : "transparent",
                    color: language === lang.code ? "#fff" : "#94a3b8",
                    borderRadius: "8px",
                    marginBottom: "4px",
                    fontSize: "0.9rem",
                    fontWeight: language === lang.code ? 600 : 400,
                  }}
                >
                  {lang.name}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mobile-settings-item" onClick={() => { toggleTheme(); onClose(); }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{t("theme")}</div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{isDark ? t("dark") : t("light")}</div>
            </div>
          </div>
        </div>
        <div className="mobile-settings-item" onClick={() => { logout(); onClose(); navigate("/"); }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span>{t("logout")}</span>
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
