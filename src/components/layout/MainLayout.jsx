import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout({ children, title }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-body)", overflow: "hidden" }}>
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      {/* Mobile overlay for open sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header title={title} onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="p-3 p-md-4" style={{ flex: 1, position: "relative" }}>
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
