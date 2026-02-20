import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Table, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
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
      toast.success(`Project "${projectName}" berhasil dihapus`);
    }
  };

  const getStatusBadge = (status) => {
    const badgeStyle = {
      padding: "0.5em 0.8em",
      fontWeight: "600",
      letterSpacing: "0.3px",
      borderRadius: "20px"
    };

    switch (status) {
      case "draft":
        return <Badge bg="secondary" style={badgeStyle}>Draft</Badge>;
      case "progress":
        return <Badge bg="primary" style={badgeStyle}>In Progress</Badge>;
      case "completed":
        return <Badge bg="success" style={badgeStyle}>Completed</Badge>;
      default:
        return <Badge bg="light" text="dark" style={badgeStyle}>-</Badge>;
    }
  };

  return (
    <MainLayout title="Dashboard">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1 fw-bold text-dark">Welcome Back</h2>
            <p className="text-muted mb-0">
              Manage your decision support projects efficiently.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/project/new")}
            style={{ padding: "0.6rem 1.5rem", borderRadius: "8px", fontWeight: "600", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}
          >
            New Project
          </Button>
        </div>

        {/* Project List / Empty State */}
        {projects.length === 0 ? (
          <Card className="text-center py-5 glass-card" style={{ border: "2px dashed #cbd5e1", background: "rgba(255,255,255,0.4)" }}>
            <Card.Body>
              <div className="mb-3 text-muted" style={{ fontSize: "3rem", opacity: 0.5 }}>📂</div>
              <h5 className="text-muted mb-3">No projects found</h5>
              <p className="text-muted mb-4 small">Start by creating a new decision analysis project.</p>
              <Button variant="outline-primary" onClick={() => navigate("/project/new")}>
                Create New Project
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Card className="glass-card border-0 overflow-hidden">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 ps-4 border-bottom text-muted small text-uppercase fw-bold" style={{ backgroundColor: "#f8fafc" }}>Project Name</th>
                    <th className="py-3 border-bottom text-muted small text-uppercase fw-bold" style={{ backgroundColor: "#f8fafc" }}>Status</th>
                    <th className="py-3 border-bottom text-muted small text-uppercase fw-bold" style={{ backgroundColor: "#f8fafc" }}>Last Updated</th>
                    <th className="py-3 pe-4 border-bottom text-end text-muted small text-uppercase fw-bold" style={{ backgroundColor: "#f8fafc" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      style={{ transition: "background-color 0.2s" }}
                    >
                      <td className="ps-4 py-3 fw-medium text-dark">{project.name}</td>
                      <td className="py-3">{getStatusBadge(project.status)}</td>
                      <td className="py-3 text-muted small">{project.updatedAt}</td>
                      <td className="pe-4 py-3 text-end">
                        <Button
                          variant="light"
                          size="sm"
                          className="me-2 text-primary fw-medium"
                          onClick={() => navigate(`/project/${project.id}`)}
                          style={{ background: "rgba(37, 99, 235, 0.1)", border: "none" }}
                        >
                          Open
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="text-danger fw-medium"
                          onClick={() => handleDelete(project.id, project.name)}
                          style={{ background: "rgba(239, 68, 68, 0.1)", border: "none" }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        )}
      </motion.div>
    </MainLayout>
  );
}

export default Dashboard;
