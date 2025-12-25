export function createInitialMatrix(size) {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) =>
      i === j ? 1 : 1
    )
  );
}
