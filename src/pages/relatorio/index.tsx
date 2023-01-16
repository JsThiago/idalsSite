import Button from "../../components/button";
import Paper from "../../components/paper";
import Table from "../../components/table";
import Title from "../../components/title";

export default function Relatorio() {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        columnGap: "3rem",
        paddingLeft: "1rem",
      }}
    >
      <Paper
        style={{
          flex: 1,

          backgroundColor: "#E9E9E9",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          maxWidth: "40vw",
          borderRadius: "10px",
        }}
      >
        <Title style={{ marginTop: "5rem" }} value="Filtros" />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            marginTop: "4rem",

            minWidth: "100%",
            rowGap: "5rem",
          }}
        >
          <Paper
            style={{
              padding: "3rem",
              margin: "0 2rem",
              borderRadius: "10px",
            }}
          >
            <label
              style={{
                fontSize: "1rem",
                fontFamily: "inter",
                fontWeight: 500,
              }}
            >
              Funcionários:
            </label>
          </Paper>
          <Paper
            style={{
              padding: "3rem",
              margin: "0 2rem",
              borderRadius: "10px",
            }}
          >
            <label
              style={{ fontSize: "1rem", fontFamily: "inter", fontWeight: 500 }}
            >
              Local:
            </label>
          </Paper>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            rowGap: " 4rem",
          }}
        >
          <Button style={{ height: "4rem", width: "15rem" }} label="Buscar" />
          <Button style={{ height: "4rem", width: "15rem" }} label="Limpar" />
        </div>
      </Paper>
      <Paper
        style={{
          flex: 2,
          backgroundColor: "white",

          overflow: "scroll",
        }}
      >
        <Title
          style={{ marginTop: "5rem" }}
          value="Relatório de funcionários"
        />
        <div style={{ padding: "0 2rem" }}>
          <Table
            rows={[]}
            columns={[
              { name: "Matrícula", size: 0.7 },
              { name: "Nome", size: 1 },
              { name: "Data", size: 1 },
              { name: "Função", size: 1 },
              { name: "Batería", size: 1 },
            ]}
          />
        </div>
      </Paper>
    </div>
  );
}
