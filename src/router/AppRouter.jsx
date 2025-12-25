import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import ProjectCreate from "../pages/Project/ProjectCreate.jsx";
import ProjectDetail from "../pages/Project/ProjectDetail.jsx";
import CriteriaPage from "../pages/Criteria/CriteriaPage.jsx";
import AlternativesPage from "../pages/Alternatives/AlternativesPage.jsx";
import CompareCriteria from "../pages/Comparison/CompareCriteria.jsx";
import CompareAlternatives from "../pages/Comparison/CompareAlternatives.jsx";
import ResultPage from "../pages/Result/ResultPage.jsx";

function AppRouter() {
  return (
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
  );
}

export default AppRouter;
