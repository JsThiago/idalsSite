import { useCallback, useContext, useEffect, useState } from "react";
import Button from "../../components/button";
import Modal from "../../components/modal";
import Paper from "../../components/paper";
import CustomSelect from "../../components/select";
import Switch from "../../components/switch";
import { RxCross2 } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import Table from "../../components/table";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";
import { DadosFuncionarios } from "../../types";
interface DadosRelacoes {
  crachaId: string;
  funcionarioId: number;
  createdAt: string;
}
interface DadosCracha {
  devEUI: string;
  nome: string;
}
export default function Vinculos() {
  const [openModal, setOpenModal] = useState(false);
  const [relacoes, setRelacoes] = useState<Array<DadosRelacoes>>([]);
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
  const [rows, setRows] = useState<Array<[string, string, JSX.Element]>>([]);
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
    fetch("https://api.idals.com.br/relacoes").then((response) => {
      response.json().then((relacoes: Array<DadosRelacoes>) => {
        setRelacoes(relacoes);
      });
    });
    fetch("https://api.idals.com.br/cracha").then((response) => {
      const crachasOptionsAux: typeof crachasOptions = [];
      response.json().then((crachas: Array<DadosCracha>) => {
        crachas.forEach((cracha) => {
          crachasOptionsAux.push({ value: cracha.devEUI, label: cracha.nome });
        });
        setCrachasOptions(crachasOptionsAux);
        setCrachaVincular(crachasOptionsAux[0].value);
      });
    });
  }, []);
  const attRows = useCallback(() => {
    const rowsAux: typeof rows = [];
    relacoes.forEach((relacao, index) => {
      if (funcionarios[relacao.funcionarioId])
        rowsAux.push([
          funcionarios[relacao.funcionarioId].nome,
          relacao.crachaId,
          <MdDeleteOutline
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              fetch("https://api.idals.com.br/relacoes/" + relacao.crachaId, {
                method: "DELETE",
              }).then((response) => {
                if (response.status === 200) {
                  toastCall("Vínculo desfeito com sucesso");
                  const relacoesCopy = [...relacoes];
                  relacoesCopy.splice(index, 1);
                  setRelacoes(relacoesCopy);
                } else toastCall("Erro, Por favor tente mais tarde");
              });
            }}
          />,
        ]);
    });
    setRows(rowsAux);
  }, [funcionarios, relacoes]);
  useEffect(attRows, [attRows, funcionarios, relacoes]);
  return (
    <>
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
        >
          <div style={{ padding: "2rem" }}>
            <RxCross2
              style={{ position: "absolute", right: "2rem", cursor: "pointer" }}
              onClick={() => {
                setOpenModal(false);
              }}
              size={30}
              color="rgb(65, 13, 91)"
            />
            <Title value="Adicionar vínculo" />
            <div style={{ margin: "3rem 5rem 0 5rem" }}>
              <CustomSelect
                onChange={(funcionario) => {
                  setFuncionarioVincular(funcionario);
                }}
                label="Nome funcionário"
                value={funcionarioVincular}
                options={funcionariosOptions}
                style={{
                  border: "1px solid #979797",
                  borderRadius: "16px",
                  marginBottom: "2rem",
                }}
              />
              <CustomSelect
                value={crachaVincular}
                onChange={(cracha) => {
                  setCrachaVincular(cracha);
                }}
                options={crachasOptions}
                label="Crachá"
                style={{ border: "1px solid #979797", borderRadius: "16px" }}
              />
            </div>
          </div>
          <div
            style={{
              padding: "2rem",

              justifyContent: "flex-end",
              display: "flex",
            }}
          >
            <Button
              onClick={() => {
                const data = JSON.stringify({
                  crachaId: crachaVincular,
                  funcionarioId: funcionarioVincular,
                });
                console.log("data", crachaVincular);
                fetch("https://api.idals.com.br/relacoes", {
                  method: "POST",
                  body: data,
                  headers: { "content-type": "application/json" },
                })
                  .then((response) => {
                    if (response.status === 409)
                      toastCall("Funcionário ou crachá já possue vínculo");
                    else if (response.status === 201) {
                      toastCall("Vínculo realizado com sucesso");
                      setRelacoes([
                        ...relacoes,
                        {
                          crachaId: crachaVincular as string,
                          funcionarioId: funcionarioVincular as number,
                          createdAt: new Date().toString(),
                        },
                      ]);
                      setOpenModal(false);
                    }
                  })
                  .catch((err) => {
                    toastCall("Erro, Por favor tente mais tarde");
                    setOpenModal(false);
                  });
              }}
              label="Salvar"
            />
          </div>
        </Paper>
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
          <Title value="Vínculos" />
        </div>
        <div style={{ padding: "0 3rem" }}>
          <Table
            rows={rows}
            columns={[
              { name: "Nome do funcionário", size: 1 },
              { name: "Id crachá", size: 1 },
              { name: "Options", size: 0.5 },
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
            onClick={() => {
              setOpenModal(true);
            }}
            style={{
              backgroundColor: "white",
              border: "1px solid #410D5B",
              color: "#410D5B",
              outline:"none",
              textAlign: "center",
              minWidth: "10rem",
              marginRight: "2rem",
            }}
            label="Adicionar vínculo"
          />
        </div>
      </Paper>
    </>
  );
}
