import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  // Get project-specific data
  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectPairwiseAlternatives = useDecisionStore((s) => s.setProjectPairwiseAlternatives);
  const setProjectAlternativeWeights = useDecisionStore((s) => s.setProjectAlternativeWeights);
  const updateProjectAhpData = useDecisionStore((s) => s.updateProjectAhpData);

  const criteria = project?.criteria || [];
  const alternatives = project?.alternatives || [];
  const pairwiseAlternatives = project?.pairwiseAlternatives || {};
  const alternativeWeights = project?.alternativeWeights || {};
  const currentCriteriaIndex = project?.currentCriteriaIndex || 0;

  const criteriaCount = criteria.length;
  const altCount = alternatives.length;

  // Sinkronisasi index jika kriteria berubah
  useEffect(() => {
    if (!project) return;
    if (currentCriteriaIndex >= criteriaCount && criteriaCount > 0) {
      updateProjectAhpData(projectId, "currentCriteriaIndex", 0);
    }
  }, [criteriaCount, project]);

  const currentCriteria = criteria[currentCriteriaIndex];

  // Inisialisasi / reset matrix per kriteria
  useEffect(() => {
    if (!project || !currentCriteria || altCount < 2) return;

    const existingMatrix = pairwiseAlternatives[currentCriteria.id];

    if (
      !existingMatrix ||
      existingMatrix.length !== altCount ||
      existingMatrix.some((row) => row.length !== altCount)
    ) {
      setProjectPairwiseAlternatives(projectId, currentCriteria.id, createInitialMatrix(altCount));

      // reset bobot lama
      setProjectAlternativeWeights(projectId, currentCriteria.id, {
        weights: [],
        consistency: null,
      });
    }
  }, [currentCriteria, alternatives, project]);

  if (!project) {
    return (
      <MainLayout title="Compare Alternatives">
        <p>Project tidak ditemukan.</p>
      </MainLayout>
    );
  }

  if (!currentCriteria) {
    return (
      <MainLayout title="Compare Alternatives">
        <p>Semua kriteria telah diproses.</p>

        <button onClick={() => updateProjectAhpData(projectId, "currentCriteriaIndex", 0)}>
          Ulangi dari Kriteria Pertama
        </button>
      </MainLayout>
    );
  }

  const matrix = pairwiseAlternatives[currentCriteria.id];

  const handleMatrixChange = (newMatrix) => {
    // Simpan matrix
    setProjectPairwiseAlternatives(projectId, currentCriteria.id, newMatrix);

    const n = altCount;

    const normalized = normalizeMatrix(newMatrix);
    const weights = calculateWeights(normalized);

    const weightedSum = calculateWeightedSum(newMatrix, weights);
    const lambdaMax = calculateLambdaMax(weightedSum, weights);
    const ci = calculateCI(lambdaMax, n);
    const cr = calculateCR(ci, n);

    setProjectAlternativeWeights(projectId, currentCriteria.id, {
      weights,
      consistency: { lambdaMax, ci, cr },
    });
  };

  const handleNext = () => {
    if (currentCriteriaIndex < criteriaCount - 1) {
      updateProjectAhpData(projectId, "currentCriteriaIndex", currentCriteriaIndex + 1);
    } else {
      // semua kriteria selesai ke Result
      navigate(`/project/${projectId}/result`);
    }
  };

  const handlePrev = () => {
    if (currentCriteriaIndex > 0) {
      updateProjectAhpData(projectId, "currentCriteriaIndex", currentCriteriaIndex - 1);
    }
  };

  const isFirst = currentCriteriaIndex === 0;
  const isLast = currentCriteriaIndex === criteriaCount - 1;

  return (
    <MainLayout title="Compare Alternatives">
      <h2>
        Perbandingan Alternatif – <strong>{currentCriteria.name}</strong>
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

        <button onClick={handleNext} style={{ marginLeft: "8px" }}>
          {isLast ? "Selesai" : "Lanjut Kriteria Berikutnya"}
        </button>
      </div>
    </MainLayout>
  );
}

export default CompareAlternatives;
