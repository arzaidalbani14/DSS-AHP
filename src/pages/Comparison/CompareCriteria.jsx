import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Alert } from "react-bootstrap";
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

  const project = useDecisionStore((s) => s.getProjectById(projectId));
  const setProjectPairwiseCriteria = useDecisionStore((s) => s.setProjectPairwiseCriteria);
  const setProjectCriteriaWeights = useDecisionStore((s) => s.setProjectCriteriaWeights);
  const setProjectCriteriaConsistency = useDecisionStore((s) => s.setProjectCriteriaConsistency);

  const criteria = project?.criteria || [];
  const pairwiseCriteria = project?.pairwiseCriteria || [];
  const criteriaConsistency = project?.criteriaConsistency || null;

  const initializedRef = useRef(false);
  const prevCriteriaLengthRef = useRef(criteria.length);

  useEffect(() => {
    if (!project) return;

    const n = criteria.length;

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

    if (!initializedRef.current && pairwiseCriteria.length !== n) {
      initializedRef.current = true;
      setProjectPairwiseCriteria(projectId, createInitialMatrix(n));
    }
  }, [criteria.length, projectId, pairwiseCriteria.length]);

  const handleMatrixChange = (newMatrix) => {
    setProjectPairwiseCriteria(projectId, newMatrix);

    const n = criteria.length;
    if (n < 2) return;

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
        <p className="text-muted">Project tidak ditemukan.</p>
      </MainLayout>
    );
  }

  const isConsistent = criteriaConsistency && criteriaConsistency.cr <= 0.1;

  return (
    <MainLayout title="Compare Criteria">
      <h2 className="mb-4">Perbandingan Kriteria</h2>

      {criteria.length < 2 ? (
        <Alert variant="warning">
          Minimal 2 kriteria diperlukan untuk perbandingan.
        </Alert>
      ) : (
        <>
          <Card className="mb-4">
            <Card.Body>
              <PairwiseMatrix
                items={criteria}
                matrix={pairwiseCriteria}
                onChange={handleMatrixChange}
              />
            </Card.Body>
          </Card>

          {criteriaConsistency && (
            <Card className="mb-4">
              <Card.Body>
                <ConsistencyBadge cr={criteriaConsistency.cr} />
                <ConsistencyDetail
                  lambdaMax={criteriaConsistency.lambdaMax}
                  ci={criteriaConsistency.ci}
                  cr={criteriaConsistency.cr}
                />
              </Card.Body>
            </Card>
          )}

          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="primary"
              disabled={!isConsistent}
              onClick={() => navigate(`/project/${projectId}/compare-alternatives`)}
            >
              Lanjut ke Perbandingan Alternatif →
            </Button>

            {!isConsistent && criteriaConsistency && (
              <Alert variant="danger" className="mb-0 py-2 px-3">
                Perbandingan belum konsisten. Silakan perbaiki nilai.
              </Alert>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default CompareCriteria;
