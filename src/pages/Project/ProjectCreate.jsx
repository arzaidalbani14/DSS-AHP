import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function ProjectCreate() {
  const navigate = useNavigate();
  const addProject = useDecisionStore((s) => s.addProject);
  const setCurrentProjectId = useDecisionStore((s) => s.setCurrentProjectId);

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
    const projectId = Date.now().toString();

    const newProject = {
      id: projectId,
      name: name.trim(),
      description: description.trim(),
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    // Add project (AHP data is automatically included via createEmptyAhpData)
    addProject(newProject);

    // Set as current project
    setCurrentProjectId(projectId);

    console.log("PROJECT CREATED:", newProject);
    navigate(`/project/${projectId}`);
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
