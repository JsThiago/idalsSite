import React, { useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header";
import Menu from "./components/menu";
import CustomRoutes from "./routes";
import GlobalContextWrapper from "./context/globalContext";
import QueryContextWrapper from "./context/reactQuery";
import ToastProvider from "./components/toast";

function App() {
  return (
    <ToastProvider>
      <QueryContextWrapper>
        <GlobalContextWrapper>
          {useMemo(
            () => (
              <CustomRoutes />
            ),
            []
          )}
        </GlobalContextWrapper>
      </QueryContextWrapper>
    </ToastProvider>
  );
}

export default App;
