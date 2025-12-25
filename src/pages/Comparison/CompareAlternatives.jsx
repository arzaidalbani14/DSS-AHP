import { useEffect } from "react";
import PairwiseMatrix from "../../components/ahp/PairwiseMatrix";
import useDecisionStore from "../../store/decisionStore";
import { createInitialMatrix } from "../../utils/matrixUtils";

import {
  normalizeMatrix,
  calculateWeights,
  calculateWeightedSum,
  calculateLambdaMax,
  calculateCI,
  calculateCR,
} from "../../services/ahpService";

function CompareAlternatives() {
  const {
    criteria,
    alternatives,

    pairwiseAlternatives,
    setPairwiseAlternatives,

    alternativeWeights,
    setAlternativeWeights,

    currentCriteriaIndex,
    setCurrentCriteriaIndex,
  } = useDecisionStore();

  const currentCriteria = criteria[currentCriteriaIndex];

  // Inisialisasi matriks alternatif per kriteria
  useEffect(() => {
    if (!currentCriteria) return;

    const existingMatrix =
      pairwiseAlternatives[currentCriteria.id];

    if (!existingMatrix && alternatives.length) {
      setPairwiseAlternatives(
        currentCriteria.id,
        createInitialMatrix(alternatives.length)
      );
    }
  }, [currentCriteria, alternatives]);

  if (!currentCriteria) {
    return <p>Semua kriteria telah diproses.</p>;
  }

  const matrix = pairwiseAlternatives[currentCriteria.id];

  const handleMatrixChange = (newMatrix) => {
    setPairwiseAlternatives(currentCriteria.id, newMatrix);

    // Hitung bobot alternatif
    const normalized = normalizeMatrix(newMatrix);
    const weights = calculateWeights(normalized);

    // (opsional) konsistensi alternatif
    const weightedSum = calculateWeightedSum(newMatrix, weights);
    const lambdaMax = calculateLambdaMax(weightedSum, weights);
    const ci = calculateCI(lambdaMax, alternatives.length);
    const cr = calculateCR(ci, alternatives.length);

    setAlternativeWeights(currentCriteria.id, {
      weights,
      consistency: { lambdaMax, ci, cr },
    });
  };

  const handleNext = () => {
    setCurrentCriteriaIndex(currentCriteriaIndex + 1);
  };

  const isLast = currentCriteriaIndex === criteria.length - 1;

  return (
    <div>
      <h2>
        Perbandingan Alternatif –{" "}
        <strong>{currentCriteria.name}</strong>
      </h2>

      {matrix && (
        <PairwiseMatrix
          items={alternatives}
          matrix={matrix}
          onChange={handleMatrixChange}
        />
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleNext}>
          {isLast ? "Selesai" : "Lanjut Kriteria Berikutnya"}
        </button>
      </div>
    </div>
  );
}

export default CompareAlternatives;
