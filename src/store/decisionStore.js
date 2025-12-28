import { create } from "zustand";
import { persist } from "zustand/middleware";

// Template untuk AHP data dalam project
const createEmptyAhpData = () => ({
  criteria: [],
  alternatives: [],
  pairwiseCriteria: [],
  criteriaWeights: [],
  criteriaConsistency: null,
  pairwiseAlternatives: {},
  alternativeWeights: {},
  finalResult: [],
  currentCriteriaIndex: 0,
});

const useDecisionStore = create(
  persist(
    (set, get) => ({
      // ========= PROJECTS LIST =========
      projects: [],
      currentProjectId: null,

      // Get current project helper
      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return projects.find((p) => p.id === currentProjectId) || null;
      },

      // Set current project
      setCurrentProjectId: (id) => set({ currentProjectId: id }),

      addProject: (projectData) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...projectData,
              // Include empty AHP data
              ...createEmptyAhpData(),
            },
          ],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString().slice(0, 10) }
              : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          // Clear currentProjectId if deleted
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        })),

      getProjectById: (id) => get().projects.find((p) => p.id === id),

      // ========= PER-PROJECT AHP DATA ACTIONS =========

      // Generic update for any AHP field in a project
      updateProjectAhpData: (projectId, field, value) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, [field]: value, updatedAt: new Date().toISOString().slice(0, 10) }
              : p
          ),
        })),

      // Specific actions for convenience
      setProjectCriteria: (projectId, criteria) =>
        get().updateProjectAhpData(projectId, "criteria", criteria),

      setProjectAlternatives: (projectId, alternatives) =>
        get().updateProjectAhpData(projectId, "alternatives", alternatives),

      setProjectPairwiseCriteria: (projectId, matrix) =>
        get().updateProjectAhpData(projectId, "pairwiseCriteria", matrix),

      setProjectCriteriaWeights: (projectId, weights) =>
        get().updateProjectAhpData(projectId, "criteriaWeights", weights),

      setProjectCriteriaConsistency: (projectId, consistency) =>
        get().updateProjectAhpData(projectId, "criteriaConsistency", consistency),

      setProjectPairwiseAlternatives: (projectId, criteriaId, matrix) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                ...p,
                pairwiseAlternatives: {
                  ...p.pairwiseAlternatives,
                  [criteriaId]: matrix,
                },
                updatedAt: new Date().toISOString().slice(0, 10),
              }
              : p
          ),
        })),

      setProjectAlternativeWeights: (projectId, criteriaId, weights) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                ...p,
                alternativeWeights: {
                  ...p.alternativeWeights,
                  [criteriaId]: weights,
                },
                updatedAt: new Date().toISOString().slice(0, 10),
              }
              : p
          ),
        })),

      setProjectFinalResult: (projectId, result) =>
        get().updateProjectAhpData(projectId, "finalResult", result),

      setProjectCurrentCriteriaIndex: (projectId, index) =>
        get().updateProjectAhpData(projectId, "currentCriteriaIndex", index),

      // Compute and update project status based on AHP progress
      computeProjectStatus: (projectId) => {
        const project = get().getProjectById(projectId);
        if (!project) return "draft";

        if (project.finalResult && project.finalResult.length > 0) {
          return "completed";
        }
        if (
          (project.criteria && project.criteria.length > 0) ||
          (project.alternatives && project.alternatives.length > 0) ||
          (project.criteriaWeights && project.criteriaWeights.length > 0)
        ) {
          return "progress";
        }
        return "draft";
      },
    }),
    {
      name: "dss-ahp-storage-v2", // New key to avoid conflicts with old data
    }
  )
);

export default useDecisionStore;
