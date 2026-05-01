import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../store/AuthContext";
import { useLanguage } from "../../store/LanguageContext";
import SettingsSidebar from "../../components/layout/SettingsSidebar";

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navLinks = [
    { name: t("login"), href: "/login" },
    { name: t("about"), href: "#about" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-body)",
        color: "var(--text-main)",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "var(--primary-color)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "58px",
          }}
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              fontWeight: "700",
              fontSize: "1.5rem",
              color: "#ffffff",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            DSS AHP
          </motion.div>

          {/* Desktop Navigation */}
          <ul
            style={{
              display: "flex",
              gap: "32px",
              listStyle: "none",
              margin: 0,
              padding: 0,
              alignItems: "center",
            }}
            className="d-none d-md-flex"
          >
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("/")) {
                      e.preventDefault();
                      navigate(link.href);
                    }
                  }}
                  style={{
                    textDecoration: "none",
                    color: "#ffffff",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => e.target.style.color = "rgba(255, 255, 255, 0.8)"}
                  onMouseLeave={(e) => e.target.style.color = "#ffffff"}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              {/* Burger Menu Button */}
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                }}
                aria-label="Toggle menu"
              >
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 8 : 0,
                  }}
                  style={{
                    display: "block",
                    width: "24px",
                    height: "3px",
                    backgroundColor: "#ffffff",
                    borderRadius: "2px",
                  }}
                />
                <motion.span
                  animate={{
                    opacity: isMenuOpen ? 0 : 1,
                  }}
                  style={{
                    display: "block",
                    width: "24px",
                    height: "3px",
                    backgroundColor: "#ffffff",
                    borderRadius: "2px",
                  }}
                />
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? -8 : 0,
                  }}
                  style={{
                    display: "block",
                    width: "24px",
                    height: "3px",
                    backgroundColor: "#ffffff",
                    borderRadius: "2px",
                  }}
                />
              </button>
            </li>
          </ul>

          {/* Mobile Burger Button */}
          <button
            className="d-md-none"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
            }}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                y: isMenuOpen ? 8 : 0,
              }}
              style={{
                display: "block",
                width: "24px",
                height: "3px",
                backgroundColor: "#ffffff",
                borderRadius: "2px",
                transition: "all 0.3s",
              }}
            />
            <motion.span
              animate={{
                opacity: isMenuOpen ? 0 : 1,
              }}
              style={{
                display: "block",
                width: "24px",
                height: "3px",
                backgroundColor: "#ffffff",
                borderRadius: "2px",
                transition: "all 0.3s",
              }}
            />
            <motion.span
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                y: isMenuOpen ? -8 : 0,
              }}
              style={{
                display: "block",
                width: "24px",
                height: "3px",
                backgroundColor: "#ffffff",
                borderRadius: "2px",
                transition: "all 0.3s",
              }}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="d-md-none"
              style={{
                overflow: "hidden",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: "16px 0",
                }}
              >
                {navLinks.map((link) => (
                  <li key={link.name} style={{ padding: "12px 0" }}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (link.href.startsWith("/")) {
                          e.preventDefault();
                          navigate(link.href);
                        }
                      }}
                      style={{
                        textDecoration: "none",
                        color: "#ffffff",
                        fontWeight: "500",
                        fontSize: "1rem",
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
                <li style={{ paddingTop: "16px" }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 24px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {t("dashboard")}
                  </motion.button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "120px 40px 40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ textAlign: "center" }}
        >
          <h1
            className="mb-3"
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, var(--primary-color), #334c75ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("decisionSupportSystem")}
          </h1>

          <p
            className="text-muted"
            style={{
              maxWidth: "480px",
              margin: "0 auto 2rem",
              fontSize: "1.1rem",
              lineHeight: "1.6",
            }}
          >
            {t("professionalDecisionSupport")} <br />
            <strong style={{ color: "var(--primary-color)" }}>
              {t("analyticHierarchyProcess")}
            </strong>
          </p>

          <motion.button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "16px 48px",
              fontSize: "1.1rem",
              fontWeight: "600",
              borderRadius: "50px",
              border: "none",
              background: "var(--primary-color)",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
              letterSpacing: "0.5px",
            }}
          >
            {t("goToDashboard")}
          </motion.button>

          <div
            style={{
              marginTop: "3rem",
              fontSize: "0.875rem",
              color: "#94a3b8",
            }}
          >
            &copy; 2025 Advanced Decision Systems
          </div>
        </motion.div>
      </div>
      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        topOffset={60}
      />
    </div>
  );
}

export default Landing;
