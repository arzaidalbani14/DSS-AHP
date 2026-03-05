import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Alert } from "react-bootstrap";
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

  useEffect(() => {
    if (!project) return;
    if (currentCriteriaIndex >= criteriaCount && criteriaCount > 0) {
      updateProjectAhpData(projectId, "currentCriteriaIndex", 0);
    }
  }, [criteriaCount, project]);

  const currentCriteria = criteria[currentCriteriaIndex];

  useEffect(() => {
    if (!project || !currentCriteria || altCount < 2) return;

    const existingMatrix = pairwiseAlternatives[currentCriteria.id];

    if (
      !existingMatrix ||
      existingMatrix.length !== altCount ||
      existingMatrix.some((row) => row.length !== altCount)
    ) {
      setProjectPairwiseAlternatives(projectId, currentCriteria.id, createInitialMatrix(altCount));
      setProjectAlternativeWeights(projectId, currentCriteria.id, {
        weights: [],
        consistency: null,
      });
    }
  }, [currentCriteria, alternatives, project]);

  if (!project) {
    return (
      <MainLayout title="Compare Alternatives">
        <p className="text-muted">Project not found.</p>
      </MainLayout>
    );
  }

  if (!currentCriteria) {
    return (
      <MainLayout title="Compare Alternatives">
        <Alert variant="success">All criteria has been processed.</Alert>
        <Button variant="outline-primary" onClick={() => updateProjectAhpData(projectId, "currentCriteriaIndex", 0)}>
          Start new from the first criteria
        </Button>
      </MainLayout>
    );
  }

  const matrix = pairwiseAlternatives[currentCriteria.id];

  const handleMatrixChange = (newMatrix) => {
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
      <h2 className="mb-2">Compare Alternatives</h2>
      <p className="text-muted mb-4" style={{ fontSize: "18px" }}>
        Criteria: <strong>{currentCriteria.name}</strong> ({currentCriteriaIndex + 1} dari {criteriaCount})
      </p>

      {
        altCount < 2 ? (
          <Alert variant="warning">Add at least 2 alternatives.</Alert>
        ) : (
          <>
            <Card className="mb-4">
              <Card.Body>
                {matrix && (
                  <PairwiseMatrix
                    items={alternatives}
                    matrix={matrix}
                    onChange={handleMatrixChange}
                  />
                )}
              </Card.Body>
            </Card>

            <div className="d-grid gap-3 d-md-flex justify-content-md-between mt-4 pt-3 border-top border-light">
              <Button
                variant="light"
                className="btn-light-secondary fw-medium order-2 order-md-1"
                onClick={() => navigate(`/project/${projectId}/compare-criteria`)}
              >
                Back to Compare Criteria
              </Button>
              <div className="d-grid gap-3 d-md-flex align-items-md-center justify-content-md-end order-1 order-md-2">
                <Button variant="outline-secondary" className="order-2 order-md-1" onClick={handlePrev} disabled={isFirst}>
                  Previous Step
                </Button>
                <Button variant="primary" className="fw-medium px-4 order-1 order-md-2" onClick={handleNext}>
                  {isLast ? "Next: Result" : "Next Step"}
                </Button>
              </div>
            </div>
          </>
        )
      }
    </MainLayout >
  );
}

export default CompareAlternatives;
