import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function CriteriaPage() {
  const { criteria, setCriteria } = useDecisionStore();
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;

    const newCriteria = {
      id: Date.now().toString(),
      name: name.trim(),
    };

    setCriteria([...criteria, newCriteria]);
    setName("");
  };

  const handleDelete = (id) => {
    setCriteria(criteria.filter((c) => c.id !== id));
  };

  return (
    <MainLayout title="Criteria">
      <h2>Manajemen Kriteria</h2>

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

      {criteria.length === 0 ? (
        <p>Belum ada kriteria.</p>
      ) : (
        <ul>
          {criteria.map((c) => (
            <li key={c.id}>
              {c.name}{" "}
              <button onClick={() => handleDelete(c.id)}>Hapus</button>
            </li>
          ))}
        </ul>
      )}
    </MainLayout>
  );
}

export default CriteriaPage;
