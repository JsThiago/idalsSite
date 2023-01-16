import { CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import Aim from "./icons/aim";
import Arrows from "./icons/arrows";
import MarkGps from "./icons/markGps";
import Person from "./icons/person";
import PinGps from "./icons/pinGps";
import Plus from "./icons/plus";
import Relatorio from "./icons/relatorio";
import TwoPersons from "./icons/twoPersons";
import "./styles.css";
export default function Menu() {
  const path = useLocation().pathname;
  const routes: Array<{
    name: string;
    path: string;
    Icon: ({ color }: { color: string }) => JSX.Element;
  }> = [
    {
      name: "Cadastro",
      path: "cadastro",
      Icon: ({ color }: { color: string }) => <Plus color={color} />,
    },
    {
      name: "Vínculos",
      path: "vinculos",
      Icon: ({ color }) => <Arrows color={color} />,
    },
    {
      name: "Pontos<br>de interesse",
      path: "pontosDeInteresse",
      Icon: ({ color }) => <PinGps color={color} />,
    },

    {
      name: "Visualização<br>individual",
      path: "visualizacaoIndividual",
      Icon: ({ color }) => <Person color={color} />,
    },
    {
      name: "Visualização<br>em grupo",
      path: "visualizacaoEmGrupo",
      Icon: ({ color }) => <TwoPersons color={color} />,
    },
    {
      name: "Relatório",
      path: "relatorio",
      Icon: ({ color }) => <Relatorio color={color} />,
    },
  ];
  const styleSelect: CSSProperties = {
    backgroundColor: "white",
    color: "#301934",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    paddingLeft: "2rem",
    display: "flex",
    alignItems: "center",
  };
  return (
    <div
      className="lateral-menu"
      style={{
        backgroundColor: "#410D5B",
        color: "white",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          marginTop: 0,
          display: "flex",
          flex: 0.5,
          justifyContent: "center",
          alignContent: "center",
          paddingTop: "4rem",

          paddingBottom: "1rem",
        }}
      >
        <Link style={{ color: "white", textDecoration: "none" }} to="/">
          <span>IDALS</span>
        </Link>
      </h1>
      <div
        style={{
          display: "grid",
          rowGap: "1rem",
          gridTemplateColumns: "100%",
          flexDirection: "column",
          gridTemplateRows: "repeat(7,8rem)",
          justifyContent: "space-evenly",
          flex: 1,
        }}
      >
        {routes.map((route) => (
          <>
            <Link
              style={{
                all: "unset",
                cursor: "pointer",
                minHeight: "8rem",
                maxHeight: "8rem",
                position: "relative",
              }}
              to={"/" + route.path}
            >
              <h2
                style={
                  path === "/" + route.path
                    ? styleSelect
                    : {
                        paddingTop: "1rem",
                        paddingBottom: "1rem",
                        paddingLeft: "2rem",

                        display: "flex",
                        alignItems: "center",
                      }
                }
              >
                <route.Icon
                  color={path === "/" + route.path ? "#410D5B" : "white"}
                />
                <span
                  className="menu-options-text"
                  style={{ marginLeft: "1.5rem" }}
                >
                  {route.name.split("<br>").map((word) => (
                    <>
                      {word}
                      <br />
                    </>
                  ))}
                </span>
              </h2>
            </Link>
          </>
        ))}
      </div>
    </div>
  );
}
