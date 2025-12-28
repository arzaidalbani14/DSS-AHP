import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function Dashboard() {
  const navigate = useNavigate();

  // Get projects from store
  const projects = useDecisionStore((s) => s.projects);
  const deleteProject = useDecisionStore((s) => s.deleteProject);

  const handleDelete = (projectId, projectName) => {
    if (window.confirm(`Hapus project "${projectName}"?`)) {
      deleteProject(projectId);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "ready":
        return "Ready";
      default:
        return "-";
    }
  };

  return (
    <MainLayout title="Dashboard">
      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: "24px" }}>
        <h2>Dashboard</h2>
        <p style={{ color: "#6b7280" }}>
          Kelola dan lanjutkan proses pengambilan keputusan
        </p>
      </div>

      {/* ===== PRIMARY ACTION ===== */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => navigate("/project/new")}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          + New Project
        </button>
      </div>

      {/* ===== PROJECT LIST / EMPTY STATE ===== */}
      {projects.length === 0 ? (
        <div
          style={{
            padding: "32px",
            border: "1px dashed #d1d5db",
            borderRadius: "8px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          <p>Belum ada project keputusan.</p>
          <button
            onClick={() => navigate("/project/new")}
            style={{
              marginTop: "16px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Buat Project Baru
          </button>
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={th}>Nama Project</th>
              <th style={th}>Status</th>
              <th style={th}>Terakhir Diubah</th>
              <th style={th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={td}>{project.name}</td>
                <td style={td}>{renderStatus(project.status)}</td>
                <td style={td}>{project.updatedAt}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => navigate(`/project/${project.id}`)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #2563eb",
                        background: "transparent",
                        color: "#2563eb",
                        cursor: "pointer",
                      }}
                    >
                      Buka
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ef4444",
                        background: "transparent",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MainLayout>
  );
}

const th = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "1px solid #e5e7eb",
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #e5e7eb",
};

export default Dashboard;
