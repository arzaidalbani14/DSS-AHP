DSS AHP/
│
├─ public/
│  └─ favicon.svg
│
├─ index.html
├─ package.json
├─ vite.config.js
├─ README.md
├─ .gitignore
│
└─ src/
   │
   ├─ main.jsx
   ├─ App.jsx
   │
   ├─ router/
   │  └─ AppRouter.jsx
   │
   ├─ pages/
   │  │
   │  ├─ Landing/
   │  │  └─ Landing.jsx
   │  │
   │  ├─ Dashboard/
   │  │  └─ Dashboard.jsx
   │  │
   │  ├─ Project/
   │  │  ├─ ProjectCreate.jsx
   │  │  └─ ProjectDetail.jsx
   │  │
   │  ├─ Criteria/
   │  │  └─ CriteriaPage.jsx
   │  │
   │  ├─ Alternatives/
   │  │  └─ AlternativesPage.jsx
   │  │
   │  ├─ Comparison/
   │  │  ├─ CompareCriteria.jsx
   │  │  └─ CompareAlternatives.jsx
   │  │
   │  └─ Result/
   │     └─ ResultPage.jsx
   │
   ├─ components/
   │  │
   │  ├─ layout/
   │  │  ├─ MainLayout.jsx
   │  │  ├─ Sidebar.jsx
   │  │  └─ Header.jsx
   │  │
   │  ├─ common/
   │  │  ├─ Button.jsx
   │  │  ├─ Input.jsx
   │  │  ├─ Select.jsx
   │  │  ├─ Modal.jsx
   │  │  ├─ Alert.jsx
   │  │  └─ Loading.jsx
   │  │
   │  ├─ ahp/
   │  │  ├─ PairwiseMatrix.jsx
   │  │  ├─ SaatyScaleSelect.jsx
   │  │  ├─ ConsistencyBadge.jsx
   │  │  ├─ ConsistencyDetail.jsx
   │  │  └─ ProgressStepper.jsx
   │  │
   │  └─ charts/
   │     ├─ BarChart.jsx
   │     ├─ RadarChart.jsx
   │     └─ PieChart.jsx
   │
   ├─ services/
   │  ├─ ahpService.js
   │  ├─ projectService.js
   │  └─ storageService.js
   │
   ├─ store/
   │  └─ decisionStore.js
   │
   ├─ utils/
   │  ├─ matrixUtils.js
   │  ├─ validationUtils.js
   │  ├─ formatUtils.js
   │  └─ constants.js
   │
   ├─ styles/
   │  ├─ index.css
   │  ├─ theme.css
   │  └─ variables.css
   │
   └─ assets/
      ├─ icons/
      ├─ images/
      └─ logo.svg
