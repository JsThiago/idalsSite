import { CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import Aim from "./icons/aim";
import Arrows from "./icons/arrows";
import MarkGps from "./icons/markGps";
import Person from "./icons/person";
import PinGps from "./icons/pinGps";
import Plus from "./icons/plus";
import TwoPersons from "./icons/twoPersons";

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
      name: "Áreas<br>de interesse",
      path: "areasDeInteresse",
      Icon: ({ color }) => <Aim color={color} />,
    },
    {
      name: "Rotas<br>de interesse",
      path: "rotasDeInteresse",
      Icon: ({ color }) => <MarkGps color={color} />,
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
      style={{
        backgroundColor: "#410D5B",
        color: "white",
        maxWidth: "20rem",
        minWidth: "20rem",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <div>
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
          <span>IDALS</span>
        </h1>
      </div>
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
                <span style={{ marginLeft: "1.5rem" }}>
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
