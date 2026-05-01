import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card, ListGroup, InputGroup } from "react-bootstrap";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";
import { useLanguage } from "../../store/LanguageContext";

function CriteriaPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectCriteria = useDecisionStore((s) => s.setProjectCriteria);

  const criteria = project?.criteria || [];

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCriteria = {
      id: Date.now().toString(),
      name: name.trim(),
    };

    setProjectCriteria(projectId, [...criteria, newCriteria]);
    setName("");
  };

  const handleDelete = (id) => {
    setProjectCriteria(projectId, criteria.filter((c) => c.id !== id));
  };

  const handleEditStart = (crit) => {
    setEditingId(crit.id);
    setEditingName(crit.name);
  };

  const handleEditSave = (id) => {
    if (!editingName.trim()) return;

    const updated = criteria.map((c) =>
      c.id === id ? { ...c, name: editingName.trim() } : c
    );

    setProjectCriteria(projectId, updated);
    setEditingId(null);
    setEditingName("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  if (!project) {
    return (
      <MainLayout title={t("criteria")}>
        <p className="text-muted">Project not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t("criteria")}>
      <h2 className="mb-4">{t("criteria")} {t("results")}</h2>

      {/* Add Criteria Form */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAdd}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={t("criteriaName") + " (for example: Price)"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button variant="primary" type="submit">
                {t("addCriteria")}
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {/* Criteria List */}
      {criteria.length === 0 ? (
        <Card className="text-center py-4 glass-card-empty" style={{ border: "2px dashed #cbd5e1" }}>
          <Card.Body>
            <p className="text-muted mb-0">{t("noCriteria")}</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {criteria.map((c, index) => (
              <ListGroup.Item key={c.id} className="d-flex align-items-center gap-2">
                <span className="text-muted text-end me-2" style={{ width: "24px", display: "inline-block" }}>{index + 1}.</span>
                {editingId === c.id ? (
                  <>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-grow-1"
                    />
                    <Button size="sm" variant="success" onClick={() => handleEditSave(c.id)}>
                      {t("save")}
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleEditCancel}>
                      {t("cancel")}
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow-1">{c.name}</span>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEditStart(c)}>
                      {t("edit")}
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c.id)}>
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
          onClick={() => navigate(`/project/${projectId}`)}
        >
          {t("backToOverview")}
        </Button>
        <Button
          variant="primary"
          className="fw-medium px-4"
          disabled={criteria.length === 0}
          onClick={() => navigate(`/project/${projectId}/alternatives`)}
        >
          Next: {t("alternatives")}
        </Button>
      </div>
    </MainLayout>
  );
}

export default CriteriaPage;
