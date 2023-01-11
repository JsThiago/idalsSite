import { memo, useContext, useState } from "react";
import Button from "../../components/button";
import CustomInput from "../../components/input";
import Paper from "../../components/paper";
import CustomSelect from "../../components/select";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";
import { GlobalContext } from "../../context/globalContext";

const OPTIONS_MOCK_GRUPO = [
  { value: 1, label: "Engenheiro" },
  { value: 2, label: "Visitante" },
  { value: 3, label: "Vigilante" },
];

const OPTIONS_MOCK_MODELOS = [
  { value: 1, label: "Cubecell" },
  { value: 2, label: "Heltec" },
  { value: 3, label: "ESP-32" },
];

function Cadastro() {
  const context = useContext(toastContext).toastCall as Function;
  const [inputPessoaNome, setPessoaNome] = useState<String>();
  const [inputPessoaTelefone, setPessoaTelefone] = useState<String>();
  const [inputPessoaMatricula, setPessoaMatricula] = useState<String>();
  const [inputCrachaNome, setCrachaNome] = useState<String>();
  const [inputCrachaUi, setCrachaUi] = useState<String>();
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
            <CustomInput label="Nome" placeholder="Ex: José da silva" onChange={(e)=>setPessoaNome(e.target.value)} />
          </div>
          <div style={{}}>
            <CustomInput label="Matrícula" placeholder="Ex: MAT000" onChange={(e)=>setPessoaMatricula(e.target.value)}/>
          </div>
          <div style={{}}>
            <CustomInput label="Telefone" placeholder="994356453" onChange={(e)=>setPessoaTelefone(e.target.value)}/>
          </div>
          <div style={{}}>
            <CustomInput label="E-mail*" placeholder="Ex: jose@gmail.com" />
          </div>
          <div style={{}}>
            <CustomInput label="Telefone 2*" placeholder="(31) 37214534" />
          </div>
          <div style={{}}>
            <CustomInput
              label="Endereço*"
              placeholder="Ex: Rua América, Bairro Jardim 145, CEP: 36543343"
            />
          </div>
          <div style={{}}>
            <CustomSelect options={OPTIONS_MOCK_GRUPO} label="Grupo*" />
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
              fetch('http://idals.com.br:3500/funcionario', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'},
                body: JSON.stringify( {
                  "nome": inputPessoaNome,
                  "telefone": inputPessoaTelefone,
                  "matricula": inputPessoaMatricula,
                  "login": " ",
                  "senha": " ",
                  "area": "marketing"
                })}).then(response => response.json())
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
            <CustomInput label="Nome" placeholder="Ex: José da Silva" onChange={(e)=>setCrachaNome(e.target.value)} />
          </div>
          <div style={{}}>
            <CustomInput label="devEUI" placeholder="Ex: 6e61d507c6284b81" onChange={(e)=>setCrachaUi(e.target.value)}/>
          </div>
          <div style={{}}>
          <CustomSelect options={OPTIONS_MOCK_MODELOS} label="MODELO*"/>
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
              fetch('http://idals.com.br:3500/cracha', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'},
                body: JSON.stringify( {
                  "devEUI": inputCrachaUi,
                  "nome":inputCrachaNome,
                  "description":"Beitian 220",
                  "deviceProfileID":"idals-device-ABP",
                  "modelo":"CubeCell"
                })}).then(response => response.json())
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
