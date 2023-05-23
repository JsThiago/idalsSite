import React, { useState } from "react";
import Button from "../../components/button";
import Logo from "../../components/logo";
import { BodyLogin } from "../../types";
import version from "../../version.json";
export default function Login({
  onLogin,
}: {
  onLogin: (dadosLogin: BodyLogin) => void;
}) {
  const [login, setLogin] = useState({ user: "", pass: "" });
  return (
    <div
      style={{
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <img
        style={{ objectFit: "fill", height: "100vh", width: "100vw" }}
        src="mapa.jpg"
        alt="mapa"
      />
      <div
        style={{
          flexDirection: "column",
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.7)",
          width: "100vw",
          height: "100vh",
          top: 0,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Logo size={2} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "2.5rem",
            flex: 2,
            justifyContent: "center",
          }}
        >
          <input
            value={login.user}
            onChange={(e) => {
              const loginAux = { ...login };
              loginAux.user = e.target.value;
              setLogin(loginAux);
            }}
            placeholder="Usuário"
            style={{
              fontSize: "1.5rem",
              padding: "0.4rem",
              textAlign: "center",
            }}
          />
          <input
            type="password"
            onChange={(e) => {
              const loginAux = { ...login };
              loginAux.pass = e.target.value;
              setLogin(loginAux);
            }}
            value={login.pass}
            placeholder="Senha"
            style={{
              fontSize: "1.5rem",
              padding: "0.4rem",
              textAlign: "center",
            }}
          />
        </div>
        <div style={{ marginTop: "5rem", flex: 1 }}>
          <Button
            onClick={() => {
              try {
                onLogin({
                  login: login.user,
                  senha: login.pass,
                });
                return;
              } catch (e) {
                console.error(e);
              }
            }}
            label="Entrar"
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            color: "rgba(255,255,255,0.8)",
            width: "90%",
            textAlign: "end",
          }}
        >
          © Idals {new Date().getFullYear()} ver {version.version}
        </div>
      </div>
    </div>
  );
}
