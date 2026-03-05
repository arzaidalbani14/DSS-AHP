import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Badge, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = useDecisionStore((s) => s.getProjectById(id));
  const setCurrentProjectId = useDecisionStore((s) => s.setCurrentProjectId);
  const computeProjectStatus = useDecisionStore((s) => s.computeProjectStatus);
  const updateProject = useDecisionStore((s) => s.updateProject);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Set as current project when viewing
  useEffect(() => {
    if (project) {
      setCurrentProjectId(id);
    }
  }, [project, id, setCurrentProjectId]);

  // Sync computed status to project
  const prevStatusRef = useRef(null);
  useEffect(() => {
    if (!project) return;
    const computedStatus = computeProjectStatus(id);
    if (project.status !== computedStatus && prevStatusRef.current !== computedStatus) {
      prevStatusRef.current = computedStatus;
      updateProject(id, { status: computedStatus });
    }
  }, [project, id, computeProjectStatus, updateProject]);

  // Edit modal handlers
  const handleOpenEditModal = () => {
    setEditName(project.name);
    setEditDescription(project.description || "");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }

    updateProject(id, {
      name: editName.trim(),
      description: editDescription.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    toast.success("Project updated successfully");
    setShowEditModal(false);
  };

  // Not found state
  if (!project) {
    return (
      <MainLayout title="Project Not Found">
        <Card className="text-center py-5">
          <Card.Body>
            <h4>Project not Found</h4>
            <p className="text-muted mb-3">
              Project with id "{id}" does not exist or has been deleted.
            </p>
            <Button variant="primary" onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </Card.Body>
        </Card>
      </MainLayout>
    );
  }

  // Get AHP data from project
  const criteria = project.criteria || [];
  const alternatives = project.alternatives || [];
  const criteriaWeights = project.criteriaWeights || [];
  const alternativeWeights = project.alternativeWeights || {};
  const finalResult = project.finalResult || [];

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

  // AHP Steps with status and prerequisites
  // "done" = has valid data AND prerequisites are met
  const steps = [
    {
      label: "1. Criteria",
      path: `/project/${id}/criteria`,
      done: criteria.length > 0,
      enabled: true, // Always accessible
      desc: `${criteria.length} criteria`,
    },
    {
      label: "2. Alternatives",
      path: `/project/${id}/alternatives`,
      done: criteria.length >= 1 && alternatives.length > 0, // Done only if criteria exists
      enabled: criteria.length >= 1,
      desc: `${alternatives.length} alternative${alternatives.length != 1 ? 's' : ''}`,
    },
    {
      label: "3. Compare Criteria",
      path: `/project/${id}/compare-criteria`,
      done: criteria.length >= 2 && criteriaWeights.length > 0 && criteriaWeights.length === criteria.length,
      enabled: criteria.length >= 2,
      desc: (criteria.length >= 2 && criteriaWeights.length === criteria.length) ? "Completed" : "Unfinished",
    },
    {
      label: "4. Compare Alternatives",
      path: `/project/${id}/compare-alternatives`,
      done: criteria.length >= 1 && alternatives.length >= 2 && criteriaWeights.length === criteria.length && Object.keys(alternativeWeights || {}).length > 0,
      enabled: criteria.length >= 1 && alternatives.length >= 2 && criteriaWeights.length === criteria.length,
      desc: "Per Criteria",
    },
    {
      label: "5. Result",
      path: `/project/${id}/result`,
      done: criteria.length >= 1 && alternatives.length >= 2 && finalResult.length > 0,
      enabled: (
        criteria.length >= 1 &&
        alternatives.length >= 2 &&
        criteriaWeights.length === criteria.length &&
        Object.keys(alternativeWeights || {}).length > 0
      ) || finalResult.length > 0,
      desc: finalResult.length > 0 ? "Ready" : "Unfinished",
    },
  ];

  return (
    <MainLayout title={project.name}>
      {/* Project Info Card */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h3 className="mb-2">{project.name}</h3>
              <p className="text-muted mb-0">
                {project.description || "No Description"}
              </p>
            </div>
            <div className="d-flex flex-column align-items-end gap-2">
              {getStatusBadge(project.status)}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleOpenEditModal}
              >
                Edit Project
              </Button>
            </div>
          </div>
          <small className="text-muted d-block mt-3">
            Created at: {project.createdAt} | Updated at: {project.updatedAt}
          </small>
        </Card.Body>
      </Card>

      {/* AHP Flow Steps */}
      <h5 className="mb-3">Steps of AHP</h5>
      <Row className="g-3 mb-4">
        {steps.map((step) => (
          <Col key={step.path} xs={12} sm={6} md={4} lg={3}>
            <Card
              className={`h-100 step-card ${step.done ? 'border-success' : ''} ${!step.enabled ? 'opacity-50' : ''}`}
              style={{
                cursor: step.enabled ? "pointer" : "not-allowed"
              }}
              onClick={() => step.enabled && navigate(step.path)}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{step.label}</strong>
                  {step.done && <span className="text-success fw-bold">✓</span>}
                </div>
                <small className="opacity-75">{step.desc}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-grid gap-3 d-md-flex justify-content-md-between mt-4">
        <Button
          variant="light"
          className="btn-light-primary fw-medium"
          onClick={() => navigate("/dashboard")}
        >
          Return to Dashboard
        </Button>
        <Button
          variant="primary"
          className="fw-medium px-4"
          onClick={() => navigate(`/project/${id}/criteria`)}
        >
          Start AHP Process (Criteria)
        </Button>
      </div>

      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter project name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter project description (optional)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
}

export default ProjectDetail;
