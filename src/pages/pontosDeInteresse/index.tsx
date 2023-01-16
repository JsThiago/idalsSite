import { useState } from "react";
import CriacaoLocaisDeInteresse from "../../components/criacaoLocaisDeInteresse";
import MenuTopNavigator from "../../components/menuTopNavigator";
import CadastrarPontosDeInteresse from "./cadastrarPontosDeInteresse";
import PontosCadastrados from "./pontosCadastrados";

export default function PontosDeInteresse() {
  const routesNames = ["Pontos cadastrados", "Cadastrar pontos de interesse"];
  const routesElements = [<PontosCadastrados />, <CriacaoLocaisDeInteresse />];
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
