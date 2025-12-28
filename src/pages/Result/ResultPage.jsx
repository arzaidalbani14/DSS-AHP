import React, { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Alert, Accordion } from "react-bootstrap";
import { toast } from "react-toastify";
import MainLayout from "../../components/layout/MainLayout";
import useDecisionStore from "../../store/decisionStore";
import { aggregateResults } from "../../services/ahpService";

function ResultPage() {
  const { id: projectId } = useParams();

  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectFinalResult = useDecisionStore((s) => s.setProjectFinalResult);
  const computeProjectStatus = useDecisionStore((s) => s.computeProjectStatus);
  const updateProject = useDecisionStore((s) => s.updateProject);

  const criteria = project?.criteria || [];
  const alternatives = project?.alternatives || [];
  const criteriaWeights = project?.criteriaWeights || [];
  const criteriaConsistency = project?.criteriaConsistency || null;
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

  // Save result to store and sync status
  const prevResultRef = useRef(null);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!project) return;

    const resultChanged = JSON.stringify(computedResult) !== JSON.stringify(prevResultRef.current);
    const storeNeedsUpdate = JSON.stringify(computedResult) !== JSON.stringify(storedFinalResult);

    if (resultChanged && storeNeedsUpdate && computedResult.length > 0) {
      prevResultRef.current = computedResult;
      setProjectFinalResult(projectId, computedResult);

      // Show toast only once per calculation
      if (!hasShownToast.current) {
        toast.success("Perhitungan AHP selesai!");
        hasShownToast.current = true;
      }

      // Sync status to project after saving result
      setTimeout(() => {
        const newStatus = computeProjectStatus(projectId);
        if (project.status !== newStatus) {
          updateProject(projectId, { status: newStatus });
        }
      }, 100);
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

  // Helper to format CR status
  const getCRStatus = (cr) => {
    if (cr <= 0.1) {
      return <span className="text-success">Konsisten (≤ 0.1)</span>;
    }
    return <span className="text-danger">Tidak Konsisten (&gt; 0.1)</span>;
  };

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
          <Card className="mb-4">
            <Card.Header>
              <strong>Peringkat Akhir</strong>
            </Card.Header>
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

          {/* AHP Calculation Summary */}
          <h5 className="mb-3">Ringkasan Perhitungan AHP</h5>

          <Accordion defaultActiveKey="0" className="mb-4">
            {/* Criteria Weights */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Bobot Kriteria
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-muted mb-3">
                  Bobot kriteria menunjukkan tingkat kepentingan relatif setiap kriteria dalam pengambilan keputusan.
                  Semakin tinggi bobot, semakin besar pengaruh kriteria tersebut terhadap hasil akhir.
                  Nilai persentase menunjukkan proporsi kontribusi kriteria terhadap total keputusan (total semua persentase = 100%).
                </p>
                <Table bordered size="sm" className="mb-3">
                  <thead className="table-light">
                    <tr>
                      <th>No</th>
                      <th>Kriteria</th>
                      <th>Bobot</th>
                      <th>Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((c, index) => (
                      <tr key={c.id}>
                        <td>{index + 1}</td>
                        <td>{c.name}</td>
                        <td>{criteriaWeights[index]?.toFixed(4) || "-"}</td>
                        <td>{((criteriaWeights[index] || 0) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {criteriaConsistency && (
                  <div className="bg-light p-3 rounded">
                    <strong>Konsistensi Perbandingan Kriteria:</strong>
                    <ul className="mb-0 mt-2">
                      <li>λmax (Lambda Max): {criteriaConsistency.lambdaMax?.toFixed(4) || "-"}</li>
                      <li>CI (Consistency Index): {criteriaConsistency.ci?.toFixed(4) || "-"}</li>
                      <li>CR (Consistency Ratio): {criteriaConsistency.cr?.toFixed(4) || "-"} — {getCRStatus(criteriaConsistency.cr)}</li>
                    </ul>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>

            {/* Alternative Weights per Criteria */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Bobot Alternatif per Kriteria
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-muted mb-3">
                  Bobot alternatif menunjukkan peringkat masing-masing alternatif berdasarkan setiap kriteria.
                  Bobot lokal adalah nilai relatif dalam satu kriteria, sedangkan bobot global adalah kontribusi ke skor akhir.
                </p>
                {criteria.map((c, cIndex) => {
                  const altData = alternativeWeights[c.id];
                  const weights = altData?.weights || [];
                  const consistency = altData?.consistency;

                  return (
                    <div key={c.id} className="mb-4">
                      <h6 className="mb-2">
                        {cIndex + 1}. Kriteria: <strong>{c.name}</strong>
                      </h6>

                      <Table bordered size="sm" className="mb-2">
                        <thead className="table-light">
                          <tr>
                            <th>Alternatif</th>
                            <th>Bobot Lokal</th>
                            <th>Bobot Global</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alternatives.map((alt, aIndex) => {
                            const localWeight = weights[aIndex] || 0;
                            const globalWeight = localWeight * (criteriaWeights[cIndex] || 0);
                            return (
                              <tr key={alt.id}>
                                <td>{alt.name}</td>
                                <td>{localWeight.toFixed(4)}</td>
                                <td>{globalWeight.toFixed(4)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>

                    </div>
                  );
                })}
              </Accordion.Body>
            </Accordion.Item>

            {/* Final Calculation Breakdown */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                Perhitungan Skor Akhir
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-muted mb-3">
                  Tabel ini menampilkan kontribusi setiap kriteria terhadap skor akhir masing-masing alternatif.
                  Total di kolom terakhir adalah skor akhir yang menentukan peringkat.
                </p>
                <Table bordered size="sm">
                  <thead className="table-light">
                    <tr>
                      <th>Alternatif</th>
                      {criteria.map((c, i) => (
                        <th key={c.id} className="text-center">
                          {c.name}<br />
                          <small className="text-muted">({(criteriaWeights[i] * 100).toFixed(1)}%)</small>
                        </th>
                      ))}
                      <th className="text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alternatives.map((alt, aIndex) => {
                      let total = 0;
                      const contributions = criteria.map((c, cIndex) => {
                        const altData = alternativeWeights[c.id];
                        const localWeight = altData?.weights?.[aIndex] || 0;
                        const contribution = localWeight * (criteriaWeights[cIndex] || 0);
                        total += contribution;
                        return contribution;
                      });

                      const resultItem = finalResult.find(r => r.id === alt.id);
                      const isWinner = resultItem && resultItem.id === best.id;

                      return (
                        <tr key={alt.id} className={isWinner ? "table-success" : ""}>
                          <td><strong>{alt.name}</strong></td>
                          {contributions.map((contrib, i) => (
                            <td key={i} className="text-center">{contrib.toFixed(4)}</td>
                          ))}
                          <td className="text-center"><strong>{total.toFixed(4)}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </>
      )}
    </MainLayout>
  );
}

export default ResultPage;
