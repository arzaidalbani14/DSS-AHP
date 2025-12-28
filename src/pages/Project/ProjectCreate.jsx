import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
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
      alert("Nama project wajib diisi");
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

    console.log("PROJECT CREATED:", newProject);
    navigate(`/project/${projectId}`);
  };

  return (
    <MainLayout title="New Project">
      <div style={{ maxWidth: "600px" }}>
        <h2 className="mb-2">Buat Project Keputusan</h2>
        <p className="text-muted mb-4">
          Tentukan masalah keputusan yang akan dianalisis menggunakan AHP
        </p>

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Project *</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Pemilihan Laptop"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Deskripsi (opsional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan singkat tujuan keputusan"
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  Buat Project
                </Button>
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => navigate("/dashboard")}
                >
                  Batal
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
