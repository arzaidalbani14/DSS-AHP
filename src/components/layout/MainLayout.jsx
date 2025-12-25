import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout({ children, title }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header title={title} />

        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
