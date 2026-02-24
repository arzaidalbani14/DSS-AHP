import React from "react";
function ConsistencyBadge({ cr }) {
  if (cr === null) return null;

  const isConsistent = cr <= 0.1;

  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        background: isConsistent ? "#DCFCE7" : "#FEE2E2",
        color: isConsistent ? "#166534" : "#991B1B",
        display: "inline-block",
        marginTop: "12px",
      }}
    >
      {isConsistent
        ? `Consistent (CR = ${cr.toFixed(3)})`
        : `Inconsistent (CR = ${cr.toFixed(3)})`}
    </div>
  );
}

export default ConsistencyBadge;
