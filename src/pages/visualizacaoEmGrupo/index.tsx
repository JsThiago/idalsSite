import { LegacyRef, useRef } from "react";
import Checkbox from "../../components/checkbox";
import OptionsMenu from "../../components/optionsMenu";
import Paper from "../../components/paper";
import RadioGroup from "../../components/radioGroup";
import SquareColor from "../../components/squareColor";
import Table from "../../components/table";
import Title from "../../components/title";
import useMap from "../../hooks/useMap";

export default function VisualizacaoEmGrupo() {
  const mapRefTrajetoria = useRef<HTMLDivElement>(null);
  const mapRefUltimoPonto = useRef<HTMLDivElement>(null);
  const mapRefUltimaRota = useRef<HTMLDivElement>(null);

  const { map: mapTrajetoria } = useMap(
    mapRefTrajetoria as React.RefObject<HTMLDivElement>
  );
  const { map: mapUltimoPonto } = useMap(
    mapRefUltimoPonto as React.RefObject<HTMLDivElement>
  );
  const { map: mapUltimaRota } = useMap(
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
              ops: [{ label: "Todos os presentes", value: 1 }],
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
          <RadioGroup
            style={{
              display: "flex",
              columnGap: "2rem",
              fontSize: "1.5rem",
              padding: "2rem 0",
              alignItems: "center",
            }}
            name="mapaVisualizacaoEmGrupo"
            options={["Trajetória", "Último ponto registrado"]}
          />
          <div
            style={{ flex: 1, position: "relative" }}
            ref={mapRefTrajetoria as LegacyRef<HTMLDivElement>}
          />
        </Paper>
        <Paper style={{ height: "fit-content" }}>
          <Table
            rows={[
              [
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SquareColor
                    color="#F70305"
                    style={{
                      borderRadius: "4px",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </div>,
                "Matheus",
                "(xx) x xxxx-xxxx",
              ],
              [
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SquareColor
                    color="#00B051"
                    style={{
                      borderRadius: "4px",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </div>,
                "Felipe",
                "(xx) x xxxx-xxxx",
              ],
              [
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SquareColor
                    color="#FEFD0D"
                    style={{
                      borderRadius: "4px",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </div>,
                "Marko",
                "(xx) x xxxx-xxxx",
              ],
              [
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SquareColor
                    color="#589CD3"
                    style={{
                      borderRadius: "4px",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </div>,
                "Eduarda",
                "(xx) x xxxx-xxxx",
              ],
              [
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SquareColor
                    color="#EC7E31"
                    style={{
                      borderRadius: "4px",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </div>,
                "Fernanda",
                "(xx) x xxxx-xxxx",
              ],
              [
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SquareColor
                    color="#42556D"
                    style={{
                      borderRadius: "4px",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </div>,
                "Vinícius",
                "(xx) x xxxx-xxxx",
              ],
            ]}
            columns={[
              {
                name: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SquareColor
                      style={{
                        borderRadius: "4px",
                        width: "1.5rem",
                        height: "1.5rem",
                      }}
                    />
                  </div>
                ),
                size: 0.2,
              },
              { name: "Funcionário", size: 1 },
              { name: "Telefone", size: 1 },
            ]}
          />
        </Paper>
      </div>
    </div>
  );
}
