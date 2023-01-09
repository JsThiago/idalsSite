import { LegacyRef, useEffect, useRef, useState } from "react";
import Button from "../../components/button";
import OptionsMenu from "../../components/optionsMenu";
import Paper from "../../components/paper";
import Title from "../../components/title";
import useMap from "../../hooks/useMap";
const DATE = new Date();
export default function VisualizacaoIndividual() {
  function generateDate() {
    let date = new Date();
    let time: Array<string> = [];
    date.setHours(date.getHours() - 3);
    time.push(date.toISOString().split("T")[1].split(".")[0].slice(0, -3));
    if (time[0].slice(0, 2) === "00") time[0] = "23:59";
    else date.setHours(date.getHours() - 1);
    time.push(date.toISOString().split("T")[1].split(".")[0].slice(0, -3));
    time.push(date.toISOString().split("T")[0]);
    return time;
  }
  const mapRefTrajetoria = useRef<HTMLDivElement>(null);
  const mapRefUltimoPonto = useRef<HTMLDivElement>(null);
  const mapRefUltimaRota = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState("teixeira");
  const data = useRef(generateDate()[2]);
  const timeAte = useRef(generateDate()[0]);
  const timeDe = useRef(generateDate()[1]);

  const { map: mapTrajetoria, aplicarFiltros } = useMap(
    mapRefTrajetoria as React.RefObject<HTMLDivElement>
  );
  useEffect(() => {
    console.debug(
      {
        funcionario: user,
        data: `${data.current}`,
        timeDe: `${timeDe.current}`,
        timeAte: `${timeAte.current}`,
      },
      mapTrajetoria
    );
    aplicarFiltros({
      funcionario: user,
      data: `${data.current}`,
      timeDe: `${timeDe.current}`,
      timeAte: `${timeAte.current}`,
    });
  }, [mapTrajetoria]);
  const { map: mapUltimoPonto } = useMap(
    mapRefUltimoPonto as React.RefObject<HTMLDivElement>
  );
  const { map: mapUltimaRota } = useMap(
    mapRefUltimaRota as React.RefObject<HTMLDivElement>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          marginTop: "-2rem",
          marginBottom: "1rem",
        }}
      >
        <OptionsMenu
          options={[
            {
              type: "selection",
              value: user,
              name: "Funcionário:",
              onChange: (newUser: string) => {
                setUser(newUser);
              },
              ops: [
                { label: "teixeira", value: "teixeira" },
                { label: "marko", value: "marko" },
              ],
            },
            {
              type: "selection",
              value: 1,
              name: "Área:",
              onChange: (newUser: string) => {
                setUser(newUser);
              },
              ops: [
                { label: "Área Barragem 1", value: 1 },
                { label: "Marko", value: 2 },
                { label: "Matheus", value: 3 },
              ],
            },
            {
              type: "date",
              value: data.current,
              name: "Data:",
              onChange: (newData: string) => {
                data.current = newData;
              },
            },
            {
              type: "time",
              value: timeDe.current,
              name: "Horário (de):",
              onChange: (time: string) => {
                timeDe.current = time;
              },
            },
            {
              type: "time",
              value: timeAte.current,
              name: "Horário (até):",
              onChange: (time: string) => {
                timeAte.current = time;
              },
            },
          ]}
        />
      </div>
      <div
        style={{
          marginLeft: "auto",
          alignSelf: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <Button
          label="Aplicar filtros"
          onClick={() => {
            aplicarFiltros({
              funcionario: user,
              data: `${data.current}`,
              timeDe: `${timeDe.current}`,
              timeAte: `${timeAte.current}`,
            });
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40rem auto",
          gridColumnGap: "2rem",
          gridRowGap: "2rem",
        }}
      >
        <Paper
          style={{
            height: "40rem",
            padding: "2rem",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Title
            style={{
              padding: 0,
              margin: "0 0 2rem 0",
              justifyContent: "center",
            }}
            value="Último ponto registrado"
          />
          <div
            style={{ flex: 1, position: "relative" }}
            ref={mapRefUltimoPonto as LegacyRef<HTMLDivElement>}
          />
        </Paper>
        <Paper
          style={{
            height: "40rem",
            padding: "2rem",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Title
            value="Trajetória realizada"
            style={{
              padding: 0,
              margin: "0 0 2rem 0",
              justifyContent: "center",
            }}
          />
          <div
            style={{ flex: 1, position: "relative" }}
            ref={mapRefTrajetoria as LegacyRef<HTMLDivElement>}
          />
        </Paper>
      </div>
    </div>
  );
}
