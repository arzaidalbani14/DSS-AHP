import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProjectCreate from "../pages/Project/ProjectCreate";
import ProjectDetail from "../pages/Project/ProjectDetail";
import CriteriaPage from "../pages/Criteria/CriteriaPage";
import AlternativesPage from "../pages/Alternatives/AlternativesPage";
import CompareCriteria from "../pages/Comparison/CompareCriteria";
import CompareAlternatives from "../pages/Comparison/CompareAlternatives";
import ResultPage from "../pages/Result/ResultPage";

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
      <Route path="/project/:id/compare-alternatives" element={<CompareAlternatives />} />

      <Route path="/project/:id/result" element={<ResultPage />} />
    </Routes>
  );
}

export default AppRouter;
