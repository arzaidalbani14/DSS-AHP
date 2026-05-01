import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Table, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";
import { useLanguage } from "../../store/LanguageContext";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Get projects from store
  const projects = useDecisionStore((s) => s.projects);
  const deleteProject = useDecisionStore((s) => s.deleteProject);

  const handleDelete = (projectId, projectName) => {
    if (window.confirm(`Delete project "${projectName}"?`)) {
      deleteProject(projectId);
      toast.success(`Project "${projectName}" ${t("delete")}d`);
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
        return <Badge bg="secondary" style={badgeStyle}>{t("draft")}</Badge>;
      case "progress":
        return <Badge bg="primary" style={badgeStyle}>{t("inProgress")}</Badge>;
      case "completed":
        return <Badge bg="success" style={badgeStyle}>{t("completed")}</Badge>;
      default:
        return <Badge bg="light" text="dark" style={badgeStyle}>-</Badge>;
    }
  };

  return (
    <MainLayout title={t("dashboard")}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="mb-1 fw-bold text-dark fs-3">{t("welcome")}</h2>
            <p className="text-muted mb-0 fs-6">
              {t("myProjects")}
            </p>
          </div>
          <div className="d-grid d-md-block">
            <Button
              variant="primary"
              onClick={() => navigate("/project/new")}
              style={{ padding: "0.6rem 1.5rem", borderRadius: "8px", fontWeight: "600", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}
            >
              {t("createNewProject")}
            </Button>
          </div>
        </div>

        {/* Project List / Empty State */}
        {projects.length === 0 ? (
          <Card className="text-center py-5 glass-card-empty" style={{ border: "2px dashed #cbd5e1" }}>
            <Card.Body>
              <div className="mb-3 text-muted" style={{ fontSize: "3rem", opacity: 0.5 }}>📂</div>
              <h5 className="text-muted mb-3">{t("noProjects")}</h5>
              <p className="text-muted mb-4 small">{t("minRequired")}</p>
              <Button variant="outline-primary" onClick={() => navigate("/project/new")}>
                {t("createNewProject")}
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Card className="glass-card border-0 overflow-hidden">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-2 px-md-4 border-bottom text-muted small text-uppercase fw-bold">{t("projectName")}</th>
                    <th className="py-3 px-2 border-bottom text-muted small text-uppercase fw-bold">{t("status")}</th>
                    <th className="py-3 px-2 border-bottom text-muted small text-uppercase fw-bold d-none d-md-table-cell">Last Updated</th>
                    <th className="py-3 px-2 px-md-4 border-bottom text-end text-muted small text-uppercase fw-bold">{t("delete")}</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      style={{ transition: "background-color 0.2s", cursor: "pointer" }}
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <td className="px-2 px-md-4 py-3 fw-medium text-dark">{project.name}</td>
                      <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>{getStatusBadge(project.status)}</td>
                      <td className="px-2 py-3 text-muted small d-none d-md-table-cell">{project.updatedAt}</td>
                      <td className="px-2 px-md-4 py-3 text-end text-nowrap">
                        <Button
                          variant="light"
                          size="sm"
                          className="me-2 text-primary fw-medium btn-light-primary"
                          onClick={(e) => { e.stopPropagation(); navigate(`/project/${project.id}`); }}
                        >
                          {t("edit")}
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="text-danger fw-medium btn-light-danger"
                          onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.name); }}
                        >
                          {t("delete")}
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
