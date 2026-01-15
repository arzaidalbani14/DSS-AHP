import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Card, ListGroup, InputGroup } from "react-bootstrap";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function CriteriaPage() {
  const { id: projectId } = useParams();

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
      <MainLayout title="Criteria">
        <p className="text-muted">Project tidak ditemukan.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Criteria">
      <h2 className="mb-4">Manajemen Kriteria</h2>

      {/* Add Criteria Form */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAdd}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Nama kriteria (contoh: Harga)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button variant="primary" type="submit">
                Tambah
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {/* Criteria List */}
      {criteria.length === 0 ? (
        <Card className="text-center py-4" style={{ borderColor: "#b8b8b8ff", borderStyle: "dashed" }}>
          <Card.Body>
            <p className="text-muted mb-0">Belum ada kriteria, tambahkan kriteria di atas.</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {criteria.map((c, index) => (
              <ListGroup.Item key={c.id} className="d-flex align-items-center gap-2">
                <span className="text-muted me-2">{index + 1}.</span>
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
                      Simpan
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleEditCancel}>
                      Batal
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow-1">{c.name}</span>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEditStart(c)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c.id)}>
                      Hapus
                    </Button>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </MainLayout>
  );
}

export default CriteriaPage;
