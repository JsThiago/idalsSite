import { useContext, useEffect, useState } from "react";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import EditButton from "../../components/editButton";
import Paper from "../../components/paper";
import { MdDeleteOutline } from "react-icons/md";
import Table from "../../components/table";
import Title from "../../components/title";
import { useToast } from "../../components/toast";
interface DadosLocalizacao {
  nome: string;
  descricao: string;
  tipo: string;
  id: number;
}
export default function PontosCadastrados() {
  const toast = useToast();
  const [pontos, setPontos] = useState<
    Array<{ nome: string; descricao: string; tipo: string; id: number }>
  >([]);
  const [rows, setRows] = useState<Array<[string, string, string, any]>>([]);
  const toastCall = toast.toastCall;
  useEffect(() => {
    fetch("https://api.idals.com.br/localizacao").then((response) => {
      response.json().then((localizacoes: Array<DadosLocalizacao>) => {
        const pontosAux: typeof pontos = [];
        localizacoes.forEach((localizacao) => {
          pontosAux.push({
            descricao: localizacao.descricao,
            nome: localizacao.nome,
            tipo: localizacao.tipo,
            id: localizacao.id,
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
        ponto.nome,
        ponto.descricao,
        ponto.tipo,
        <MdDeleteOutline
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => {
            fetch("https://api.idals.com.br/localizacao/" + ponto.id, {
              method: "DELETE",
            }).then((response) => {
              if (response.status === 200) {
                toastCall("Vínculo desfeito com sucesso");
                const pontosCopy = [...pontos];
                pontosCopy.splice(index, 1);
                setPontos(pontosCopy);
              } else toastCall("Erro, Por favor tente mais tarde");
            });
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
