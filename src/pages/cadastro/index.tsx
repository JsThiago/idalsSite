import { useState } from "react";
import CriacaoLocaisDeInteresse from "../../components/criacaoLocaisDeInteresse";
import MenuTopNavigator from "../../components/menuTopNavigator";
import CadastroDePessoas from "./cadastroDePessoas";
import ListagemDeCrachas from "./listagemDeCrachas";
import ListagemDeFuncionario from "./listagemDeFuncionarios";

export default function PontosDeInteresse() {
  const routesNames = [
    "Funcionários cadastrados",
    "Crachás cadastrados",
    "Cadastros",
  ];
  const routesElements = [
    <ListagemDeFuncionario />,
    <ListagemDeCrachas />,
    <CadastroDePessoas />,
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
