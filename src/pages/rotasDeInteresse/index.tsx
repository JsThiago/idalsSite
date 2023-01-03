import { useState } from "react";
import MenuTopNavigator from "../../components/menuTopNavigator";
import CadastrarRotasDeInteresse from "./cadastrarRotasDeInteresse";
import PontosCadastrados from "./rotasCadastradas";

export default function RotasDeInteresse() {
  console.log("i rerender");
  const routesNames = ["Rotas cadastradas", "Cadastrar rotas de interesse"];
  const routesElements = [<PontosCadastrados />, <CadastrarRotasDeInteresse />];
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
