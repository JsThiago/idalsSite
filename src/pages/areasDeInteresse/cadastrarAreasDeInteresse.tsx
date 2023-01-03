import { useContext } from "react";
import Button from "../../components/button";
import CustomInput from "../../components/input";
import Paper from "../../components/paper";
import CustomSelect from "../../components/select";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";
const MOCK_OBS = [
  { label: "Área de rastreamento", value: 1 },
  { label: "Localização", value: 2 },
  { label: "Área de risco", value: 3 },
];
export default function CadastrarAreasDeInteresse() {
  const callToast = useContext(toastContext).toastCall as Function;
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
        <Title value="Áreas de interesse &nbsp;>" />
        <h2
          style={{
            fontWeight: 400,
            margin: "0.22rem 0 0 0",
          }}
        >
          &nbsp; Cadastrar áreas de interesse
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          padding: "0 5rem",
          gridTemplateColumns: "repeat(2,30rem)",
          gridColumnGap: "5rem",
          gridRowGap: "5rem",
        }}
      >
        <div style={{}}>
          <CustomInput label="Nome" placeholder="Ex: Área 1" />
        </div>
        <div style={{}}>
          <CustomInput
            label="Descrição"
            placeholder="Ex: Área 1 próxima à mina"
          />
        </div>
        <div
          style={{
            rowGap: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CustomInput label="Coordenada 1" placeholder="Ex: -45.44325" />
          <CustomInput placeholder="Ex: -45.44325" />
          <CustomInput placeholder="Ex: -45.44325" />
        </div>
        <div
          style={{
            rowGap: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CustomInput
            label="Coordenada em caso de reta"
            placeholder="Ex: -45.44325"
          />
          <CustomInput placeholder="Ex: -45.44325" />
          <CustomInput placeholder="Ex: -45.44325" />
        </div>
        <div
          style={{
            rowGap: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CustomInput label="Coordenada 2" placeholder="Ex: -45.44325" />
          <CustomInput placeholder="Ex: -45.44325" />
          <CustomInput placeholder="Ex: -45.44325" />
        </div>
        <div style={{}}>
          <CustomSelect label="Observações" options={MOCK_OBS} />
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
            callToast("Área cadastrada com sucesso");
          }}
        />
      </div>
    </Paper>
  );
}
