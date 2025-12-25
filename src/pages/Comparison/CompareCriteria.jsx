import React, { useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PairwiseMatrix from "../../components/ahp/PairwiseMatrix";
import ConsistencyBadge from "../../components/ahp/ConsistencyBadge";
import ConsistencyDetail from "../../components/ahp/ConsistencyDetail";

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

function CompareCriteria() {
  const {
    criteria,
    pairwiseCriteria,
    setPairwiseCriteria,
    setCriteriaWeights,
    setCriteriaConsistency,
    criteriaConsistency,
  } = useDecisionStore();

  // Inisialisasi matriks jika belum ada
  useEffect(() => {
    if (criteria.length && pairwiseCriteria.length === 0) {
      setPairwiseCriteria(createInitialMatrix(criteria.length));
    }
  }, [criteria]);

  // Hitung AHP setiap matriks berubah
  useEffect(() => {
    const n = criteria.length;
    if (n < 2) return;
    if (pairwiseCriteria.length !== n) return;

    // cek apakah user sudah mengisi perbandingan (bukan matriks identitas)
    const hasComparison = pairwiseCriteria.some(
      (row, i) => row.some((val, j) => i !== j && val !== 1)
    );

    if (!hasComparison) {
      setCriteriaConsistency(null);
      return;
    }

    const normalized = normalizeMatrix(pairwiseCriteria);
    const weights = calculateWeights(normalized);
    const weightedSum = calculateWeightedSum(pairwiseCriteria, weights);
    const lambdaMax = calculateLambdaMax(weightedSum, weights);
    const ci = calculateCI(lambdaMax, n);
    const cr = calculateCR(ci, n);

    setCriteriaWeights(weights);
    setCriteriaConsistency({ lambdaMax, ci, cr });
  }, [pairwiseCriteria, criteria]);


  const isConsistent =
    criteriaConsistency && criteriaConsistency.cr <= 0.1;

  return (
    <MainLayout title="Compare Criteria">
      <h2>Perbandingan Kriteria</h2>

      <PairwiseMatrix
        items={criteria}
        matrix={pairwiseCriteria}
        onChange={setPairwiseCriteria}
      />

      {criteriaConsistency && (
        <>
          <ConsistencyBadge cr={criteriaConsistency.cr} />
          <ConsistencyDetail
            lambdaMax={criteriaConsistency.lambdaMax}
            ci={criteriaConsistency.ci}
            cr={criteriaConsistency.cr}
          />
        </>
      )}

      <div style={{ marginTop: "20px" }}>
        <button disabled={!isConsistent}>
          Lanjut ke Perbandingan Alternatif
        </button>

        {!isConsistent && (
          <p style={{ color: "red", marginTop: "8px" }}>
            Perbandingan belum konsisten. Silakan perbaiki nilai.
          </p>
        )}
      </div>
    </MainLayout>
  );
}

export default CompareCriteria;
