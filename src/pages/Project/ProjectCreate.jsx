import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function ProjectCreate() {
  const navigate = useNavigate();
  const addProject = useDecisionStore((s) => s.addProject);
  const resetAhpData = useDecisionStore((s) => s.resetAhpData);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Nama project wajib diisi");
      return;
    }

    // ===== CREATE NEW PROJECT =====
    const now = new Date().toISOString().slice(0, 10);

    const newProject = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    // Reset AHP data from previous project
    resetAhpData();

    console.log("PROJECT CREATED:", newProject);
    addProject(newProject);

    // nanti: simpan ke storage / backend
    // sekarang: langsung redirect
    navigate(`/project/${newProject.id}`);
  };

  return (
    <MainLayout title="New Project">
      <div style={{ maxWidth: "600px" }}>
        <h2>Buat Project Keputusan</h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Tentukan masalah keputusan yang akan dianalisis menggunakan AHP
        </p>

        <form onSubmit={handleSubmit}>
          {/* ===== NAMA PROJECT ===== */}
          <div style={{ marginBottom: "16px" }}>
            <label>Nama Project *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Pemilihan Laptop"
              style={inputStyle}
            />
          </div>

          {/* ===== DESKRIPSI ===== */}
          <div style={{ marginBottom: "24px" }}>
            <label>Deskripsi (opsional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan singkat tujuan keputusan"
              rows={4}
              style={inputStyle}
            />
          </div>

          {/* ===== ACTIONS ===== */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit" style={primaryButton}>
              Buat Project
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={secondaryButton}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};

const primaryButton = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const secondaryButton = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};

export default ProjectCreate;
