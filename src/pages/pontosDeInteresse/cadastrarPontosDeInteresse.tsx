import { useContext } from "react";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import CustomInput from "../../components/input";
import Paper from "../../components/paper";
import CustomSelect from "../../components/select";
import Table from "../../components/table";
import Title from "../../components/title";
import { toastContext, useToast } from "../../components/toast";

export default function CadastrarPontosDeInteresse() {
  const callToast = useToast().toastCall as Function;
  return (
    <Paper
      style={{
        display: "flex",
        padding: "1rem 0rem 3rem 0rem",
        flexDirection: "column",
        boxShadow: "0.5px 0.5px 1px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          marginBottom: "3rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Title value="Pontos de interesse &nbsp;>" />
        <h2
          style={{
            fontWeight: 400,
            margin: "0.22rem 0 0 0",
          }}
        >
          &nbsp; Cadastrar pontos de interesse
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,30rem)",
          padding: "0 5rem",
          gridColumnGap: "5rem",
          gridRowGap: "2rem",
        }}
      >
        <div style={{}}>
          <CustomInput label="Nome do produto" placeholder="Ex: Estação 1" />
        </div>
        <div style={{}}>
          <CustomInput
            label="Descrição"
            placeholder="Ex: Estação 1 próxima à mina"
          />
        </div>
        <div style={{}}>
          <CustomInput label="Latitude" placeholder="Ex: -45.44325" />
        </div>
        <div style={{}}>
          <CustomInput label="Longitude" placeholder="Ex: -43.45344" />
        </div>
        <div style={{}}>
          <CustomInput label="Altitude" placeholder="Ex: 300" />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "2rem",
          marginTop: "4rem",
        }}
      >
        <Button
          label="Cadastrar"
          onClick={() => {
            callToast("Ponto cadastrado com sucesso");
          }}
        />
      </div>
    </Paper>
  );
}
