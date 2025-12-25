import { create } from "zustand";

const useDecisionStore = create((set) => ({
  // ========= STATE =========
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
}));

export default useDecisionStore;
