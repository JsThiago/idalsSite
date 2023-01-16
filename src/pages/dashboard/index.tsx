import { useEffect, useState } from "react";
import Card from "../../components/card";
import ElipsePerson from "../../components/card/icons/people";
import Circle from "../../components/circle";
import Paper from "../../components/paper";
import SubTitle from "../../components/subTitle";
import Title from "../../components/title";
interface DadosLocalizacao {
  nome: string;
  tipo: string;
}
export default function Dashboard() {
  const [cards, setCards] = useState<Array<() => JSX.Element>>([]);
  useEffect(() => {
    let quantidadePorArea: Record<string, number> = {};
    fetch("http://idals.com.br:3500/localizacao").then((resp) => {
      resp.json().then((data: Array<DadosLocalizacao>) => {
        data.forEach((localizacao) => {
          if (localizacao.tipo === "area") {
            //quantidadePorArea[localizacao] = 1;
          } else return;
        });
        const arrayFuncionariosPorAreaOrdenado = Object.entries(
          quantidadePorArea
        ).sort((a, b) => +(a[1] < b[1]));
      });
    });
  }, []);
  return (
    <div
      style={{
        flex: 1,
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
              styleLegenda={{ marginBottom: "2.3rem" }}
              color="#F5E8A4"
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0 3rem",
            }}
          >
            <Card></Card>
            <Card title="Mina2" titleColor="#F26D6D" color="#F5A4A4"></Card>
            <Card
              title="Barragem Germano"
              color="#C3A4F5"
              titleColor="#9155F4"
            ></Card>
            <Card
              title="Barragem Santarem"
              color="#B6DAAD"
              titleColor="#27BC02"
            ></Card>
            <Card title="Outros" color="#F5A4DF" titleColor="#F93FC5"></Card>
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
              <span>200 pessoas com funcionário perfeito</span>
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
              <span>42 pessoas com bateria abaixo de 12%</span>
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
              <span>3 pessoas com problemas de detecção</span>
            </div>
          </div>
        </Paper>
        <Paper
          style={{
            display: "flex",
            flex: 1,
            borderRadius: "30px",
            boxShadow: "0.5px 0.5px  6px 0.5px rgba(0,0,0,0.25)",
          }}
        >
          <Title value="Acompanhamento" />
        </Paper>
      </div>
    </div>
  );
}
