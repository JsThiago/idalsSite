import { useState } from "react";
import MenuTopNavigator from "../../components/menuTopNavigator";
import CadastrarAreasDeInteresse from "./cadastrarAreasDeInteresse";
import AreasCadastradas from "./areasCadastradas";

export default function AreasDeInteresse() {
  const routesNames = ["Áreas cadastradas", "Cadastrar áreas de interesse"];
  const routesElements = [<AreasCadastradas />, <CadastrarAreasDeInteresse />];
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
