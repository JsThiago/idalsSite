import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Paper from "../../components/paper";
import { MdDeleteOutline } from "react-icons/md";
import Table from "../../components/table";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";
import { DadosFuncionarios } from "../../types";

import DeleteConfirm from "../../components/deleteConfirm";
import useFuncionarios from "../../hooks/useQuery/useFuncionarios";
import useSemRelacao from "../../hooks/useQuery/useSemRelacao";

export default function ListagemDeFuncionarios() {
  const [functionDelete, setFunctionDelete] = useState<() => void>(
    () => () => {}
  );
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [subTitleDelete, setSubTitleDelete] = useState<
    string | Array<React.ReactElement>
  >("");

  const { data, isError, isLoading, deleteFuncionario } = useFuncionarios();
  const { data: dataSemRelacao, isLoading: isLoadingSemRelacao } =
    useSemRelacao();
  const memorizedDataSemRelacao = useMemo(
    () => dataSemRelacao,
    [dataSemRelacao]
  );
  const memorizedData = useMemo(() => data, [data]);
  const [semRelacoes, setSemRelacoes] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<
    Array<[string, string, string, string, JSX.Element]>
  >([]);
  const toastCall = useContext(toastContext).toastCall as Function;
  useEffect(() => {
    if (!isLoadingSemRelacao) {
      const semRelacoesAux: typeof semRelacoes = {};
      console.log("memorized", memorizedDataSemRelacao);
      memorizedDataSemRelacao?.funcionarios.forEach((funcionario: any) => {
        semRelacoesAux[funcionario.nome] = "has";
      });
      setSemRelacoes(semRelacoesAux);
    }
  }, [memorizedDataSemRelacao]);
  const attRows = useCallback(() => {
    const rowsAux: typeof rows = [];
    data?.forEach((value) => {
      rowsAux.push([
        value.matricula,
        value.nome,
        value.area,
        value.nome in semRelacoes ? "Não vinculado" : "Vinculado",
        <MdDeleteOutline
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSubTitleDelete(`Deseja deletar o usuário ${value.nome}?`);
            setFunctionDelete(() => () => {
              deleteFuncionario(value.id);
            });
            setOpenModalDelete(true);
          }}
        />,
      ]);
    });
    setRows(rowsAux);
  }, [memorizedData, semRelacoes, toastCall]);

  useEffect(attRows, [attRows, memorizedData]);
  return (
    <>
      <DeleteConfirm
        deleteFunc={functionDelete}
        onClose={() => {
          setOpenModalDelete(false);
        }}
        visibility={openModalDelete}
        subtitle={subTitleDelete}
      />

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
          <Title value="Listagem &nbsp;>" />
          <h2
            style={{
              fontWeight: 400,
              margin: "0.22rem 0 0 0",
            }}
          >
            &nbsp; Funcionários
          </h2>
        </div>
        <div style={{ padding: "0 3rem" }}>
          <Table
            resizable
            rows={rows}
            columns={[
              { name: "Matrícula", size: 1 },
              { name: "Nome do funcionário", size: 1 },
              { name: "Departamento", size: 1 },
              { name: "Vínculo", size: 1 },
              { name: "Options", size: 1 },
            ]}
          />
        </div>
      </Paper>
    </>
  );
}
