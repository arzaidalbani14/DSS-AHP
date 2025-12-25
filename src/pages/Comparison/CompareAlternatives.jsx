import React, { useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
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

    const n = alternatives.length;
    if (n < 2) return;

    const existingMatrix = pairwiseAlternatives[currentCriteria.id];

    if (
      !existingMatrix ||
      existingMatrix.length !== n ||
      existingMatrix.some(row => !row || row.length !== n)
    ) {
      setPairwiseAlternatives(
        currentCriteria.id,
        createInitialMatrix(n)
      );
    }
  }, [currentCriteria, alternatives]);


  if (!currentCriteria) {
    return (
      <MainLayout title="Compare Alternatives">
        <p>Semua kriteria telah diproses.</p>
      </MainLayout>
    );
  }

  const matrix = pairwiseAlternatives[currentCriteria.id];

  const handleMatrixChange = (newMatrix) => {
    const n = alternatives.length;

    // cek apakah user sudah mengisi perbandingan
    const hasComparison = newMatrix.some(
      (row, i) => row.some((val, j) => i !== j && val !== 1)
    );

    if (!hasComparison) {
      setAlternativeWeights(currentCriteria.id, {
        weights: [],
        consistency: null,
      });
      return;
    }

    const normalized = normalizeMatrix(newMatrix);
    const weights = calculateWeights(normalized);

    const weightedSum = calculateWeightedSum(newMatrix, weights);
    const lambdaMax = calculateLambdaMax(weightedSum, weights);
    const ci = calculateCI(lambdaMax, n);
    const cr = calculateCR(ci, n);

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
    <MainLayout title="Compare Alternatives">
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
    </MainLayout>
  );
}

export default CompareAlternatives;
