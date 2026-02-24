import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

function SettingsSidebar({ isOpen, onClose, topOffset = 0 }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        style={{
                            position: "fixed",
                            inset: 0,
                            top: topOffset,
                            background: "rgba(0, 0, 0, 0.3)",
                            zIndex: 1099,
                        }}
                    />

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="settings-sidebar"
                        style={{ top: topOffset }}
                    >
                        {/* Header */}
                        <div className="settings-sidebar-header">
                            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                                Settings
                            </h3>
                            <button
                                onClick={onClose}
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

                        {/* Menu Items */}
                        <div style={{ padding: "8px 16px", flex: 1 }}>
                            {/* Bahasa / Language */}
                            <div className="settings-menu-item" onClick={() => { /* TODO: implement language switch */ }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>
                                            Language
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                            English
                                        </div>
                                    </div>
                                </div>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>›</span>
                            </div>

                            {/* Divider */}
                            <div style={{ height: "1px", background: "#e2e8f0", margin: "8px 0" }} />

                            {/* Logout */}
                            <div
                                className="settings-menu-item"
                                onClick={handleLogout}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                        Logout
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
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
