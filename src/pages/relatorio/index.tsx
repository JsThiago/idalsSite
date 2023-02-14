import { useEffect, useRef, useState } from "react";
import Button from "../../components/button";
import MultiSelect from "../../components/multiSelect";
import Paper from "../../components/paper";
import Table from "../../components/table";
import Title from "../../components/title";
import { useToast } from "../../components/toast";
import { DadosFuncionarios } from "../../types";

export default function Relatorio() {
  const toast = useToast();
  const [rows, setRows] = useState<Array<Array<any>>>([]);
  async function buscarDados() {
    setRows([]);
    const search = "todos" in areasSelected ? opcoesAreas : areasSelected;
    let quant = 0;
    const rowsAux: typeof rows = [];
    const promises = Object.entries(
      search as Record<string | number, string | number>
    ).map(async ([key, value]) => {
      try {
        const response = await fetch(
          "https://bigdata.idals.com.br/data/status?area=" + key
        );
        if (response.status !== 200) return;
        const dados = await response.json();
        dados?.forEach((dado: any) => {
          rowsAux.push([
            funcionarios.current[dado?.nome_funcionario]?.matricula,
            funcionarios.current[dado?.nome_funcionario]?.nome,
            new Date(dado.date).toDateString(),
            funcionarios.current[dado?.nome_funcionario]?.area,
            dado?.bateria,
          ]);
        });
      } catch (e) {
        console.error(e);
      } finally {
        console.log(promises);
      }
      Promise.all(promises)
        .then(() => {
          setRows(rowsAux);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {});
    });
  }

  const funcionarios = useRef<Record<string, DadosFuncionarios>>({});
  useEffect(() => {
    fetch("https://api.idals.com.br/funcionario").then((response) => {
      response.json().then((funcionariosValue: Array<DadosFuncionarios>) => {
        funcionariosValue.forEach((funcionarioValue) => {
          funcionarios.current[funcionarioValue.nome] = funcionarioValue;
        });
      });
    });

    fetch("https://api.idals.com.br/localizacao").then((response) => {
      response.json().then((areas: Array<any>) => {
        const opcoesAreaAux: typeof opcoesAreas = {};

        areas.forEach((area) => {
          opcoesAreaAux[area.id] = area.nome;
        });

        setOpcoesAreas(opcoesAreaAux);
      });
    });
  }, []);
  const [opcoesAreas, setOpcoesAreas] =
    useState<Record<string | number, string | number>>();
  const [areasSelected, setAreaSelect] = useState<
    Record<string | number, string | number>
  >({});

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
          maxWidth: "40vw",
          boxSizing: "border-box",
          rowGap: "3rem",
          height: "fit-content",
          borderRadius: "10px",
          paddingBottom: "3rem",
        }}
      >
        <Title style={{ marginTop: "5rem" }} value="Filtros" />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",

            minWidth: "100%",
          }}
        >
          <Paper
            style={{
              padding: "3rem",
              margin: "0 2rem",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "1rem",
            }}
          >
            <label
              style={{ fontSize: "1rem", fontFamily: "inter", fontWeight: 500 }}
            >
              Local:
            </label>
            <MultiSelect
              onSelectAll={() => {
                setAreaSelect({ todos: "Todos" });
              }}
              onRemoveAll={() => {
                setAreaSelect({});
              }}
              selected={areasSelected}
              onRemove={(value) => {
                const areasSelectedCopy = { ...areasSelected };
                delete areasSelectedCopy[value[0]];
                setAreaSelect(areasSelectedCopy);
              }}
              onSelect={(value) => {
                if ("todos" in areasSelected) {
                  setAreaSelect({ [value[0]]: value[1] });
                  return;
                }
                const areasSelectedCopy = { ...areasSelected };
                areasSelectedCopy[value[0]] = value[1];
                setAreaSelect(areasSelectedCopy);
              }}
              options={opcoesAreas}
            />
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
          <Button
            onClick={() => {
              toast.toastCall("Por favor aguarde", 1000);
              buscarDados();
            }}
            style={{ height: "4rem", width: "15rem" }}
            label="Buscar"
          />
          <Button
            onClick={() => {
              setAreaSelect({});
            }}
            style={{ height: "4rem", width: "15rem" }}
            label="Limpar"
          />
        </div>
      </Paper>
      <Paper
        style={{
          flex: 1,
          minHeight: "100vh",
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
            rows={rows}
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
