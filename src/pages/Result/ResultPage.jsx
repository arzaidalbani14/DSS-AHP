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
        toast.success("AHP calculation completed!");
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
        <p className="text-muted">Project not found.</p>
      </MainLayout>
    );
  }

  const finalResult = computedResult.length > 0 ? computedResult : storedFinalResult;
  const best = finalResult[0];

  // Error messages
  let message = null;
  if (criteria.length < 1) {
    message = "No criteria have been defined.";
  } else if (alternatives.length < 1) {
    message = "No alternatives have been added.";
  } else if (criteriaWeights.length !== criteria.length) {
    message = "Criteria comparison is not yet complete.";
  } else {
    const incompleteAlt = criteria.find(
      (c) =>
        !alternativeWeights[c.id] ||
        alternativeWeights[c.id].weights?.length !== alternatives.length
    );
    if (incompleteAlt) {
      message = `Alternative comparison for criterion "${incompleteAlt.name}" is not yet complete.`;
    }
  }

  // Helper to format CR status
  const getCRStatus = (cr) => {
    if (cr <= 0.1) {
      return <span className="text-success">Consistent (≤ 0.1)</span>;
    }
    return <span className="text-danger">Inconsistent (&gt; 0.1)</span>;
  };

  return (
    <MainLayout title="Result">
      <h2 className="mb-4">Final Result &amp; Rank</h2>

      {finalResult.length === 0 ? (
        <Alert variant="warning">{message}</Alert>
      ) : (
        <>
          {/* Best Recommendation */}
          <Alert variant="success" className="mb-4">
            <strong>Best Recommendation:</strong> {best.name} (Score: {best.score.toFixed(4)})
          </Alert>

          {/* Ranking Table */}
          <Card className="mb-4">
            <Card.Header>
              <strong>Ranking Based on Preference Values</strong>
            </Card.Header>
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Rank</th>
                  <th>Alternative</th>
                  <th>Preference Value</th>
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
          <h5 className="mb-3">AHP Calculation Summary</h5>

          <Accordion defaultActiveKey="0" className="mb-4">
            {/* Criteria Weights */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Criteria Weight
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-muted mb-3">
                  Criteria weights indicate the relative importance of each criterion in the decision-making process.
                  The higher the weight, the greater the influence of that criterion on the final result.
                  Percentage values show the proportion of each criterion's contribution to the total decision (all percentages sum to 100%).
                </p>
                <Table bordered size="sm" className="mb-3">
                  <thead className="table-light">
                    <tr>
                      <th>No</th>
                      <th>Criteria</th>
                      <th>Weight</th>
                      <th>Percentage</th>
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
                    <strong>Compare Criteria Consistency:</strong>
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
                Alternative Weight each Criteria
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-muted mb-3">
                  Alternative weights show the ranking of each alternative based on every criterion.
                  Local weight is the relative value within one criterion, while global weight is the contribution to the final score.
                </p>
                {criteria.map((c, cIndex) => {
                  const altData = alternativeWeights[c.id];
                  const weights = altData?.weights || [];
                  const consistency = altData?.consistency;

                  return (
                    <div key={c.id} className="mb-4">
                      <h6 className="mb-2">
                        {cIndex + 1}. Criterion: <strong>{c.name}</strong>
                      </h6>

                      <Table bordered size="sm" className="mb-2">
                        <thead className="table-light">
                          <tr>
                            <th>Alternative</th>
                            <th>Local Weight</th>
                            <th>Global Weight</th>
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
                Final Score Calculation
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-muted mb-3">
                  This table shows the contribution of each criterion to the final score of each alternative.
                  The total in the last column is the final score that determines the ranking.
                </p>
                <Table bordered size="sm">
                  <thead className="table-light">
                    <tr>
                      <th>Alternative</th>
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
