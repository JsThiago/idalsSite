import { LegacyRef, useRef } from "react";
import OptionsMenu from "../../components/optionsMenu";
import Paper from "../../components/paper";
import Title from "../../components/title";
import useMap from "../../hooks/useMap";

export default function VisualizacaoIndividual() {
  const mapRefTrajetoria = useRef<HTMLDivElement>(null);
  const mapRefUltimoPonto = useRef<HTMLDivElement>(null);
  const mapRefUltimaRota = useRef<HTMLDivElement>(null);

  const mapTrajetoria = useMap(
    mapRefTrajetoria as React.RefObject<HTMLDivElement>
  );
  const mapUltimoPonto = useMap(
    mapRefUltimoPonto as React.RefObject<HTMLDivElement>
  );
  const mapUltimaRota = useMap(
    mapRefUltimaRota as React.RefObject<HTMLDivElement>
  );
  mapTrajetoria
    ?.getView()
    .animate({ zoom: 13, center: [-43.4724, -20.216287] });
  mapUltimoPonto
    ?.getView()
    .animate({ zoom: 14, center: [-43.4724, -20.216287] });
  mapUltimaRota
    ?.getView()
    .animate({ zoom: 13, center: [-43.4624, -20.216287] });
  return (
    <div>
      <div style={{ marginTop: "-2rem", marginBottom: "2rem" }}>
        <OptionsMenu
          options={[
            {
              type: "selection",
              value: 1,
              name: "Funcionário:",
              ops: [
                { label: "Felipe Teixeira", value: 1 },
                { label: "Marko", value: 2 },
                { label: "Matheus", value: 3 },
              ],
            },
            {
              type: "selection",
              value: 1,
              name: "Área:",
              ops: [
                { label: "Área Barragem 1", value: 1 },
                { label: "Marko", value: 2 },
                { label: "Matheus", value: 3 },
              ],
            },
            { type: "date", value: "2020-11-11", name: "Data:" },
            { type: "time", value: "7:00", name: "Horário (de):" },
            { type: "time", value: "7:00", name: "Horário (até):" },
          ]}
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
            style={{
              padding: 0,
              margin: "0 0 2rem 0",
              justifyContent: "center",
            }}
            value="Rota realizada"
          />
          <div
            style={{ flex: 1, position: "relative" }}
            ref={mapRefUltimaRota as LegacyRef<HTMLDivElement>}
          />
        </Paper>
        <Paper
          style={{
            height: "30rem",
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
            value="Bateria"
          />
          <img
            alt="battery"
            style={{ flex: 1, position: "relative" }}
            src="./battery.png"
          />
        </Paper>
      </div>
    </div>
  );
}
