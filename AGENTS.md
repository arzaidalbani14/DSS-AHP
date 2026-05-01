# DSS-AHP Agent Guidelines

## Development Commands
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Project Structure
- Entry point: `src/main.jsx`
- Root component: `src/App.jsx`
- Pages: `src/pages/` (Landing, Dashboard, Project, Criteria, Alternatives, Comparison, Result)
- Components: `src/components/` (ahp, charts, common, layout)
- State management: `src/store/` (Zustand)
- Styles: `src/styles/`
- Utils: `src/utils/` (AHP calculation helpers)
- Services: `src/services/`

## Key Conventions
- Uses React Router v6 for routing
- Zustand for state management (no providers needed)
- Bootstrap 5 for UI components
- AHP calculations in `src/utils/`
- Sequential workflow enforcement: Criteria → Alternatives → Comparisons → Results
- Consistency Ratio validation (CR ≤ 0.1 required)

## File Operations
- Data persisted in browser localStorage via Zustand
- Clearing browser cache will delete all project data
- Minimum 2 criteria and 2 alternatives required for valid AHP calculation

## Verification
No automated tests configured in this repository. Manual verification through UI required.