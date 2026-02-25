import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./store/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <ToastContainer
        toastStyle={{
          borderRadius: "100px",
          padding: "2px",
          backgroundColor: "rgba(11, 28, 65, 1)"
        }}
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        closeButton={false}
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </AuthProvider>
  );
}

export default App;

