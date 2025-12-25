import React from "react";
import { SAATY_SCALE } from "../../utils/constants";

function SaatyScaleSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    >
      {SAATY_SCALE.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default SaatyScaleSelect;
