import { useEffect } from "react";
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
    if (
      criteria.length === 0 ||
      alternatives.length === 0 ||
      criteriaWeights.length === 0
    ) {
      return;
    }

    const result = aggregateResults(
      criteria,
      alternatives,
      criteriaWeights,
      alternativeWeights
    );

    setFinalResult(result);
  }, []);

  return (
    <div>
      <h2>Hasil Akhir & Ranking</h2>

      {finalResult.length === 0 ? (
        <p>Data belum lengkap.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "16px" }}>
          <thead>
            <tr>
              <th>Peringkat</th>
              <th>Alternatif</th>
              <th>Nilai Preferensi</th>
            </tr>
          </thead>
          <tbody>
            {finalResult.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.score.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ResultPage;
