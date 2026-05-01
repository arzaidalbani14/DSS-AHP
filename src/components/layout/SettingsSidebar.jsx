import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useTheme } from "../../store/ThemeContext";
import { useLanguage } from "../../store/LanguageContext";

function SettingsSidebar({ isOpen, onClose, topOffset = 0 }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { language, changeLanguage, t } = useLanguage();
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/");
    };

    const languages = [
        { code: "en", name: "English" },
        { code: "id", name: "Bahasa Indonesia" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                            onClose();
                            setShowLanguageMenu(false);
                        }}
                        style={{
                            position: "fixed",
                            inset: "0px",
                            top: topOffset,
                            background: "rgba(0, 0, 0, 0.3)",
                            zIndex: 1099,
                        }}
                    />

                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="settings-sidebar"
                        style={{ top: topOffset }}
                    >
                        <div className="settings-sidebar-header">
                            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                                {t("settings")}
                            </h3>
                            <button
                                onClick={() => {
                                    onClose();
                                    setShowLanguageMenu(false);
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "1.3rem",
                                    color: "var(--text-muted)",
                                    padding: "4px",
                                    lineHeight: 1,
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ padding: "8px 16px", flex: 1 }}>
                            <div 
                                className="settings-menu-item" 
                                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>
                                            {t("language")}
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                            {languages.find(l => l.code === language)?.name || "English"}
                                        </div>
                                    </div>
                                </div>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>›</span>
                            </div>

                            <AnimatePresence>
                                {showLanguageMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        {languages.map((lang) => (
                                            <div
                                                key={lang.code}
                                                onClick={() => {
                                                    changeLanguage(lang.code);
                                                    setShowLanguageMenu(false);
                                                }}
                                                style={{
                                                    padding: "12px 16px 12px 44px",
                                                    cursor: "pointer",
                                                    background: language === lang.code ? "var(--primary-color)" : "transparent",
                                                    color: language === lang.code ? "#fff" : "var(--text-main)",
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

                            <div style={{ height: "1px", background: "#e2e8f0ff", margin: "8px 0" }} />

                            <div className="settings-menu-item" onClick={toggleTheme}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    {isDark ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                    )}
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>
                                            {t("theme")}
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                            {isDark ? t("dark") : t("light")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: "1px", background: "#e2e8f0ff", margin: "8px 0" }} />

                            <div
                                className="settings-menu-item"
                                onClick={handleLogout}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                        {t("logout")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            padding: "16px 20px",
                            borderTop: "1px solid #e2e8f0",
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            textAlign: "center",
                        }}>
                            DSS AHP v0.56 (pre release)
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

export default SettingsSidebar;