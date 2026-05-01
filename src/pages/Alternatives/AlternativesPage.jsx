import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card, ListGroup, InputGroup } from "react-bootstrap";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";
import { useLanguage } from "../../store/LanguageContext";

function AlternativesPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectAlternatives = useDecisionStore((s) => s.setProjectAlternatives);

  const alternatives = project?.alternatives || [];

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAlternative = {
      id: Date.now().toString(),
      name: name.trim(),
    };

    setProjectAlternatives(projectId, [...alternatives, newAlternative]);
    setName("");
  };

  const handleDelete = (id) => {
    setProjectAlternatives(projectId, alternatives.filter((a) => a.id !== id));
  };

  const handleEditStart = (alt) => {
    setEditingId(alt.id);
    setEditingName(alt.name);
  };

  const handleEditSave = (id) => {
    if (!editingName.trim()) return;

    const updated = alternatives.map((a) =>
      a.id === id ? { ...a, name: editingName.trim() } : a
    );

    setProjectAlternatives(projectId, updated);
    setEditingId(null);
    setEditingName("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  if (!project) {
    return (
      <MainLayout title={t("alternatives")}>
        <p className="text-muted">Project not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t("alternatives")}>
      <h2 className="mb-4">{t("alternatives")} {t("results")}</h2>

      {/* Add Alternative Form */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAdd}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={t("alternativeName") + " (for example: Laptop A)"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button variant="primary" type="submit">
                {t("addAlternative")}
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {/* Alternatives List */}
      {alternatives.length === 0 ? (
        <Card className="text-center py-4 glass-card-empty" style={{ border: "2px dashed #cbd5e1" }}>
          <Card.Body>
            <p className="text-muted mb-0">{t("noAlternatives")}</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {alternatives.map((alt, index) => (
              <ListGroup.Item key={alt.id} className="d-flex align-items-center gap-2">
                <span className="text-muted text-end me-2" style={{ width: "24px", display: "inline-block" }}>{index + 1}.</span>
                {editingId === alt.id ? (
                  <>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-grow-1"
                    />
                    <Button size="sm" variant="success" onClick={() => handleEditSave(alt.id)}>
                      {t("save")}
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleEditCancel}>
                      {t("cancel")}
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow-1">{alt.name}</span>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEditStart(alt)}>
                      {t("edit")}
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(alt.id)}>
                      {t("delete")}
                    </Button>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="d-grid gap-3 d-md-flex justify-content-md-between mt-4 pt-3 border-top border-light">
        <Button
          variant="light"
          className="btn-light-secondary fw-medium"
          onClick={() => navigate(`/project/${projectId}/criteria`)}
        >
          Back to {t("criteria")}
        </Button>
        <Button
          variant="primary"
          className="fw-medium px-4"
          disabled={project?.criteria?.length < 2 || alternatives.length === 0}
          onClick={() => navigate(`/project/${projectId}/compare-criteria`)}
        >
          {t("compareCriteria")}
        </Button>
      </div>
    </MainLayout>
  );
}

export default AlternativesPage;
