import React from "react";
import { Form } from "react-bootstrap";
import { SAATY_SCALE } from "../../utils/constants";

function SaatyScaleSelect({ value, onChange }) {
  return (
    <Form.Select
      size="sm"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{ minWidth: "120px" }}
    >
      {SAATY_SCALE.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Form.Select>
  );
}

export default SaatyScaleSelect;
