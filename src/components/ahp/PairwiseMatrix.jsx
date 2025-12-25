import SaatyScaleSelect from "./SaatyScaleSelect";

function PairwiseMatrix({ items, matrix, onChange }) {
  const handleChange = (i, j, value) => {
    const newMatrix = matrix.map((row) => [...row]);

    newMatrix[i][j] = value;
    newMatrix[j][i] = 1 / value;

    onChange(newMatrix);
  };

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th></th>
          {items.map((item) => (
            <th key={item.id}>{item.name}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {items.map((rowItem, i) => (
          <tr key={rowItem.id}>
            <td><strong>{rowItem.name}</strong></td>

            {items.map((_, j) => (
              <td key={j} style={{ textAlign: "center" }}>
                {i === j ? (
                  <strong>1</strong>
                ) : i < j ? (
                  <SaatyScaleSelect
                    value={matrix[i][j]}
                    onChange={(val) => handleChange(i, j, val)}
                  />
                ) : (
                  <span>{matrix[i][j].toFixed(3)}</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PairwiseMatrix;
