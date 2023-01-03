import { memo, useContext } from "react";
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
function Cadastro() {
  const context = useContext(toastContext).toastCall as Function;
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
            <CustomInput label="Nome" placeholder="Ex: José da silva" />
          </div>
          <div style={{}}>
            <CustomInput label="Matrícula" placeholder="Ex: 1234532553" />
          </div>
          <div style={{}}>
            <CustomInput label="Telefone" placeholder="(31) 994356453" />
          </div>
          <div style={{}}>
            <CustomInput label="E-mail" placeholder="Ex: jose@gmail.com" />
          </div>
          <div style={{}}>
            <CustomInput label="Telefone 2" placeholder="(31) 37214534" />
          </div>
          <div style={{}}>
            <CustomInput
              label="Endereço"
              placeholder="Ex: Rua América, Bairro Jardim 145, CEP: 36543343"
            />
          </div>
          <div style={{}}>
            <CustomSelect options={OPTIONS_MOCK} label="Grupo" />
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
            <CustomInput label="Nome" placeholder="Ex: 012343451" />
          </div>
          <div style={{}}>
            <CustomInput label="Matrícula" placeholder="Ex: 1234532553" />
          </div>
          <div style={{}}>
            <CustomInput label="Modelo" placeholder="(31) 994356453" />
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
              context("Cadastro realizado com sucesso");
            }}
            label="Cadastrar"
          />
        </div>
      </Paper>
    </>
  );
}

export default memo(Cadastro);
