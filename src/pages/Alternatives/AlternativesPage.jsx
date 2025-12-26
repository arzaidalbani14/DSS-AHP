import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function AlternativesPage() {
  const { alternatives, setAlternatives } = useDecisionStore();

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;

    const newAlternative = {
      id: Date.now().toString(),
      name: name.trim(),
    };

    setAlternatives([...alternatives, newAlternative]);
    setName("");
  };

  const handleDelete = (id) => {
    setAlternatives(alternatives.filter((a) => a.id !== id));
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

    setAlternatives(updated);
    setEditingId(null);
    setEditingName("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <MainLayout title="Alternatives">
      <h2>Daftar Alternatif</h2>

      {/* Tambah Alternatif */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Nama alternatif (contoh: Kos A)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleAdd} style={{ marginLeft: "8px" }}>
          Tambah
        </button>
      </div>

      {/* Daftar Alternatif */}
      {alternatives.length === 0 ? (
        <p>Belum ada alternatif yang ditambahkan.</p>
      ) : (
        <ul>
          {alternatives.map((alt) => (
            <li key={alt.id} style={{ marginBottom: "8px" }}>
              {editingId === alt.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button
                    onClick={() => handleEditSave(alt.id)}
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
                  {alt.name}
                  <button
                    onClick={() => handleEditStart(alt)}
                    style={{ marginLeft: "6px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(alt.id)}
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

export default AlternativesPage;
