import React from "react";

function Header({ title }) {
  return (
    <header
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
        background: "#f8fafc",
      }}
    >
      <h1 style={{ margin: 0 }}>{title}</h1>
    </header>
  );
}

export default Header;
