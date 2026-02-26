import React from "react";
function ConsistencyBadge({ cr }) {
  if (cr === null) return null;

  const isConsistent = cr <= 0.1;

  return (
    <div
      className={`consistency-badge ${isConsistent ? 'badge-consistent' : 'badge-inconsistent'}`}
    >
      {isConsistent
        ? `Consistent (CR = ${cr.toFixed(3)})`
        : `Inconsistent (CR = ${cr.toFixed(3)})`}
    </div>
  );
}

export default ConsistencyBadge;
