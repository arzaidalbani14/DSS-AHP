import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

function Dashboard() {
  const navigate = useNavigate();

  // ===== MOCK DATA (sementara, tanpa backend) =====
  const [projects] = useState([
    {
      id: "1",
      name: "Pemilihan Laptop",
      status: "draft",
      updatedAt: "2025-01-10",
    },
    {
      id: "2",
      name: "Pemilihan Supplier",
      status: "progress",
      updatedAt: "2025-01-12",
    },
  ]);

  const renderStatus = (status) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "progress":
        return "In Progress";
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
