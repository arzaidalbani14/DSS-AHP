import { RANDOM_INDEX } from "../utils/constants";

// Normalisasi matriks (per kolom)
export function normalizeMatrix(matrix) {
  const colSums = matrix[0].map((_, j) =>
    matrix.reduce((sum, row) => sum + row[j], 0)
  );

  return matrix.map((row) =>
    row.map((val, j) => val / colSums[j])
  );
}

// Weight = row average
export function calculateWeights(normalizedMatrix) {
  return normalizedMatrix.map(
    (row) => row.reduce((a, b) => a + b, 0) / row.length
  );
}

// Weighted sum vector
export function calculateWeightedSum(matrix, weights) {
  return matrix.map((row) =>
    row.reduce((sum, val, j) => sum + val * weights[j], 0)
  );
}

// Lambda max
export function calculateLambdaMax(weightedSum, weights) {
  const lambdaValues = weightedSum.map(
    (val, i) => val / weights[i]
  );
  const total = lambdaValues.reduce((a, b) => a + b, 0);
  return total / lambdaValues.length;
}

// CI
export function calculateCI(lambdaMax, n) {
  return (lambdaMax - n) / (n - 1);
}

// CR
export function calculateCR(ci, n) {
  const ri = RANDOM_INDEX[n];
  if (!ri || n < 3) return 0;
  return ci / ri;
}

export function aggregateResults(
  criteria,
  alternatives,
  criteriaWeights,
  alternativeWeights
) {
  const results = alternatives.map((alt, altIndex) => {
    let score = 0;

    criteria.forEach((crit, critIndex) => {
      const altWeightObj = alternativeWeights[crit.id];
      if (!altWeightObj) return;

      const localWeight =
        altWeightObj.weights?.[altIndex] ?? 0;

      score += criteriaWeights[critIndex] * localWeight;

    });

    return {
      id: alt.id,
      name: alt.name,
      score,
    };
  });

  // urutkan dari terbesar ke terkecil
  return results.sort((a, b) => b.score - a.score);
}
