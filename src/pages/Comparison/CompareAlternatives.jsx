import React, { useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PairwiseMatrix from "../../components/ahp/PairwiseMatrix";
import useDecisionStore from "../../store/decisionStore";
import { createInitialMatrix } from "../../utils/matrixUtils";
import { useNavigate } from "react-router-dom";


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

  const criteriaCount = criteria.length;
  const altCount = alternatives.length;
  const navigate = useNavigate();


  // Sinkronisasi index jika kriteria berubah
  useEffect(() => {
    if (currentCriteriaIndex >= criteriaCount) {
      setCurrentCriteriaIndex(0);
    }
  }, [criteriaCount]);

  const currentCriteria = criteria[currentCriteriaIndex];

  // Inisialisasi / reset matrix per kriteria
  useEffect(() => {
    if (!currentCriteria || altCount < 2) return;

    const existingMatrix = pairwiseAlternatives[currentCriteria.id];

    if (
      !existingMatrix ||
      existingMatrix.length !== altCount ||
      existingMatrix.some(row => row.length !== altCount)
    ) {
      setPairwiseAlternatives(
        currentCriteria.id,
        createInitialMatrix(altCount)
      );

      // reset bobot lama
      setAlternativeWeights(currentCriteria.id, {
        weights: [],
        consistency: null,
      });
    }
  }, [currentCriteria, alternatives]);

  if (!currentCriteria) {
    return (
      <MainLayout title="Compare Alternatives">
        <p>Semua kriteria telah diproses.</p>

        <button onClick={() => setCurrentCriteriaIndex(0)}>
          Ulangi dari Kriteria Pertama
        </button>
      </MainLayout>
    );
  }

  const matrix = pairwiseAlternatives[currentCriteria.id];

  const handleMatrixChange = (newMatrix) => {
    // ✅ SIMPAN MATRIX DULU (BUG 1 FIX)
    setPairwiseAlternatives(currentCriteria.id, newMatrix);

    const n = altCount;

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
    if (currentCriteriaIndex < criteriaCount - 1) {
      setCurrentCriteriaIndex(currentCriteriaIndex + 1);
    } else {
      //  semua kriteria selesai ke Result
      navigate("/project/1/result");
    }
  };


  const handlePrev = () => {
    if (currentCriteriaIndex > 0) {
      setCurrentCriteriaIndex(currentCriteriaIndex - 1);
    }
  };

  const isFirst = currentCriteriaIndex === 0;
  const isLast = currentCriteriaIndex === criteriaCount - 1;

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
        <button onClick={handlePrev} disabled={isFirst}>
          Kriteria Sebelumnya
        </button>

        <button
          onClick={handleNext}
          style={{ marginLeft: "8px" }}
        >
          {isLast ? "Selesai" : "Lanjut Kriteria Berikutnya"}
        </button>
      </div>
    </MainLayout>
  );
}

export default CompareAlternatives;
