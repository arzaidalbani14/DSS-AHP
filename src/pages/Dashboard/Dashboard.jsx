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
    if (window.confirm(`Delete project "${projectName}"?`)) {
      deleteProject(projectId);
      toast.success(`Project "${projectName}" has been deleted`);
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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="mb-1 fw-bold text-dark fs-3">Welcome Back</h2>
            <p className="text-muted mb-0 fs-6">
              Manage your decision support projects efficiently.
            </p>
          </div>
          <div className="d-grid d-md-block">
            <Button
              variant="primary"
              onClick={() => navigate("/project/new")}
              style={{ padding: "0.6rem 1.5rem", borderRadius: "8px", fontWeight: "600", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Project List / Empty State */}
        {projects.length === 0 ? (
          <Card className="text-center py-5 glass-card-empty" style={{ border: "2px dashed #cbd5e1" }}>
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
                    <th className="py-3 px-2 px-md-4 border-bottom text-muted small text-uppercase fw-bold">Project Name</th>
                    <th className="py-3 px-2 border-bottom text-muted small text-uppercase fw-bold">Status</th>
                    <th className="py-3 px-2 border-bottom text-muted small text-uppercase fw-bold d-none d-md-table-cell">Last Updated</th>
                    <th className="py-3 px-2 px-md-4 border-bottom text-end text-muted small text-uppercase fw-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      style={{ transition: "background-color 0.2s" }}
                    >
                      <td className="px-2 px-md-4 py-3 fw-medium text-dark">{project.name}</td>
                      <td className="px-2 py-3">{getStatusBadge(project.status)}</td>
                      <td className="px-2 py-3 text-muted small d-none d-md-table-cell">{project.updatedAt}</td>
                      <td className="px-2 px-md-4 py-3 text-end text-nowrap">
                        <Button
                          variant="light"
                          size="sm"
                          className="me-2 text-primary fw-medium btn-light-primary"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          Open
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="text-danger fw-medium btn-light-danger"
                          onClick={() => handleDelete(project.id, project.name)}
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
