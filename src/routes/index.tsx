import React, { MemoExoticComponent, useEffect, useState } from "react";
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
import Login from "../pages/login";
function BaseLayout({
  Component,
  onExit
}: {
  Component: (() => JSX.Element) | MemoExoticComponent<() => JSX.Element>;
  onExit:()=>void
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
        <Menu onExit={onExit}/>
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
      <div style={{backgroundColor:"black",flex:1,display:"flex"}}>
        <Footer style={{ padding: "2rem" }} />
      </div>
    </div>
  );
}

function CustomRoutes() {
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token) setIsAuth(true)
  },[])
  function onExit(){
    localStorage.removeItem("token");
    setIsAuth(false);
  }
  const [isAuth,setIsAuth] = useState(false);
  if(!isAuth){
    return <Login onLogin={()=>{
      setIsAuth(true);
      localStorage.setItem("token","token")
    }}/>
  }
  function baseLayout(Component:(() => JSX.Element) | MemoExoticComponent<() => JSX.Element>){
      return <BaseLayout onExit={onExit} Component={Component}/>
  }
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={baseLayout(Dashboard)} />
        <Route path="/cadastro" element={baseLayout(Cadastro)}  />
        <Route path="/vinculos" element={baseLayout(Vinculos) } />
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
        <Route
          path="relatorio"
          element={baseLayout(Relatorio)}
        />
        <Route path="*" element={baseLayout(NotFound)} />
      </Routes>
    </BrowserRouter>
  );
}

export default React.memo(CustomRoutes);
