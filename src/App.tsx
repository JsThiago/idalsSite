import React, { useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header";
import Menu from "./components/menu";
import CustomRoutes from "./routes";
import GlobalContextWrapper from "./context/globalContext";
import ToastProvider from "./components/toast";

function App() {
  return (
    <ToastProvider>
      {useMemo(
        () => (
          <CustomRoutes />
        ),
        []
      )}
    </ToastProvider>
  );
}

export default App;
