import { create } from "zustand";
import { persist } from "zustand/middleware";

const useDecisionStore = create(
  persist(
    (set, get) => ({
      // ========= PROJECTS LIST =========
      projects: [],

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().slice(0, 10) } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      getProjectById: (id) => get().projects.find((p) => p.id === id),

      // ========= CURRENT PROJECT STATE =========
      project: null,

      criteria: [],
      alternatives: [],

      pairwiseCriteria: [],
      criteriaWeights: [],
      criteriaConsistency: null,

      pairwiseAlternatives: {},
      alternativeWeights: {},

      finalResult: [],

      currentCriteriaIndex: 0,

      // ========= ACTIONS =========
      setProject: (project) => set({ project }),

      setCriteria: (criteria) => set({ criteria }),
      setAlternatives: (alternatives) => set({ alternatives }),

      setPairwiseCriteria: (matrix) => set({ pairwiseCriteria: matrix }),
      setCriteriaWeights: (weights) => set({ criteriaWeights: weights }),
      setCriteriaConsistency: (consistency) =>
        set({ criteriaConsistency: consistency }),

      setPairwiseAlternatives: (criteriaId, matrix) =>
        set((state) => ({
          pairwiseAlternatives: {
            ...state.pairwiseAlternatives,
            [criteriaId]: matrix,
          },
        })),

      setAlternativeWeights: (criteriaId, weights) =>
        set((state) => ({
          alternativeWeights: {
            ...state.alternativeWeights,
            [criteriaId]: weights,
          },
        })),

      setFinalResult: (result) => set({ finalResult: result }),

      setCurrentCriteriaIndex: (index) =>
        set({ currentCriteriaIndex: index }),
    }),
    {
      name: "dss-ahp-storage", // localStorage key
    }
  )
);

export default useDecisionStore;
