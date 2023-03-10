import React, { useState } from "react";
import MenuTopNavigator from "../../components/menuTopNavigator";
import RelatorioFuncionario from "./funcionarios";
import RelatorioPanico from "./panicos";
import RelatorioLocal from "./locais";
export default function Relatorio() {
  const routesNames = ["Locais", "Funcionários", "Pânicos"];
  const routesElements = [
    <RelatorioLocal />,
    <RelatorioFuncionario />,
    <RelatorioPanico />,
  ];
  const [actualRoute, setActualRoute] = useState(0);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <MenuTopNavigator
        options={routesNames}
        actualRoute={actualRoute}
        onChangeRoute={(route) => {
          setActualRoute(route);
        }}
      />
      {routesElements[actualRoute]}
    </div>
  );
}
