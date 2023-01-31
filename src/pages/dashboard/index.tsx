import { useEffect, useState } from "react";
import Button from "../../components/button";
import Card from "../../components/card";
import ElipsePerson from "../../components/card/icons/people";
import Circle from "../../components/circle";
import Paper from "../../components/paper";
import SubTitle from "../../components/subTitle";
import Table from "../../components/table";
import Title from "../../components/title";
import calcularPercentBateria from "../../utils/calcularPercentBateria";
import randomColorGeneratorRGBA from "../../utils/randomColorGeneratorRGBA";
interface DadosLocalizacao {
  nome: string;
  tipo: string;
  id: number;
  quant: number;
}
export default function Dashboard() {
  const [areas, setAreas] = useState<Record<string | number, any>>({});
  const [totalPessoas, setTotalDePessoas] = useState<number>(0);
  const [baterias, setBaterias] = useState<
    Record<string, { vermelho: 0; amarelo: 0; verde: 0 }>
  >({});
  const [dataCards, setDataCards] = useState<
    Array<{ nome: string; quant: number; color: string }>
  >([]);
  const [areaSelected, setAreaSelected] = useState<string>("Todas");
  const [rows, setRows] = useState<Record<string, Array<Array<any>>>>({
    Todas: [],
  });
  useEffect(() => {
    fetch("https://api.idals.com.br/localizacao?tipo=area").then((resp) => {
      resp.json().then((data: Array<DadosLocalizacao>) => {
        const areasAux: typeof areas = {};
        data.forEach((localizacao) => {
          areasAux[localizacao.id] = { ...localizacao };
        });
        setAreas(areasAux);
      });
    });
  }, []);
  useEffect(() => {
    const dataCardsAux: typeof dataCards = [];
    let totalDePessoasAux = 0;
    const colorsUsed: Record<string, any> = {};
    const newRows: typeof rows = { Todas: [] };
    const newBaterias: typeof baterias = {
      Todas: {
        amarelo: 0,
        verde: 0,
        vermelho: 0,
      },
    };
    const promises = Promise.all(
      Object.entries(areas).map(async ([keys, value], index) => {
        newRows[value.nome] = [];
        newBaterias[value.nome as string] = {
          amarelo: 0,
          verde: 0,
          vermelho: 0,
        };

        const response = await fetch(
          "https://bigdata.idals.com.br/data/status?area=" + keys
        );
        const json = await response.json();

        json.forEach((info: any, index: number) => {
          console.info(
            areas,
            value.nome,
            index,
            "bateria: ",
            calcularPercentBateria(info.bateria)
          );
          let color: string | undefined = "";
          if (calcularPercentBateria(info.bateria) > 12) {
            newBaterias[value.nome as string].verde += 1;
            newBaterias["Todas" as string].verde += 1;
            color = undefined;
          } else if (calcularPercentBateria(info.bateria) < 5) {
            newBaterias[value.nome as string].vermelho += 1;
            newBaterias["Todas"].vermelho += 1;
            color = "#BC0202";
          } else {
            newBaterias[value.nome as string].amarelo += 1;
            newBaterias["Todas"].amarelo += 1;
            color = "#ECD03B";
          }
          newRows[value.nome].push([
            <Circle color={color} style={{ width: "2rem", height: "2rem" }} />,
            info.nome_funcionario,
            info.funcionario.matricula,
          ]);
          newRows["Todas"].push([
            <Circle color={color} style={{ width: "2rem", height: "2rem" }} />,
            info.nome_funcionario,
            info.funcionario.matricula,
          ]);
        });
        totalDePessoasAux += json?.length;
        const newColor = randomColorGeneratorRGBA(colorsUsed);
        const newColorRGB = `${newColor.r}, ${newColor.g}, ${newColor.b}`;
        dataCardsAux.push({
          nome: value?.nome,
          quant: json?.length,
          color: newColorRGB,
        });

        colorsUsed[newColorRGB] = 1;
      })
    );
    console.info(newBaterias);
    setBaterias(newBaterias);
    setRows(newRows);
    promises.then(() => {
      setDataCards(dataCardsAux);
      setTotalDePessoas(totalDePessoasAux);
    });
  }, [areas]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "3rem",
      }}
    >
      <Paper
        style={{
          borderRadius: "30px",
          padding: "1rem",
          display: "flex",
          paddingBottom: "2rem",
          flexDirection: "column",
          justifyContent: "space-around",
          boxShadow: "0.5px 0.5px  6px 0.5px rgba(0,0,0,0.25)",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            <Title value="Pessoas na empresa" />
          </div>
          <SubTitle
            style={{
              color: "#A6A6A6",
              fontSize: "1.2rem",
              marginLeft: "3rem",
              marginBottom: "2rem",
              marginTop: 0,
            }}
            value="Atualização do estado dos crachás na mina"
          />
          <div
            style={{
              marginLeft: "3rem",
              marginRight: "2rem",
            }}
          >
            <Card
              id="card-total-pessoas"
              styleLegenda={{ marginBottom: "2.3rem" }}
              color="#F5E8A4"
              onClick={(e) => {
                setAreaSelected("Todas");
              }}
              number={totalPessoas}
              style={{
                minWidth: "13rem",
                backgroundColor: "#F5E8A4",
                position: "relative",
              }}
              Title={() => (
                <div
                  style={{
                    display: "flex",
                    alignSelf: "flex-start",
                    marginTop: "2rem",
                    marginLeft: "2rem",
                  }}
                >
                  <ElipsePerson />
                </div>
              )}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "2rem",
          }}
        >
          <div>
            <SubTitle
              value="Distribuição de pessoas por área da mina"
              style={{
                color: "#A6A6A6",
                marginTop: 0,
                fontSize: "1.2rem",
                marginLeft: "3rem",
                marginBottom: "2rem",
              }}
            />
          </div>
          <div>
            {dataCards.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,auto)",
                  rowGap: "4rem",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "0 3rem",
                  flex: 1,
                }}
              >
                {dataCards
                  .sort((a, b) => +(a.quant < b.quant))
                  .map((data, index) => (
                    <Card
                      onClick={(e) => {
                        console.info(rows);
                        setAreaSelected(e);
                      }}
                      id={`${data.nome}-card-${data.quant}-${data.color}`}
                      number={data.quant}
                      title={data.nome}
                      color={data.color}
                      titleColor={data.color}
                    ></Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Paper>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          columnGap: "3rem",
        }}
      >
        <Paper
          style={{
            display: "flex",
            flex: 0.6,
            borderRadius: "30px",
            boxShadow: "0.5px 0.5px  6px 0.5px rgba(0,0,0,0.25)",
            flexDirection: "column",
            paddingBottom: "2rem",
            paddingRight: "5rem",
          }}
        >
          <Title value="Status do crachá" />

          <SubTitle
            style={{
              color: "#A6A6A6",
              fontSize: "1.2rem",
              marginLeft: "4rem",
              marginBottom: "2rem",
              marginTop: 0,
            }}
            value="Atualização do estado dos crachás na mina"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "2rem",
                marginLeft: "5rem",
              }}
            >
              <Circle />
              <span>{`${
                baterias[areaSelected]?.verde || 0
              }  pessoas com crachá perfeito`}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "2rem",
                marginLeft: "5rem",
              }}
            >
              <Circle color="#ECD03B" />
              <span>
                {`${baterias[areaSelected]?.amarelo || 0} pessoas com bateria
                abaixo de 12%`}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "2rem",
                marginLeft: "5rem",
              }}
            >
              <Circle color="#BC0202" />
              <span>
                {`${baterias[areaSelected]?.vermelho || 0} pessoas com problemas
                de detecção`}
              </span>
            </div>
          </div>
        </Paper>
        <Paper
          style={{
            display: "flex",
            flex: 1,
            maxHeight: "35rem",
            borderRadius: "30px",
            boxShadow: "0.5px 0.5px  6px 0.5px rgba(0,0,0,0.25)",
            flexDirection: "column",
            paddingBottom: "1rem",
          }}
        >
          <Title value={`Acompanhamento da Área: ${areaSelected}`} />
          <div style={{ padding: "0 1rem 0 1rem", overflow: "scroll" }}>
            <Table
              columns={[
                {
                  name: "Status",
                  size: 0.5,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
                { size: 1, name: "Nome do funcionário" },
                { name: "Matrícula", size: 0.5 },
              ]}
              rows={rows[areaSelected] || []}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
}
