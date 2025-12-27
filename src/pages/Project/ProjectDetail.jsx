import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const projects = useDecisionStore((s) => s.projects);
  const setProject = useDecisionStore((s) => s.setProject);
  const criteria = useDecisionStore((s) => s.criteria);
  const alternatives = useDecisionStore((s) => s.alternatives);
  const criteriaWeights = useDecisionStore((s) => s.criteriaWeights);
  const alternativeWeights = useDecisionStore((s) => s.alternativeWeights);
  const finalResult = useDecisionStore((s) => s.finalResult);

  // Find current project
  const currentProject = projects.find((p) => p.id === id);

  // Set as active project
  useEffect(() => {
    if (currentProject) {
      setProject(currentProject);
    }
  }, [currentProject, setProject]);

  // Not found state
  if (!currentProject) {
    return (
      <MainLayout title="Project Not Found">
        <div style={notFoundStyle}>
          <h2>Project Tidak Ditemukan</h2>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>
            Project dengan ID "{id}" tidak ada atau sudah dihapus.
          </p>
          <button onClick={() => navigate("/dashboard")} style={primaryButton}>
            Kembali ke Dashboard
          </button>
        </div>
      </MainLayout>
    );
  }

  // AHP Steps with status
  const steps = [
    {
      label: "1. Criteria",
      path: `/project/${id}/criteria`,
      status: criteria.length > 0 ? "done" : "pending",
      desc: `${criteria.length} kriteria`,
    },
    {
      label: "2. Alternatives",
      path: `/project/${id}/alternatives`,
      status: alternatives.length > 0 ? "done" : "pending",
      desc: `${alternatives.length} alternatif`,
    },
    {
      label: "3. Compare Criteria",
      path: `/project/${id}/compare-criteria`,
      status: criteriaWeights.length > 0 ? "done" : "pending",
      desc: criteriaWeights.length > 0 ? "Completed" : "Belum",
    },
    {
      label: "4. Compare Alternatives",
      path: `/project/${id}/compare-alternatives`,
      status: Object.keys(alternativeWeights || {}).length > 0 ? "done" : "pending",
      desc: "Per kriteria",
    },
    {
      label: "5. Result",
      path: `/project/${id}/result`,
      status: finalResult.length > 0 ? "done" : "pending",
      desc: finalResult.length > 0 ? "Ready" : "Belum",
    },
  ];

  return (
    <MainLayout title={currentProject.name}>
      {/* Project Info Card */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ margin: 0 }}>{currentProject.name}</h2>
            <p style={{ color: "#6b7280", marginTop: "8px" }}>
              {currentProject.description || "Tidak ada deskripsi"}
            </p>
          </div>
          <span style={statusBadge(currentProject.status)}>
            {renderStatus(currentProject.status)}
          </span>
        </div>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginTop: "12px" }}>
          Dibuat: {currentProject.createdAt} | Terakhir diubah: {currentProject.updatedAt}
        </p>
      </div>

      {/* AHP Flow Steps */}
      <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Langkah AHP</h3>
      <div style={stepsGrid}>
        {steps.map((step) => (
          <div
            key={step.path}
            onClick={() => navigate(step.path)}
            style={stepCard(step.status)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{step.label}</strong>
              {step.status === "done" && <span style={checkMark}>✓</span>}
            </div>
            <span style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px", display: "block" }}>
              {step.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "32px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={secondaryButton}
        >
          ← Kembali ke Dashboard
        </button>
      </div>
    </MainLayout>
  );
}

// ========= HELPERS =========
const renderStatus = (status) => {
  switch (status) {
    case "draft":
      return "Draft";
    case "progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};

// ========= STYLES =========
const notFoundStyle = {
  textAlign: "center",
  padding: "48px",
};

const cardStyle = {
  padding: "24px",
  background: "#f9fafb",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const statusBadge = (status) => ({
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: 500,
  background: status === "completed" ? "#d1fae5" : status === "progress" ? "#dbeafe" : "#f3f4f6",
  color: status === "completed" ? "#065f46" : status === "progress" ? "#1e40af" : "#374151",
});

const stepsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "16px",
};

const stepCard = (status) => ({
  padding: "16px",
  borderRadius: "10px",
  border: `2px solid ${status === "done" ? "#10b981" : "#e5e7eb"}`,
  background: status === "done" ? "#ecfdf5" : "#fff",
  cursor: "pointer",
  transition: "all 0.2s ease",
});

const checkMark = {
  color: "#10b981",
  fontSize: "18px",
  fontWeight: "bold",
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

export default ProjectDetail;
