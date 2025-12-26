import React, { useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";
import { aggregateResults } from "../../services/ahpService";

function ResultPage() {
  const {
    criteria,
    alternatives,
    criteriaWeights,
    alternativeWeights,
    finalResult,
    setFinalResult,
  } = useDecisionStore();

  useEffect(() => {
    // validasi dasar
    if (
      criteria.length < 1 ||
      alternatives.length < 1 ||
      criteriaWeights.length !== criteria.length
    ) {
      setFinalResult([]);
      return;
    }

    // validasi kelengkapan bobot alternatif
    const isAlternativeDataComplete = criteria.every(
      (c) =>
        alternativeWeights[c.id] &&
        alternativeWeights[c.id].weights &&
        alternativeWeights[c.id].weights.length === alternatives.length
    );

    if (!isAlternativeDataComplete) {
      setFinalResult([]);
      return;
    }

    // agregasi akhir
    const result = aggregateResults(
      criteria,
      alternatives,
      criteriaWeights,
      alternativeWeights
    );

    setFinalResult(result);
  }, [criteria, alternatives, criteriaWeights, alternativeWeights]);

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
      <h2>Hasil Akhir & Ranking</h2>

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
            <strong>Rekomendasi Terbaik:</strong>{" "}
            {best.name} (Skor: {best.score.toFixed(4)})
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
                  style={
                    index === 0
                      ? { background: "#f0fdf4" }
                      : undefined
                  }
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
