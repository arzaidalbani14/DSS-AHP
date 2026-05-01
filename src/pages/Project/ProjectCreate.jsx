import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";
import { useLanguage } from "../../store/LanguageContext";

function ProjectCreate() {
  const navigate = useNavigate();
  const addProject = useDecisionStore((s) => s.addProject);
  const setCurrentProjectId = useDecisionStore((s) => s.setCurrentProjectId);
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("projectName") + " " + t("status").toLowerCase() + " " + t("isRequired") || "is required");
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

    toast.success(`Project "${name.trim()}" ` + t("hasBeenCreated") + "!");
    navigate(`/project/${projectId}`);
  };

  return (
    <MainLayout title={t("createNewProject")}>
      <div style={{ maxWidth: "600px" }}>
        <h2 className="mb-2">{t("createNewProject")}</h2>
        <p className="text-muted mb-4">
          {t("determineDecision")}
        </p>

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{t("projectName")}<span style={{ color: "#fa3636ff" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("exampleProject")}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>{t("projectDescription")} ({t("optional")})</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("exampleDescription")}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  {t("createNewProject")}
                </Button>
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => navigate("/dashboard")}
                >
                  {t("cancel")}
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
