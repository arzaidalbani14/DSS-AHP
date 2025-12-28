import React from "react";
import { Table } from "react-bootstrap";
import SaatyScaleSelect from "./SaatyScaleSelect";

function PairwiseMatrix({ items, matrix, onChange }) {

  if (
    !matrix ||
    matrix.length !== items.length ||
    matrix.some(row => !row || row.length !== items.length)
  ) {
    return <p className="text-muted">Matriks belum siap.</p>;
  }

  const handleChange = (i, j, value) => {
    const newMatrix = matrix.map((row) => [...row]);

    newMatrix[i][j] = value;
    newMatrix[j][i] = 1 / value;

    onChange(newMatrix);
  };

  return (
    <div className="table-responsive">
      <Table bordered hover size="sm" className="mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ minWidth: "120px" }}></th>
            {items.map((item) => (
              <th
                key={item.id}
                className="text-center"
                style={{ minWidth: "130px" }}
              >
                {item.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.map((rowItem, i) => (
            <tr key={rowItem.id}>
              <td className="fw-bold bg-light">{rowItem.name}</td>

              {items.map((_, j) => (
                <td key={j} className="text-center align-middle">
                  {i === j ? (
                    <span className="text-muted fw-bold">1</span>
                  ) : i < j ? (
                    <SaatyScaleSelect
                      value={matrix[i]?.[j] ?? 1}
                      onChange={(val) => handleChange(i, j, val)}
                    />
                  ) : (
                    <span className="text-secondary">{(matrix[i]?.[j] ?? 1).toFixed(3)}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PairwiseMatrix;
