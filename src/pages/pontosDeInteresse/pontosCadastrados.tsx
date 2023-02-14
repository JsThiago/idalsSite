import { useContext, useEffect, useState } from "react";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import EditButton from "../../components/editButton";
import Paper from "../../components/paper";
import MapVisualization from "../../components/mapVisualization";
import { MdDeleteOutline } from "react-icons/md";
import Table from "../../components/table";
import Title from "../../components/title";
import { useToast } from "../../components/toast";
import DeleteConfirm from "../../components/deleteConfirm";
import breakLine from "../../utils/breakLine";
import Modal from "../../components/modal";
import CadastrarPontosDeInteresse from "./cadastrarPontosDeInteresse";
import CriacaoLocaisDeInteresse from "../../components/criacaoLocaisDeInteresse";
interface DadosLocalizacao {
  nome: string;
  descricao: string;
  tipo: string;
  id: number;
  localizacao:[Array<[number,number]>]
}
export default function PontosCadastrados() {
  const toast = useToast();
  const [functionDelete,setFunctionDelete] = useState<()=>void>(()=>()=>{}) 
  const [openVisualization,setOpenVisualization] = useState<boolean>(false)
  const [openModalDelete,setOpenModalDelete] = useState(false); 
  const [subTitleDelete,setSubTitleDelete] = useState<string|Array<React.ReactElement>>("")
  const [pontosLocationSelected,setPontosLocationSelected] = useState<{name:string,localization:Array<[number,number]> | [number,number],type:string}>({localization:[]
  ,type:"",name:""});
  const [pontos, setPontos] = useState<
    Array<{ nome: string; descricao: string; tipo: string; id: number,localizacao:Array<[number,number]> }>
  >([]);
  const [rows, setRows] = useState<Array<[any, string, string, any]>>([]);
  const toastCall = toast.toastCall;
  useEffect(() => {
    fetch("https://api.idals.com.br/localizacao").then((response) => {
      response.json().then((localizacoes: Array<DadosLocalizacao>) => {
        const pontosAux: typeof pontos = [];
        localizacoes.forEach((localizacao) => {
          console.log(localizacao.localizacao[0],localizacao.tipo)
          if(localizacao.tipo === "area")
            pontosAux.push({
              descricao: localizacao.descricao,
              nome: localizacao.nome,
              tipo: localizacao.tipo,
              id: localizacao.id,
              localizacao:localizacao.localizacao[0]          
            });
            else
            pontosAux.push({
              descricao: localizacao.descricao,
              nome: localizacao.nome,
              tipo: localizacao.tipo,
              id: localizacao.id,
              localizacao:localizacao.localizacao as unknown as [number, number][]         
            });
        });
        setPontos(pontosAux);
      });
    });
  }, []);
  useEffect(() => {
    const rowsAux: typeof rows = [];
    pontos.forEach((ponto, index) => {
      rowsAux.push([
        <span style={{cursor:"pointer"}} onClick={()=>{
          setPontosLocationSelected({localization:ponto.localizacao,type:ponto.tipo,name:ponto.nome});
          setOpenVisualization(true)
          
        }}>{ponto.nome}</span>,
        ponto.descricao,
        ponto.tipo,
        <MdDeleteOutline
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setOpenModalDelete(true);
            setSubTitleDelete(
              breakLine(
                `Tem certeza que deseja remover o ponto:<br/>
            ${ponto.nome}?`))
            setFunctionDelete(()=>()=>fetch("https://api.idals.com.br/localizacao/" + ponto.id, {
              method: "DELETE",
            }).then((response) => {
              if (response.status === 200) {
                toastCall("Ponto removido com sucesso");
                const pontosCopy = [...pontos];
                pontosCopy.splice(index, 1);
                setPontos(pontosCopy);
              } else toastCall("Erro, Por favor tente mais tarde");
            }));
          }}
        />,
      ]);
    });
    setRows(rowsAux);
  }, [pontos]);
  return (
    <Paper
      style={{
        display: "flex",
        padding: "1em 0rem 3rem 0rem",
        flexDirection: "column",
        boxShadow: "0.5px 0.5px 1px rgba(0,0,0,0.05)",
      }}
    >
      {openVisualization && <Modal onClickOutside={()=>{
        setOpenVisualization(false)
      }} visibility={openVisualization}>
        <MapVisualization title={pontosLocationSelected.name} type={pontosLocationSelected.type} 
        markerLocations={pontosLocationSelected.localization} 
        initialView={(typeof pontosLocationSelected.localization[0] === "number" ? pontosLocationSelected.localization as [number,number] : pontosLocationSelected.localization[0]) || [0,0]}/>
      </Modal>}
       <DeleteConfirm deleteFunc={functionDelete} subtitle={subTitleDelete} onClose={()=>{
        setOpenModalDelete(false);

      }} visibility={openModalDelete}/>
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
          &nbsp; Pontos cadastrados
        </h2>
      </div>
      <div style={{ padding: "0 3rem" }}>
        <Table
          rows={rows}
          columns={[
            { name: "Nome do ponto", size: 1 },
            { name: "Detalhes", size: 1 },
            { name: "Tipo", size: 1 },
            { name: "Opções", size: 1 },
          ]}
        />
      </div>
    </Paper>
  );
}
