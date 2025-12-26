import React from "react";
import { useLocation } from "react-router-dom";

const steps = [
  { label: "Criteria", path: "/criteria" },
  { label: "Compare Criteria", path: "/compare-criteria" },
  { label: "Compare Alternatives", path: "/compare-alternatives" },
  { label: "Result", path: "/result" },
];

function ProgressStepper() {
  const location = useLocation();

  const currentStepIndex = steps.findIndex(step =>
    location.pathname.includes(step.path)
  );

  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;

        return (
          <div
            key={step.label}
            style={{
              padding: "6px 12px",
              borderRadius: "16px",
              background: isActive
                ? "#2563eb"
                : isCompleted
                ? "#16a34a"
                : "#e5e7eb",
              color: isActive || isCompleted ? "#fff" : "#374151",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressStepper;
