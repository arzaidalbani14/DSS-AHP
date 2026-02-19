import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../store/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simpan user data dan redirect ke dashboard
        login({ email });
        navigate("/dashboard");
    };

    return (
        <div className="login-page">
            {/* Back to home link */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{ position: "absolute", top: "24px", left: "24px" }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "var(--text-muted)",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-color)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                    ← Kembali
                </Link>
            </motion.div>

            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                    </motion.div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text-main)" }}>
                        Welcome
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                        Sign in to continue to DSS AHP
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label
                            htmlFor="login-email"
                            style={{
                                display: "block",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                color: "var(--text-main)",
                                marginBottom: "6px",
                            }}>
                            Email Address
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="login-email"
                                type="email"
                                className="form-control"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: "15px" }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <label
                                htmlFor="login-password"
                                style={{
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    color: "var(--text-main)",
                                    margin: 0,
                                }}
                            >
                                Password
                            </label>
                            <a
                                href="#"
                                style={{
                                    fontSize: "0.8rem",
                                    color: "var(--primary-color)",
                                    textDecoration: "none",
                                    fontWeight: "500",
                                }}
                                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div style={{ position: "relative" }}>
                            <span style={{
                                position: "absolute",
                                left: "14px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--text-muted)",
                                fontSize: "1rem",
                                pointerEvents: "none",
                            }}>
                            </span>
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingLeft: "15px", paddingRight: "46px" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--text-muted)",
                                    fontSize: "0.85rem",
                                    padding: "4px 6px",
                                }}
                            >
                                {showPassword ? "👁" : "👁"}
                            </button>
                        </div>
                    </div>

                    {/* Sign In Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.01, boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(135deg, var(--primary-color), #4f46e5)",
                            color: "#fff",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                            transition: "all 0.2s",
                        }}
                    >
                        Sign In
                    </motion.button>
                </form>

                {/* Divider */}
                <div className="login-divider">
                    <span>or continue with</span>
                </div>

                {/* Google Button */}
                <motion.button
                    type="button"
                    className="google-btn"
                    whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => console.log("Google login clicked")}
                >
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    Continue with Google
                </motion.button>

                {/* Register Link */}
                <div style={{
                    textAlign: "center",
                    marginTop: "1.75rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid #e2e8f0",
                }}>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Don't have an account?{" "}
                        <Link
                            to="/createaccount"
                            style={{
                                color: "var(--primary-color)",
                                textDecoration: "none",
                                fontWeight: "600",
                            }}
                            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                        >
                            Create new
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginPage;
