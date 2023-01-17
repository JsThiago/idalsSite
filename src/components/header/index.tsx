import React from "react";
import { useLocation } from "react-router-dom";
import Logo from "../logo";

export default function Header() {
  const path = useLocation().pathname;
  console.log(path);
  return (
    <header
      style={{
        backgroundColor: "white",
        flex: 1,
        display: "flex",
        padding: "2rem",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          color: "#301934",
          display: "flex",
          flex: 1,
          fontWeight: 100,
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        <div>
          <Logo />
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <a style={{ all: "unset", cursor: "pointer" }} href="#">
            <h2 style={{ fontWeight: 400 }}> SOBRE</h2>
          </a>
          <a style={{ all: "unset", cursor: "pointer" }} href="#">
            <h2 style={{ fontWeight: 400 }}> SUSTENTABILIDADE</h2>
          </a>
          <a style={{ all: "unset", cursor: "pointer" }} href="#">
            <h2 style={{ fontWeight: 400 }}> FORNECEDORES</h2>
          </a>{" "}
          <a
            style={{
              cursor: "pointer",
              border: "none",
              textDecoration: "none",
            }}
            href="#"
          >
            <h2
              style={{
                fontWeight: 400,
              }}
            >
              {" "}
              CADASTRO
            </h2>
          </a>
          <a style={{ all: "unset", cursor: "pointer" }} href="#">
            <h2 style={{ fontWeight: 400 }}> CONTATOS</h2>
          </a>
        </div>
      </div>
    </header>
  );
}
