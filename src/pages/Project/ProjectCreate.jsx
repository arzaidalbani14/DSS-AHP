import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
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
      toast.error("Project name is required");
      return;
    }

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

    addProject(newProject);
    setCurrentProjectId(projectId);

    toast.success(`Project "${name.trim()}" has been created!`);
    navigate(`/project/${projectId}`);
  };

  return (
    <MainLayout title="New Project">
      <div style={{ maxWidth: "600px" }}>
        <h2 className="mb-2">Create New Decision Project</h2>
        <p className="text-muted mb-4">
          Determine the decision problem to solve using AHP
        </p>

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Project Name<span style={{ color: "#fa3636ff" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="For example: Choosing Laptop"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Description (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the decision purpose in short"
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  Create Project
                </Button>
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
}

export default ProjectCreate;
