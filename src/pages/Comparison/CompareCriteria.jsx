import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  // Get project-specific data
  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectPairwiseCriteria = useDecisionStore((s) => s.setProjectPairwiseCriteria);
  const setProjectCriteriaWeights = useDecisionStore((s) => s.setProjectCriteriaWeights);
  const setProjectCriteriaConsistency = useDecisionStore((s) => s.setProjectCriteriaConsistency);

  const criteria = project?.criteria || [];
  const pairwiseCriteria = project?.pairwiseCriteria || [];
  const criteriaConsistency = project?.criteriaConsistency || null;

  // Track if we already initialized
  const initializedRef = useRef(false);
  const prevCriteriaLengthRef = useRef(criteria.length);

  // Inisialisasi matriks jika belum ada atau jumlah kriteria berubah
  useEffect(() => {
    if (!project) return;

    const n = criteria.length;

    // Reset ref jika kriteria berubah
    if (prevCriteriaLengthRef.current !== n) {
      initializedRef.current = false;
      prevCriteriaLengthRef.current = n;
    }

    if (n < 2) {
      if (pairwiseCriteria.length > 0) {
        setProjectPairwiseCriteria(projectId, []);
      }
      return;
    }

    // Inisialisasi matrix hanya sekali
    if (!initializedRef.current && pairwiseCriteria.length !== n) {
      initializedRef.current = true;
      setProjectPairwiseCriteria(projectId, createInitialMatrix(n));
    }
  }, [criteria.length, projectId, pairwiseCriteria.length]);

  // Handler untuk perubahan matrix - hitung AHP di sini
  const handleMatrixChange = (newMatrix) => {
    setProjectPairwiseCriteria(projectId, newMatrix);

    const n = criteria.length;
    if (n < 2) return;

    // cek apakah user sudah mengisi perbandingan (bukan matriks identitas)
    const hasComparison = newMatrix.some(
      (row, i) => row.some((val, j) => i !== j && val !== 1)
    );

    if (!hasComparison) {
      setProjectCriteriaConsistency(projectId, null);
      setProjectCriteriaWeights(projectId, []);
      return;
    }

    const normalized = normalizeMatrix(newMatrix);
    const weights = calculateWeights(normalized);
    const weightedSum = calculateWeightedSum(newMatrix, weights);
    const lambdaMax = calculateLambdaMax(weightedSum, weights);
    const ci = calculateCI(lambdaMax, n);
    const cr = calculateCR(ci, n);

    setProjectCriteriaWeights(projectId, weights);
    setProjectCriteriaConsistency(projectId, { lambdaMax, ci, cr });
  };

  if (!project) {
    return (
      <MainLayout title="Compare Criteria">
        <p>Project tidak ditemukan.</p>
      </MainLayout>
    );
  }

  const isConsistent = criteriaConsistency && criteriaConsistency.cr <= 0.1;

  return (
    <MainLayout title="Compare Criteria">
      <h2>Perbandingan Kriteria</h2>

      {criteria.length < 2 ? (
        <p>Minimal 2 kriteria diperlukan untuk perbandingan.</p>
      ) : (
        <>
          <PairwiseMatrix
            items={criteria}
            matrix={pairwiseCriteria}
            onChange={handleMatrixChange}
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
            <button
              disabled={!isConsistent}
              onClick={() => navigate(`/project/${projectId}/compare-alternatives`)}
            >
              Lanjut ke Perbandingan Alternatif
            </button>

            {!isConsistent && (
              <p style={{ color: "red", marginTop: "8px" }}>
                Perbandingan belum konsisten. Silakan perbaiki nilai.
              </p>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default CompareCriteria;
