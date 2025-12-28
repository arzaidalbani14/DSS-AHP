import React, { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Alert } from "react-bootstrap";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";
import { aggregateResults } from "../../services/ahpService";

function ResultPage() {
  const { id: projectId } = useParams();

  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectFinalResult = useDecisionStore((s) => s.setProjectFinalResult);

  const criteria = project?.criteria || [];
  const alternatives = project?.alternatives || [];
  const criteriaWeights = project?.criteriaWeights || [];
  const alternativeWeights = project?.alternativeWeights || {};
  const storedFinalResult = project?.finalResult || [];

  // Compute result using useMemo
  const computedResult = useMemo(() => {
    if (!project) return [];

    if (
      criteria.length < 1 ||
      alternatives.length < 1 ||
      criteriaWeights.length !== criteria.length
    ) {
      return [];
    }

    const isAlternativeDataComplete = criteria.every(
      (c) =>
        alternativeWeights[c.id] &&
        alternativeWeights[c.id].weights &&
        alternativeWeights[c.id].weights.length === alternatives.length
    );

    if (!isAlternativeDataComplete) {
      return [];
    }

    return aggregateResults(
      criteria,
      alternatives,
      criteriaWeights,
      alternativeWeights
    );
  }, [criteria, alternatives, criteriaWeights, alternativeWeights, project]);

  // Save result to store
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
        <p className="text-muted">Project tidak ditemukan.</p>
      </MainLayout>
    );
  }

  const finalResult = computedResult.length > 0 ? computedResult : storedFinalResult;
  const best = finalResult[0];

  // Error messages
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
      <h2 className="mb-4">Hasil Akhir &amp; Ranking</h2>

      {finalResult.length === 0 ? (
        <Alert variant="warning">{message}</Alert>
      ) : (
        <>
          {/* Best Recommendation */}
          <Alert variant="success" className="mb-4">
            <strong>Rekomendasi Terbaik:</strong> {best.name} (Skor: {best.score.toFixed(4)})
          </Alert>

          {/* Ranking Table */}
          <Card>
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Peringkat</th>
                  <th>Alternatif</th>
                  <th>Nilai Preferensi</th>
                </tr>
              </thead>
              <tbody>
                {finalResult.map((item, index) => (
                  <tr key={item.id} className={index === 0 ? "table-success" : ""}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.score.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </MainLayout>
  );
}

export default ResultPage;
