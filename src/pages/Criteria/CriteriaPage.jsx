import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function CriteriaPage() {
  const { id: projectId } = useParams();

  // Get project-specific data
  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectCriteria = useDecisionStore((s) => s.setProjectCriteria);

  const criteria = project?.criteria || [];

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = () => {
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
        <p>Project tidak ditemukan.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Criteria">
      <h2>Manajemen Kriteria</h2>

      {/* Tambah Kriteria */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Nama kriteria (contoh: Harga)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleAdd} style={{ marginLeft: "8px" }}>
          Tambah
        </button>
      </div>

      {/* Daftar Kriteria */}
      {criteria.length === 0 ? (
        <p>Belum ada kriteria.</p>
      ) : (
        <ul>
          {criteria.map((c) => (
            <li key={c.id} style={{ marginBottom: "8px" }}>
              {editingId === c.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button
                    onClick={() => handleEditSave(c.id)}
                    style={{ marginLeft: "6px" }}
                  >
                    Simpan
                  </button>
                  <button
                    onClick={handleEditCancel}
                    style={{ marginLeft: "4px" }}
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  {c.name}{" "}
                  <button
                    onClick={() => handleEditStart(c)}
                    style={{ marginLeft: "6px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{ marginLeft: "4px" }}
                  >
                    Hapus
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </MainLayout>
  );
}

export default CriteriaPage;
