import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        closeButton={false}
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </>
  );
}

export default App;
