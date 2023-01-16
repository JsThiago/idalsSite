import React, { MemoExoticComponent } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BarraDeNavegacao from "../components/barraDeNavegacao";
import Footer from "../components/footer";
import Header from "../components/header";
import Menu from "../components/menu";
import NotFound from "../pages/404";
import AreasDeInteresse from "../pages/areasDeInteresse";
import Cadastro from "../pages/cadastro";
import PontosDeInteresse from "../pages/pontosDeInteresse";
import RotasDeInteresse from "../pages/rotasDeInteresse";
import Vinculos from "../pages/vinculos";
import VisualizacaoEmGrupo from "../pages/visualizacaoEmGrupo";
import VisualizacaoIndividual from "../pages/visualizacaoIndividual";
import packageJson from "../../package.json";
import Dashboard from "../pages/dashboard";
import Relatorio from "../pages/relatorio";
function BaseLayout({
  Component,
}: {
  Component: (() => JSX.Element) | MemoExoticComponent<() => JSX.Element>;
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba( 211,211,211,0.2)",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
      className="App"
    >
      <Header />
      <div
        style={{ display: "flex", flexDirection: "row", position: "relative" }}
      >
        <Menu />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginLeft: "6rem",
          }}
        >
          <BarraDeNavegacao />
          <div style={{ padding: "3rem 3rem 3rem 3rem", minHeight: "100vh" }}>
            <Component />
          </div>
        </div>
      </div>
      <div style={{ maxHeight: "1px" }}>
        <Footer style={{ padding: "2rem" }} />
      </div>
    </div>
  );
}

function CustomRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout Component={Dashboard} />} />
        <Route path="/cadastro" element={<BaseLayout Component={Cadastro} />} />
        <Route path="/vinculos" element={<BaseLayout Component={Vinculos} />} />
        <Route
          path="/areasDeInteresse"
          element={<BaseLayout Component={AreasDeInteresse} />}
        />

        <Route
          path="/pontosDeInteresse"
          element={<BaseLayout Component={PontosDeInteresse} />}
        />
        <Route
          path="/rotasDeInteresse"
          element={<BaseLayout Component={RotasDeInteresse} />}
        />
        <Route
          path="visualizacaoIndividual"
          element={<BaseLayout Component={VisualizacaoIndividual} />}
        />
        <Route
          path="visualizacaoEmGrupo"
          element={<BaseLayout Component={VisualizacaoEmGrupo} />}
        />
        <Route
          path="relatorio"
          element={<BaseLayout Component={Relatorio} />}
        />
        <Route path="*" element={<BaseLayout Component={NotFound} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default React.memo(CustomRoutes);
