import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = useDecisionStore((s) => s.getProjectById(id));
  const setCurrentProjectId = useDecisionStore((s) => s.setCurrentProjectId);
  const computeProjectStatus = useDecisionStore((s) => s.computeProjectStatus);
  const updateProject = useDecisionStore((s) => s.updateProject);

  // Set as current project when viewing
  useEffect(() => {
    if (project) {
      setCurrentProjectId(id);
    }
  }, [project, id, setCurrentProjectId]);

  // Sync computed status to project
  useEffect(() => {
    if (!project) return;
    const computedStatus = computeProjectStatus(id);
    if (project.status !== computedStatus) {
      updateProject(id, { status: computedStatus });
    }
  }, [project, id, computeProjectStatus, updateProject]);

  // Not found state
  if (!project) {
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

  // Get AHP data from project
  const criteria = project.criteria || [];
  const alternatives = project.alternatives || [];
  const criteriaWeights = project.criteriaWeights || [];
  const alternativeWeights = project.alternativeWeights || {};
  const finalResult = project.finalResult || [];

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
    <MainLayout title={project.name}>
      {/* Project Info Card */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ margin: 0 }}>{project.name}</h2>
            <p style={{ color: "#6b7280", marginTop: "8px" }}>
              {project.description || "Tidak ada deskripsi"}
            </p>
          </div>
          <span style={statusBadge(project.status)}>
            {renderStatus(project.status)}
          </span>
        </div>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginTop: "12px" }}>
          Dibuat: {project.createdAt} | Terakhir diubah: {project.updatedAt}
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

      <div style={{ marginTop: "32px" }}>
        <button onClick={() => navigate("/dashboard")} style={secondaryButton}>
          ← Kembali ke Dashboard
        </button>
      </div>
    </MainLayout>
  );
}

// Helper render status
const renderStatus = (status) => {
  switch (status) {
    case "draft":
      return "Draft";
    case "progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return "-";
  }
};

// Styles
const notFoundStyle = {
  padding: "32px",
  textAlign: "center",
  border: "1px dashed #d1d5db",
  borderRadius: "8px",
};

const cardStyle = {
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  background: "#fff",
};

const statusBadge = (status) => ({
  padding: "4px 12px",
  borderRadius: "9999px",
  fontSize: "12px",
  fontWeight: 600,
  background:
    status === "completed"
      ? "#d1fae5"
      : status === "progress"
        ? "#dbeafe"
        : "#f3f4f6",
  color:
    status === "completed"
      ? "#065f46"
      : status === "progress"
        ? "#1e40af"
        : "#374151",
});

const stepsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "16px",
};

const stepCard = (status) => ({
  padding: "16px",
  border: status === "done" ? "2px solid #10b981" : "1px solid #e5e7eb",
  borderRadius: "8px",
  background: status === "done" ? "#ecfdf5" : "#fff",
  cursor: "pointer",
});

const checkMark = {
  color: "#10b981",
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
