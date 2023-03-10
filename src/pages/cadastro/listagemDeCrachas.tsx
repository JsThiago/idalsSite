import { useCallback, useContext, useEffect, useState } from "react";
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
import breakLine from "../../utils/breakLine";
import DeleteConfirm from "../../components/deleteConfirm";

interface DadosCracha {
  devEUI: string;
  nome: string;
  description: string;
  deviceProfileID: string;
  isDisabled: boolean;
  modelo: string;
}
export default function ListagemDeCrachas() {
  const [openModal, setOpenModal] = useState(false);
  const [functionDelete,setFunctionDelete] = useState<()=>void>(()=>()=>{}) 
  const [openModalDelete,setOpenModalDelete] = useState(false); 
  const [subTitleDelete,setSubTitleDelete] = useState<string|Array<React.ReactElement>>("")
  const [crachas, setCrachas] = useState<Array<DadosCracha>>([]);
  const [rows, setRows] = useState<
    Array<[JSX.Element, string, string, string, string, JSX.Element]>
  >([]);
  const toastCall = useContext(toastContext).toastCall as Function;
  useEffect(() => {
    fetch("https://api.idals.com.br/cracha").then((response) => {
      response.json().then((crachaValues: Array<DadosCracha>) => {
        setCrachas(crachaValues);
      });
    });
  }, []);
  const attRows = useCallback(() => {
    const rowsAux: typeof rows = [];
    crachas.forEach((cracha, index) => {
      rowsAux.push([
        <span style={{ color: cracha.isDisabled ? "darkred" : "darkgreen" }}>
          {cracha.devEUI}
        </span>,
        cracha.nome,
        cracha.description,
        cracha.modelo,
        cracha.deviceProfileID,
        <MdDeleteOutline
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setOpenModalDelete(true);
            setSubTitleDelete(
              breakLine(
                `Tem certeza que deseja remover o crachá:<br/>
            ${cracha.nome}?`))
            setFunctionDelete(()=>()=>{
            fetch("https://api.idals.com.br/cracha/" + cracha.devEUI, {
              method: "DELETE",
            }).then((response) => {
              if (response.status === 200) {
                const crachasAux = [...crachas];
                crachasAux.splice(index,1);
                setCrachas(crachasAux);
                toastCall("Crachá removido com sucesso");
              } else toastCall("Erro, Por favor tente mais tarde");
            })});
          }}
        />,
      ]);
    });
    setRows(rowsAux);
  }, [toastCall, crachas]);

  useEffect(attRows, [attRows]);
  return (
    <>
    <DeleteConfirm deleteFunc={functionDelete} subtitle={subTitleDelete} onClose={()=>{
        setOpenModalDelete(false);

      }} visibility={openModalDelete}/>
      <Modal visibility={openModal}>
        <Paper
          style={{
            display: "flex",
            width: "50rem",
            height: "30rem",
            position: "relative",
            flexDirection: "column",
            borderRadius: "2px",
            paddingBottom: "2rem",
            boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
          }}
        ></Paper>
      </Modal>

      <Paper
        style={{
          display: "flex",
          padding: "1rem 0rem 3rem 0rem",
          flexDirection: "column",
          boxShadow: "0.5px 0.5px 1px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "3rem" }}>
          <Title value="Funcionários > cadastrados" />
        </div>
        <div style={{ padding: "0 3rem" }}>
          <Table
            resizable
            rows={rows}
            columns={[
              { name: "DevEUI", size: 1 },
              { name: "Nome", size: 1 },
              { name: "Descrição", size: 1 },
              { name: "Modelo", size: 1 },
              { name: "deviceProfileID", size: 1 },
              { name: "Options", size: 1 },
            ]}
          />
        </div>
      </Paper>
    </>
  );
}
