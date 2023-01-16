import { memo, useContext, useEffect, useState } from "react";
import Button from "../../components/button";
import CustomInput from "../../components/input";
import Paper from "../../components/paper";
import CustomSelect from "../../components/select";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";
import { GlobalContext } from "../../context/globalContext";

const OPTIONS_MOCK = [
  { value: 1, label: "Engenheiro" },
  { value: 2, label: "Visitante" },
  { value: 3, label: "Vigilante" },
];
interface DadosArea {
  nome: string;
}
function Cadastro() {
  const context = useContext(toastContext).toastCall as Function;
  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [matricula, setMatricula] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const [devEUI, setDevEUI] = useState<string>("");
  const [nomeCracha, setNomeCracha] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [deviceProfileID, setDeviceProfileID] = useState<string>("");
  const [optionsArea, setOptionsArea] = useState<
    Array<{ value: string | number; label: string }>
  >([]);
  useEffect(() => {
    fetch("http://idals.com.br:3500/area").then((data) => {
      const optionsAreaAux: typeof optionsArea = [];
      data.json().then((areas: Array<DadosArea>) => {
        areas.forEach((area) => {
          optionsAreaAux.push({ label: area.nome, value: area.nome });
        });
        setOptionsArea(optionsAreaAux);
        setArea(optionsAreaAux[0].value as string);
      });
    });
    console.debug(optionsArea);
  }, []);
  const [area, setArea] = useState("");
  console.log("refresh");
  return (
    <>
      <Paper
        style={{
          display: "flex",
          padding: "1rem 0rem 3rem 0rem",
          flexDirection: "column",
          boxShadow: "0.5px 0.5px 1px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "3rem" }}>
          <Title value="Cadastro de pessoas" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,30rem)",
            gridColumnGap: "5rem",
            padding: "0 5rem",
            gridRowGap: "2rem",
          }}
        >
          <div style={{}}>
            <CustomInput
              onChange={(text: string) => {
                setNome(text);
              }}
              label="Nome"
              placeholder="Ex: José da silva"
            />
          </div>
          <div style={{}}>
            <CustomInput
              onChange={(text) => {
                setMatricula(text);
              }}
              label="Matrícula"
              placeholder="Ex: 1234532553"
            />
          </div>
          <div style={{}}>
            <CustomInput
              label="Telefone"
              onChange={(text) => {
                setTelefone(text);
              }}
              placeholder="(31) 994356453"
            />
          </div>
          <div style={{}}>
            <CustomInput
              label="Login"
              onChange={(text) => {
                setLogin(text);
              }}
              placeholder="Ex: joseSilva"
            />
          </div>
          <div style={{}}>
            <CustomInput
              label="Senha"
              onChange={(text) => {
                setSenha(text);
              }}
              placeholder="Ex: 12330420BR"
            />
          </div>

          <div style={{}}>
            <CustomSelect
              value={area}
              onChange={(value) => {
                setArea(value as string);
              }}
              options={optionsArea}
              label="Grupo"
            />
          </div>
        </div>
        <div
          style={{
            padding: "2rem",
            justifyContent: "flex-end",
            display: "flex",
            marginTop: "4rem",
          }}
        >
          <Button
            onClick={() => {
              if (
                nome === "" ||
                matricula === "" ||
                telefone === "" ||
                login === "" ||
                senha === ""
              ) {
                context("Existem campos com valores inválidos");
                return;
              }
              console.log(area);
              const body = { nome, telefone, matricula, login, senha, area };
              context("Realizando cadastro");
              fetch("http://idals.com.br:3500/funcionario", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "content-type": "application/json" },
              }).then((response) => {
                if (response.status === 201)
                  context("Cadastro realizado com sucesso");
                else context("Falha ao realizar o cadastro");
              });
              context("Cadastro realizado com sucesso");
            }}
            label="Cadastrar"
          />
        </div>
      </Paper>
      <Paper
        style={{
          marginTop: "2rem",
          display: "flex",
          padding: "1rem 0rem 3rem 0rem",
          flexDirection: "column",
          boxShadow: "0.5px 0.5px 1px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "3rem" }}>
          <Title value="Cadastro de crachás" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,30rem)",
            gridColumnGap: "5rem",
            padding: "0 5rem",
            gridRowGap: "2rem",
          }}
        >
          <div style={{}}>
            <CustomInput
              onChange={(text) => {
                setDevEUI(text);
              }}
              label="DevEUI"
              placeholder="Ex: 6e61d507c6284b80"
            />
          </div>
          <div style={{}}>
            <CustomInput
              onChange={(text) => {
                setNomeCracha(text);
              }}
              label="Nome"
              placeholder="Ex: cracha8-ABP"
            />
          </div>
          <div style={{}}>
            <CustomInput
              onChange={(text) => {
                setDescricao(text);
              }}
              label="Descrição"
              placeholder="Ex: Beitian 220"
            />
          </div>
          <div style={{}}>
            <CustomInput
              onChange={(text) => {
                setDeviceProfileID(text);
              }}
              label="Devide profile ID"
              placeholder="Ex: idals-device-ABP"
            />
          </div>
          <div style={{}}>
            <CustomInput
              onChange={(text) => {
                setModelo(text);
              }}
              label="Modelo"
              placeholder="Ex: CubeCell"
            />
          </div>
        </div>
        <div
          style={{
            padding: "2rem",
            justifyContent: "flex-end",
            display: "flex",
            marginTop: "4rem",
          }}
        >
          <Button
            onClick={() => {
              if (
                devEUI === "" ||
                nomeCracha === "" ||
                descricao === "" ||
                deviceProfileID === "" ||
                modelo === ""
              ) {
                context("Alguns campos possuem valores inválidos");
                return;
              }
              const data = JSON.stringify({
                devEUI,
                nome: nomeCracha,
                description: descricao,
                deviceProfileID,
                modelo,
              });
              fetch("http://idals.com.br:3500/cracha", {
                method: "POST",
                body: data,
                headers: { "content-type": "application/json" },
              })
                .then((response) => {
                  if (response.status === 201) {
                    context("Crachá cadastrado com sucesso");
                    return;
                  }
                  if (response.status === 409) {
                    context("Já existe um crachá com esse id");
                    return;
                  }
                  context("Erro, por favor tente mais tarde");
                })
                .catch(() => {
                  context("Erro, por favor tente mais tarde");
                });
            }}
            label="Cadastrar"
          />
        </div>
      </Paper>
    </>
  );
}

export default memo(Cadastro);
