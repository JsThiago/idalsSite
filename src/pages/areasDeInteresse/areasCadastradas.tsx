import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import EditButton from "../../components/editButton";
import Paper from "../../components/paper";
import Table from "../../components/table";
import Title from "../../components/title";
import { useToast } from "../../components/toast";

export default function AreasCadastradas() {
  const toast = useToast();
  return (
    <Paper
      style={{
        display: "flex",
        padding: "1em 0rem 3rem 0rem",
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
          &nbsp; Áreas cadastrados
        </h2>
      </div>
      <div style={{ padding: "0 3rem" }}>
        <Table
          rows={[
            [
              <Checkbox
                style={{
                  borderRadius: "4px",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />,
              "Área da barragem 1",
              "Coordenadas : xxxxxx xxxxxx",
              <EditButton />,
            ],
            [
              <Checkbox
                style={{
                  borderRadius: "4px",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />,
              "Área da barragem 2",
              "Coordenadas : xxxxxx xxxxxx",
              <EditButton />,
            ],
            [
              <Checkbox
                style={{
                  borderRadius: "4px",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />,
              "Área da barragem 3",
              "Coordenadas : xxxxxx xxxxxx",
              <EditButton />,
            ],
            [
              <Checkbox
                style={{
                  borderRadius: "4px",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />,
              "Área da barragem 4",
              "Coordenadas : xxxxxx xxxxxx",
              <EditButton />,
            ],
          ]}
          columns={[
            {
              name: (
                <Checkbox
                  style={{
                    borderRadius: "4px",
                    width: "1.5rem",
                    height: "1.5rem",
                  }}
                />
              ),
              size: 0.2,
            },
            { name: "Nome do ponto", size: 1 },
            { name: "Detalhes", size: 1 },
            { name: "Editar", size: 1 },
          ]}
        />
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
          label="Salvar"
          onClick={() => {
            toast.toastCall("Áreas salvas com sucesso");
          }}
        />
      </div>
    </Paper>
  );
}
