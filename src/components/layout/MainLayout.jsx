import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout({ children, title }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header title={title} />

        <main style={{ padding: "24px", flex: 1, position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={title} /* Simple key based on title change to trigger transition */
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
