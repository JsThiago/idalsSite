import React, { useCallback, useContext, useEffect, useState } from "react";
import Button from "../../components/button";
import Modal from "../../components/modal";
import Paper from "../../components/paper";
import CustomSelect from "../../components/select";
import { RxCross2 } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import Table from "../../components/table";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";
import { DadosFuncionarios } from "../../types";
import { relative } from "path";
import DeleteConfirm from "../../components/deleteConfirm";
import breakLine from "../../utils/breakLine";
interface DadosRelacoes {
  crachaId: string;
  funcionarioId: number;
  createdAt: string;
}
interface DadosCracha {
  devEUI: string;
  nome: string;
}
export default function ListagemDeFuncionarios() {
  const [openModal, setOpenModal] = useState(false);
  const [functionDelete,setFunctionDelete] = useState<()=>void>(()=>()=>{}) 
  const [openModalDelete,setOpenModalDelete] = useState(false);
  const [subTitleDelete,setSubTitleDelete] = useState<string|Array<React.ReactElement>>("")
  const [funcionarioVincular, setFuncionarioVincular] = useState<
    string | number
  >();
  const [crachaVincular, setCrachaVincular] = useState<string | number>();
  const [funcionariosOptions, setFuncionariosOptions] = useState<
    Array<{ label: string | number; value: string | number }>
  >([]);
  const [crachasOptions, setCrachasOptions] = useState<
    Array<{ label: string | number; value: string | number }>
  >([]);
  const [funcionarios, setFuncionarios] = useState<
    Record<number, DadosFuncionarios>
  >([]);
  const [semRelacoes, setSemRelacoes] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<
    Array<[string, string, string, string, JSX.Element]>
  >([]);
  const toastCall = useContext(toastContext).toastCall as Function;
  useEffect(() => {
    fetch("https://api.idals.com.br/funcionario").then((response) => {
      response.json().then((funcionariosValues: Array<DadosFuncionarios>) => {
        const funcionariosAux: typeof funcionarios = {};
        const funcionariosOptionsAux: typeof funcionariosOptions = [];
        funcionariosValues.forEach((funcionario) => {
          funcionariosAux[funcionario.id] = funcionario;
          funcionariosOptionsAux.push({
            value: funcionario.id,
            label: funcionario.nome,
          });
        });
        setFuncionariosOptions(funcionariosOptionsAux);
        setFuncionarioVincular(funcionariosOptionsAux[0].value);
        setFuncionarios(funcionariosAux);
      });
    });
    fetch("https://api.idals.com.br/semRelacoes").then((response) => {
      response.json().then((dados) => {
        const semRelacoesAux: typeof semRelacoes = {};
        dados.funcionarios.forEach((funcionario: any) => {
          semRelacoesAux[funcionario.nome] = "has";
        });
        setSemRelacoes(semRelacoesAux);
      });
    });
  }, []);
  const attRows = useCallback(() => {
    const rowsAux: typeof rows = [];
    Object.entries(funcionarios).forEach(([key, value], index) => {
      rowsAux.push([
        value.matricula,
        value.nome,
        value.area,
        value.nome in semRelacoes ? "Não vinculado" : "Vinculado",
        <MdDeleteOutline
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setOpenModalDelete(true);
            setSubTitleDelete(
              breakLine(
                `Tem certeza que deseja remover o funcionário:<br/>
            ${value.nome}?`))
            setFunctionDelete(()=>()=>{
            fetch("https://api.idals.com.br/funcionario/" + key, {
              method: "DELETE",
            }).then((response) => {
              if (response.status === 200) {
                toastCall("Funcionário removido com sucesso");
                const funcionariosCopy = { ...funcionarios };
                delete funcionariosCopy[+key];
                setFuncionarios(funcionariosCopy);
              } else toastCall("Erro, Por favor tente mais tarde");
            })
          });
          }}
        />,
      ]);
    });
    setRows(rowsAux);
  }, [funcionarios, semRelacoes, toastCall]);

  useEffect(attRows, [attRows, funcionarios]);
  return (
    <>
      <DeleteConfirm deleteFunc={functionDelete} onClose={()=>{
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
