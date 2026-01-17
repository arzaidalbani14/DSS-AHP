import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "#" },
    { name: "Tentang", href: "#about" },
    { name: "Fitur", href: "#features" },
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
              color: "var(--bg-body)",
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
                  style={{
                    textDecoration: "none",
                    color: "var(--bg-body)",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.color = "var(--bg-glass)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--bg-body)"}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                    backgroundColor: "var(--bg-body)",
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
                    backgroundColor: "var(--bg-body)",
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
                    backgroundColor: "var(--bg-body)",
                    borderRadius: "2px",
                  }}
                />
              </button>
            </li>
          </ul>

          {/* Mobile Hamburger Button */}
          <button
            className="d-md-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                backgroundColor: "#374151",
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
                backgroundColor: "#374151",
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
                backgroundColor: "#374151",
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
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        textDecoration: "none",
                        color: "#475569",
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
                      border: "none",
                      background: "var(--primary-color)",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Dashboard
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
              background: "linear-gradient(135deg, var(--primary-color), #1e293b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DECISION SUPPORT SYSTEM
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
            Sistem Pendukung Keputusan Profesional Berbasis <br />
            <strong style={{ color: "var(--primary-color)" }}>
              Analytic Hierarchy Process
            </strong>
          </p>

          <motion.button
            onClick={() => navigate("/dashboard")}
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
            Masuk ke Dashboard
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
    </div>
  );
}

export default Landing;
