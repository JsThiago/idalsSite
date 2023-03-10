import React from "react";
import { useEffect, useRef, useState } from "react";
import MultiSelect from "../../components/multiSelect";
import Paper from "../../components/paper";
import Table from "../../components/table";
import Title from "../../components/title";
import { useToast } from "../../components/toast";
import { DadosFuncionarios } from "../../types";

export default function RelatorioLocal() {
  const toast = useToast();
  const [rows, setRows] = useState<Array<Array<any>>>([]);
  const [page, setPage] = useState(0);
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
        flexDirection: "column",
        columnGap: "3rem",
        rowGap: "3rem",
        paddingLeft: "1rem",
      }}
    >
      <Paper
        style={{
          flex: 1,
          minHeight: "100vh",
          backgroundColor: "white",
          overflow: "auto",
        }}
      >
        <Title style={{ marginTop: "5rem" }} value="Relatório de locais" />
        <div
          style={{
            padding: "0 2rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              rowGap: "1rem",
            }}
          >
            <label
              style={{ fontSize: "1rem", fontFamily: "inter", fontWeight: 500 }}
            >
              Locais:
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
          </div>
          <Table
            rows={rows}
            columns={[
              { name: "Nome da área", size: 1 },
              { name: "Funcionário", size: 1 },
              { name: "De", size: 1 },
              { name: "Até", size: 1 },
            ]}
          />
        </div>
      </Paper>
    </div>
  );
}
