import React, { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";
import { aggregateResults } from "../../services/ahpService";

function ResultPage() {
  const { id: projectId } = useParams();

  // Get project-specific data
  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectFinalResult = useDecisionStore((s) => s.setProjectFinalResult);

  const criteria = project?.criteria || [];
  const alternatives = project?.alternatives || [];
  const criteriaWeights = project?.criteriaWeights || [];
  const alternativeWeights = project?.alternativeWeights || {};
  const storedFinalResult = project?.finalResult || [];

  // Compute result using useMemo instead of useEffect to avoid infinite loop
  const computedResult = useMemo(() => {
    if (!project) return [];

    // validasi dasar
    if (
      criteria.length < 1 ||
      alternatives.length < 1 ||
      criteriaWeights.length !== criteria.length
    ) {
      return [];
    }

    // validasi kelengkapan bobot alternatif
    const isAlternativeDataComplete = criteria.every(
      (c) =>
        alternativeWeights[c.id] &&
        alternativeWeights[c.id].weights &&
        alternativeWeights[c.id].weights.length === alternatives.length
    );

    if (!isAlternativeDataComplete) {
      return [];
    }

    // agregasi akhir
    return aggregateResults(
      criteria,
      alternatives,
      criteriaWeights,
      alternativeWeights
    );
  }, [criteria, alternatives, criteriaWeights, alternativeWeights, project]);

  // Save result to store only when it changes and is different
  const prevResultRef = useRef(null);
  useEffect(() => {
    if (!project) return;

    const resultChanged = JSON.stringify(computedResult) !== JSON.stringify(prevResultRef.current);
    const storeNeedsUpdate = JSON.stringify(computedResult) !== JSON.stringify(storedFinalResult);

    if (resultChanged && storeNeedsUpdate && computedResult.length > 0) {
      prevResultRef.current = computedResult;
      setProjectFinalResult(projectId, computedResult);
    }
  }, [computedResult]);

  if (!project) {
    return (
      <MainLayout title="Result">
        <p>Project tidak ditemukan.</p>
      </MainLayout>
    );
  }

  // Use computed result for display
  const finalResult = computedResult.length > 0 ? computedResult : storedFinalResult;
  const best = finalResult[0];

  // ---- pesan UX spesifik ----
  let message = null;

  if (criteria.length < 1) {
    message = "Belum ada kriteria yang ditentukan.";
  } else if (alternatives.length < 1) {
    message = "Belum ada alternatif yang ditambahkan.";
  } else if (criteriaWeights.length !== criteria.length) {
    message = "Perbandingan kriteria belum selesai.";
  } else {
    const incompleteAlt = criteria.find(
      (c) =>
        !alternativeWeights[c.id] ||
        alternativeWeights[c.id].weights?.length !== alternatives.length
    );

    if (incompleteAlt) {
      message = `Perbandingan alternatif untuk kriteria "${incompleteAlt.name}" belum selesai.`;
    }
  }

  return (
    <MainLayout title="Result">
      <h2>Hasil Akhir &amp; Ranking</h2>

      {finalResult.length === 0 ? (
        <p style={{ color: "#b91c1c" }}>{message}</p>
      ) : (
        <>
          {/* Highlight keputusan terbaik */}
          <div
            style={{
              padding: "12px",
              marginBottom: "16px",
              background: "#ecfdf5",
              border: "1px solid #10b981",
              borderRadius: "6px",
            }}
          >
            <strong>Rekomendasi Terbaik:</strong> {best.name} (Skor:{" "}
            {best.score.toFixed(4)})
          </div>

          {/* Tabel ranking */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={th}>Peringkat</th>
                <th style={th}>Alternatif</th>
                <th style={th}>Nilai Preferensi</th>
              </tr>
            </thead>
            <tbody>
              {finalResult.map((item, index) => (
                <tr
                  key={item.id}
                  style={index === 0 ? { background: "#f0fdf4" } : undefined}
                >
                  <td style={td}>{index + 1}</td>
                  <td style={td}>{item.name}</td>
                  <td style={td}>{item.score.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </MainLayout>
  );
}

const th = {
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
  padding: "8px",
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #e5e7eb",
};

export default ResultPage;
