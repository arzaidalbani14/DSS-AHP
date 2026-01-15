import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Card, ListGroup, InputGroup } from "react-bootstrap";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function AlternativesPage() {
  const { id: projectId } = useParams();

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
      <MainLayout title="Alternatives">
        <p className="text-muted">Project tidak ditemukan.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Alternatives">
      <h2 className="mb-4">Daftar Alternatif</h2>

      {/* Add Alternative Form */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAdd}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Nama alternatif (contoh: Laptop A)"
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

      {/* Alternatives List */}
      {alternatives.length === 0 ? (
        <Card className="text-center py-4" style={{ borderColor: "#b8b8b8ff", borderStyle: "dashed" }}>
          <Card.Body>
            <p className="text-muted mb-0">Belum ada alternatif, tambahkan alternatif di atas.</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {alternatives.map((alt, index) => (
              <ListGroup.Item key={alt.id} className="d-flex align-items-center gap-2">
                <span className="text-muted me-2">{index + 1}.</span>
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
                      Simpan
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleEditCancel}>
                      Batal
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow-1">{alt.name}</span>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEditStart(alt)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(alt.id)}>
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

export default AlternativesPage;
