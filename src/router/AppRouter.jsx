import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Spinner } from "react-bootstrap";

// Lazy load pages for performance
const Landing = lazy(() => import("../pages/Landing/Landing.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard.jsx"));
const ProjectCreate = lazy(() => import("../pages/Project/ProjectCreate.jsx"));
const ProjectDetail = lazy(() => import("../pages/Project/ProjectDetail.jsx"));
const CriteriaPage = lazy(() => import("../pages/Criteria/CriteriaPage.jsx"));
const AlternativesPage = lazy(() => import("../pages/Alternatives/AlternativesPage.jsx"));
const CompareCriteria = lazy(() => import("../pages/Comparison/CompareCriteria.jsx"));
const CompareAlternatives = lazy(() => import("../pages/Comparison/CompareAlternatives.jsx"));
const ResultPage = lazy(() => import("../pages/Result/ResultPage.jsx"));

const LoadingFallback = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "var(--bg-body)"
  }}>
    <div style={{ textAlign: "center" }}>
      <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
      <p style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.9rem", letterSpacing: "1px" }}>LOADING</p>
    </div>
  </div>
);

function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/project/new" element={<ProjectCreate />} />
        <Route path="/project/:id" element={<ProjectDetail />} />

        <Route path="/project/:id/criteria" element={<CriteriaPage />} />
        <Route path="/project/:id/alternatives" element={<AlternativesPage />} />

        <Route path="/project/:id/compare-criteria" element={<CompareCriteria />} />
        <Route
          path="/project/:id/compare-alternatives"
          element={<CompareAlternatives />}
        />

        <Route path="/project/:id/result" element={<ResultPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
