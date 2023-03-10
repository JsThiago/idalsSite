import React from "react";
import { useEffect, useRef, useState } from "react";
import Button from "../../components/button";
import MultiSelect from "../../components/multiSelect";
import Paper from "../../components/paper";
import RadioGroup from "../../components/radioGroup";
import Table from "../../components/table";
import Title from "../../components/title";
import { useToast } from "../../components/toast";
import { DadosFuncionarios } from "../../types";

export default function RelatorioFuncionario() {
  const toast = useToast();
  const [rows, setRows] = useState<Array<Array<any>>>([]);

  /*async function buscarDados() {
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
*/
  const [optionsFuncionarios, setOptionsFuncionarios] = useState<
    Record<string | number, string | number>
  >({});
  const [funcionariosSelected, setFuncionariosSelected] = useState<
    typeof optionsFuncionarios
  >({});
  useEffect(() => {
    const optionsFuncionariosAux: typeof optionsFuncionarios = {};
    fetch("https://api.idals.com.br/funcionario").then((response) => {
      response.json().then((funcionariosValue: Array<DadosFuncionarios>) => {
        funcionariosValue.forEach((funcionarioValue) => {
          optionsFuncionariosAux[funcionarioValue.id] = funcionarioValue.nome;
        });
        console.debug(optionsFuncionariosAux);
        setOptionsFuncionarios(optionsFuncionariosAux);
      });
    });
  }, []);

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
        <Title
          style={{ marginTop: "5rem" }}
          value="Relatório de funcionários"
        />
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
              flexDirection: "column",
              rowGap: "1rem",
              flex: 1,
            }}
          >
            <label
              style={{ fontSize: "1rem", fontFamily: "inter", fontWeight: 500 }}
            >
              Funcionários:
            </label>
            <MultiSelect
              onSelectAll={() => {
                setFuncionariosSelected({ todos: "Todos" });
              }}
              onRemoveAll={() => {
                setFuncionariosSelected({});
              }}
              selected={funcionariosSelected}
              onRemove={(value) => {
                const funcionariosSelectedCopy = { ...funcionariosSelected };
                delete funcionariosSelectedCopy[value[0]];
                setFuncionariosSelected(funcionariosSelectedCopy);
              }}
              onSelect={(value) => {
                if ("todos" in funcionariosSelected) {
                  setFuncionariosSelected({ [value[0]]: value[1] });
                  return;
                }
                const funcionariosSelectedCopy = { ...funcionariosSelected };
                funcionariosSelectedCopy[value[0]] = value[1];
                setFuncionariosSelected(funcionariosSelectedCopy);
              }}
              options={optionsFuncionarios}
            />
          </div>
          <Table
            rows={rows}
            columns={[
              { name: "Matrícula", size: 1 },
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
