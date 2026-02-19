import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../store/AuthContext";

function CreateAccountPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Simpan user data dan redirect ke dashboard
        login({ email, firstName, lastName });
        navigate("/dashboard");
    };

    return (
        <div className="login-page">
            {/* Back to login link */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{ position: "absolute", top: "24px", left: "24px" }}
            >
                <Link
                    to="/login"
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
                    ← Kembali ke Login
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
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text-main)" }}>
                        Create Account
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                        Sign up to get started with DSS AHP
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#dc2626",
                        fontSize: "0.85rem",
                        marginBottom: "1rem",
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* First Name & Last Name */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="first-name"
                                style={{
                                    display: "block",
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    color: "var(--text-main)",
                                    marginBottom: "6px",
                                }}>
                                First Name
                            </label>
                            <input
                                id="first-name"
                                type="text"
                                className="form-control"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                style={{ paddingLeft: "15px" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="last-name"
                                style={{
                                    display: "block",
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    color: "var(--text-main)",
                                    marginBottom: "6px",
                                }}>
                                Last Name
                            </label>
                            <input
                                id="last-name"
                                type="text"
                                className="form-control"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                style={{ paddingLeft: "15px" }}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label
                            htmlFor="create-email"
                            style={{
                                display: "block",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                color: "var(--text-main)",
                                marginBottom: "6px",
                            }}>
                            Email Address
                        </label>
                        <input
                            id="create-email"
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ paddingLeft: "15px" }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label
                            htmlFor="create-password"
                            style={{
                                display: "block",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                color: "var(--text-main)",
                                marginBottom: "6px",
                            }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="create-password"
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Create a password"
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
                                👁
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label
                            htmlFor="confirm-password"
                            style={{
                                display: "block",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                color: "var(--text-main)",
                                marginBottom: "6px",
                            }}>
                            Confirm Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ paddingLeft: "15px", paddingRight: "46px" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                👁
                            </button>
                        </div>
                    </div>

                    {/* Create Account Button */}
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
                        Create Account
                    </motion.button>
                </form>

                {/* Login Link */}
                <div style={{
                    textAlign: "center",
                    marginTop: "1.75rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid #e2e8f0",
                }}>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            style={{
                                color: "var(--primary-color)",
                                textDecoration: "none",
                                fontWeight: "600",
                            }}
                            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default CreateAccountPage;
