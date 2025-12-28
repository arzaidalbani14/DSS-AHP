import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Table, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
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
    switch (status) {
      case "draft":
        return <Badge bg="secondary">Draft</Badge>;
      case "progress":
        return <Badge bg="primary">In Progress</Badge>;
      case "completed":
        return <Badge bg="success">Completed</Badge>;
      default:
        return <Badge bg="light" text="dark">-</Badge>;
    }
  };

  return (
    <MainLayout title="Dashboard">
      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-1">Dashboard</h2>
        <p className="text-muted">
          Kelola dan lanjutkan proses pengambilan keputusan
        </p>
      </div>

      {/* Action Button */}
      <div className="mb-4">
        <Button variant="primary" onClick={() => navigate("/project/new")}>
          + New Project
        </Button>
      </div>

      {/* Project List / Empty State */}
      {projects.length === 0 ? (
        <Card className="text-center py-5" style={{ borderStyle: "dashed" }}>
          <Card.Body>
            <p className="text-muted mb-3">Belum ada project keputusan.</p>
            <Button variant="primary" onClick={() => navigate("/project/new")}>
              Buat Project Baru
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Nama Project</th>
                <th>Status</th>
                <th>Terakhir Diubah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="align-middle">{project.name}</td>
                  <td className="align-middle">{getStatusBadge(project.status)}</td>
                  <td className="align-middle">{project.updatedAt}</td>
                  <td className="align-middle">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      Buka
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(project.id, project.name)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </MainLayout>
  );
}

export default Dashboard;
