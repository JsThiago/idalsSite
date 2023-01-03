import { useState } from "react";
import MenuTopNavigator from "../../components/menuTopNavigator";
import CadastrarPontosDeInteresse from "./cadastrarPontosDeInteresse";
import PontosCadastrados from "./pontosCadastrados";

export default function PontosDeInteresse() {
  const routesNames = ["Pontos cadastrados", "Cadastrar pontos de interesse"];
  const routesElements = [
    <PontosCadastrados />,
    <CadastrarPontosDeInteresse />,
  ];
  const [actualRoute, setActualRoute] = useState(0);
  return (
    <div>
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
