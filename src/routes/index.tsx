import React, {
  MemoExoticComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import Dashboard from "../pages/dashboard";
import Relatorio from "../pages/relatorio";
import Login from "../pages/login";
import useLogin from "../hooks/useQuery/useLogin";
import { BodyLogin } from "../types";
import LoginErrado from "../erros/loginErrado";
import { useToast } from "../components/toast";
import { validateToken } from "../hooks/useQuery/api";
import Spin from "../components/spin";
import { setLocalStorageAsync } from "../utils/localStorageAsync";
import { useGlobalContext } from "../context/globalContext";
function BaseLayout({
  Component,
  onExit,
}: {
  Component: (() => JSX.Element) | MemoExoticComponent<() => JSX.Element>;
  onExit: () => void;
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
        <Menu onExit={onExit} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginLeft: "6rem",
          }}
        >
          <BarraDeNavegacao />
          <div style={{ padding: "3rem 3rem 3rem 3rem", minHeight: "110vh" }}>
            <Component />
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "black", flex: 1, display: "flex" }}>
        <Footer style={{ padding: "2rem" }} />
      </div>
    </div>
  );
}

function CustomRoutes() {
  console.log("no custom routes");
  const { toastCallTopRight } = useToast();
  const { setIsAuth, isAuth } = useGlobalContext();
  const login = useLogin();
  function onExit() {
    localStorage.removeItem("token");
    setIsAuth(false);
  }

  const onLogin = useCallback((dadosLogin: BodyLogin) => {
    try {
      login(
        dadosLogin,
        async (data) => {
          await setLocalStorageAsync("token", data.token);
          await setLocalStorageAsync(
            "usuario",
            JSON.stringify(data.funcionario)
          );
          setIsAuth(true);
        },
        (err, body, context) => {
          toastCallTopRight("Usuário ou senha inválidos");
          throw new LoginErrado("Usuário ou senha inválidos");
        }
      );
    } catch (e) {
      console.error("error");
    }
  }, []);

  console.info("auth", isAuth);
  function baseLayout(
    Component: (() => JSX.Element) | MemoExoticComponent<() => JSX.Element>
  ) {
    return <BaseLayout onExit={onExit} Component={Component} />;
  }
  if (!isAuth) {
    return <Login onLogin={onLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={baseLayout(Dashboard)} />
        <Route path="/cadastro" element={baseLayout(Cadastro)} />
        <Route path="/vinculos" element={baseLayout(Vinculos)} />
        <Route
          path="/areasDeInteresse"
          element={baseLayout(AreasDeInteresse)}
        />

        <Route
          path="/pontosDeInteresse"
          element={baseLayout(PontosDeInteresse)}
        />
        <Route
          path="/rotasDeInteresse"
          element={baseLayout(RotasDeInteresse)}
        />
        <Route
          path="visualizacaoIndividual"
          element={baseLayout(VisualizacaoIndividual)}
        />
        <Route
          path="visualizacaoEmGrupo"
          element={baseLayout(VisualizacaoEmGrupo)}
        />
        <Route path="relatorio" element={baseLayout(Relatorio)} />
        <Route path="*" element={baseLayout(NotFound)} />
      </Routes>
    </BrowserRouter>
  );
}

export default React.memo(CustomRoutes);
