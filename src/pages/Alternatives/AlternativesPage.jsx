import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";

function AlternativesPage() {
  const { alternatives } = useDecisionStore();

  return (
    <MainLayout title="Alternatives">
      <h2>Daftar Alternatif</h2>

      {alternatives.length === 0 ? (
        <p>Belum ada alternatif yang ditambahkan.</p>
      ) : (
        <ul>
          {alternatives.map((alt) => (
            <li key={alt.id}>{alt.name}</li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "16px" }}>
        <button>Tambah Alternatif</button>
      </div>
    </MainLayout>
  );
}

export default AlternativesPage;
