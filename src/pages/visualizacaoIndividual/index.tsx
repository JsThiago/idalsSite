import { Feature } from "ol";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { Overlay, View } from "ol";
import { FeatureClass } from "ol/Feature";
import { Geometry } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import TileSource from "ol/source/Tile";
import VectorSource from "ol/source/Vector";
import { LegacyRef, useEffect, useRef, useState } from "react";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import OptionsMenu from "../../components/optionsMenu";
import Paper from "../../components/paper";
import RadioGroup from "../../components/radioGroup";
import Title from "../../components/title";
import useMap, {
  addVectorLayer,
  addWMSLayer,
  drawWMS,
  drawPoint,
} from "../../hooks/useMap";
import { DadosFuncionarios } from "../../types";
const DATE = new Date();
export default function VisualizacaoIndividual() {
  const stylesFullscreen: React.CSSProperties = {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    overflow: "scroll",
    top: 0,
    left: 0,
    zIndex: 999999,
    backgroundColor: "white",
    display: "flex",
  };
  const [fullscreen, setFullscreen] = useState<boolean>(false);
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
  const [showLines, setShowLines] = useState<boolean>(false);
  const mapRefUltimaRota = useRef<HTMLDivElement>(null);
  const wmsTrajetoriaLayer = useRef<TileLayer<any> | null>(null);
  const wmsTrajetoriaLineLayer = useRef<TileLayer<any> | null>(null);
  const funcionariosInfo = useRef<Record<string, { telefone: string }>>({});
  const vectorUltimoPontoLayer = useRef<VectorLayer<any> | null>(null);
  const firstPoint = useRef<Feature<Geometry> | null>(null);
  const lastPointTrajetoria = useRef<Feature<Geometry> | null>(null);
  const lastPoint = useRef<Feature<Geometry> | null>(null);

  const vectorUltimoPontoTrajetoriaLayer = useRef<VectorLayer<any> | null>(
    null
  );
  const vectorPrimeiroPontoTrajetoriaLayer = useRef<VectorLayer<any> | null>(
    null
  );

  const [user, setUser] = useState("teixeira");
  const [funcionarioOptions, setFuncionarioOptions] =
    useState<Array<{ label: string; value: string }>>();
  const data = useRef(generateDate()[2]);
  const timeAte = useRef(generateDate()[0]);
  const timeDe = useRef(generateDate()[1]);

  const mapTrajetoria = useMap(
    mapRefTrajetoria as React.RefObject<HTMLDivElement>
  );
  useEffect(() => {
    fetch("http://idals.com.br:3500/funcionario").then((response) => {
      const funcionarioOptionsAux: Array<{ label: string; value: string }> = [];
      const funcionarioInfosAux: Record<string, any> = {};
      response.json().then((funcionarios: Array<DadosFuncionarios>) => {
        funcionarios.forEach((funcionario) => {
          funcionarioInfosAux[funcionario.nome] = {
            telefone: funcionario.telefone,
          };
          funcionarioOptionsAux.push({
            label: funcionario.nome,
            value: funcionario.nome,
          });
        });
        setFuncionarioOptions(funcionarioOptionsAux);
        funcionariosInfo.current = funcionarioInfosAux;
      });
    });
  }, []);
  useEffect(() => {
    if (mapTrajetoria) {
      wmsTrajetoriaLayer.current = addWMSLayer(mapTrajetoria);
      vectorUltimoPontoTrajetoriaLayer.current = addVectorLayer(
        mapTrajetoria,
        "green",
        7
      );
      vectorPrimeiroPontoTrajetoriaLayer.current = addVectorLayer(
        mapTrajetoria,
        "blue",
        7
      );

      wmsTrajetoriaLineLayer.current = addWMSLayer(mapTrajetoria);
      wmsTrajetoriaLineLayer.current.setVisible(showLines);
    }
    const popup = document.getElementById("popup2") as HTMLDivElement;
    const content = document.getElementById("popup-content");
    mapTrajetoria?.on("singleclick", (e) => {
      popup.hidden = true;
      const overlay = new Overlay({ element: popup });
      mapTrajetoria?.addOverlay(overlay);
      const view = mapTrajetoria.getView();
      const viewResolution = view.getResolution() as number;
      const url = wmsTrajetoriaLayer.current
        ?.getSource()
        ?.getFeatureInfoUrl(e.coordinate, viewResolution, "EPSG:4674", {
          INFO_FORMAT: "application/json",
          FEATURE_COUNT: 50,
        });

      overlay.setPosition(e.coordinate);
      fetch(url as string).then((a) => {
        a.json().then((a) => {
          if (
            content &&
            a?.features?.length === 1 &&
            a?.features[0]?.properties?.date
          ) {
            console.debug(
              funcionariosInfo.current,
              user,
              funcionariosInfo.current[user]
            );
            content.innerHTML = `<div><span>Nome: ${user}</span></br><span> </span></br><span>Telefone: ${
              funcionariosInfo.current[user].telefone
            }</span></br><span> </span></br><span>Horário: ${
              new Date(a.features[0].properties.date)
                .toTimeString()
                .split(" ")[0]
            }</span></div>`;
            popup.hidden = false;
          }
        });
      });
    });
  }, [mapTrajetoria]);
  const mapUltimoPonto = useMap(
    mapRefUltimoPonto as React.RefObject<HTMLDivElement>
  );
  useEffect(() => {
    if (mapUltimoPonto)
      vectorUltimoPontoLayer.current = addVectorLayer(mapUltimoPonto, "green");
  }, [mapUltimoPonto]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", position: "relative" }}
    >
      {fullscreen && (
        <AiOutlineFullscreenExit
          onClick={() => {
            setFullscreen(false);
          }}
          size={40}
          style={{
            position: "fixed",
            color: "red",
            zIndex: 9999999999,
            top: 10,
            right: 10,
            cursor: "pointer",
          }}
        />
      )}
      <div
        style={
          fullscreen
            ? {
                position: "fixed",
                top: 60,
                zIndex: 999999999,
                left: "50%",
                display: "flex",
                flexDirection: "column",
                transform: "translate(-50%,0%)",
                flex: 1,
                width: "80%",
              }
            : {
                marginTop: "-2rem",
                marginBottom: "1rem",
              }
        }
      >
        <OptionsMenu
          style={
            fullscreen
              ? {
                  rowGap: "5rem",
                  justifyContent: "space-between",
                  width: "100%",
                }
              : {}
          }
          options={[
            {
              type: "selection",
              value: user,
              name: "Funcionário:",
              onChange: (newUser: string) => {
                setUser(newUser);
              },
              ops: funcionarioOptions,
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

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div
            style={
              fullscreen
                ? {
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                  }
                : { display: "flex", alignItems: "center" }
            }
          >
            <Checkbox
              style={{ fontSize: "3rem", marginRight: "0.5rem" }}
              onClick={() => {
                if (wmsTrajetoriaLineLayer)
                  wmsTrajetoriaLineLayer.current?.setVisible(!showLines);
                setShowLines(!showLines);
              }}
            />
            <label
              style={{
                fontSize: "1.3rem",
                color: "rgb(48, 25, 52)",
              }}
              htmlFor="checkbox-visualizacao-individual"
            >
              Linhas
            </label>
          </div>
          <Button
            label="Aplicar filtros"
            onClick={() => {
              if (firstPoint.current !== null)
                (
                  vectorPrimeiroPontoTrajetoriaLayer.current as VectorLayer<
                    VectorSource<Geometry>
                  >
                )
                  ?.getSource()
                  ?.removeFeature(firstPoint.current);
              if (lastPoint.current !== null)
                (
                  vectorUltimoPontoLayer.current as VectorLayer<
                    VectorSource<Geometry>
                  >
                )
                  ?.getSource()
                  ?.removeFeature(lastPoint.current);
              if (lastPointTrajetoria.current !== null)
                (
                  vectorUltimoPontoTrajetoriaLayer.current as VectorLayer<
                    VectorSource<Geometry>
                  >
                )
                  ?.getSource()
                  ?.removeFeature(lastPointTrajetoria.current);
              console.debug({
                funcionario: user,
                data: `${data.current}`,
                timeDe: `${timeDe.current}`,
                timeAte: `${timeAte.current}`,
              });
              drawWMS(
                wmsTrajetoriaLayer.current as TileLayer<any>,
                {
                  funcionario: user,
                  data: `${data.current}`,
                  timeDe: `${timeDe.current}`,
                  timeAte: `${timeAte.current}`,
                },
                {
                  finalDate: `${new Date(
                    data.current + "T" + timeAte.current
                  ).toISOString()}`,
                },
                "http://localhost:8080/geoserver/mapa/wms",
                "mapa:all2"
              );
              fetch(
                `http://idals.com.br:3501/data?funcionario=${user}&de=${data.current}T${timeDe.current}&ate=${data.current}T${timeAte.current}`
              ).then((response) => {
                response.json().then((dado) => {
                  const coordinates = dado[dado.length - 1]?.localizacao;

                  if (!coordinates) return;

                  firstPoint.current = drawPoint(
                    dado[0].localizacao,
                    vectorPrimeiroPontoTrajetoriaLayer.current as VectorLayer<any>
                  );

                  lastPoint.current = drawPoint(
                    dado[dado.length - 1].localizacao,
                    vectorUltimoPontoLayer.current as VectorLayer<any>
                  );

                  lastPointTrajetoria.current = drawPoint(
                    dado[dado.length - 1].localizacao,
                    vectorUltimoPontoTrajetoriaLayer.current as VectorLayer<any>
                  );

                  mapUltimoPonto
                    ?.getView()
                    .animate({ center: coordinates, zoom: 19 });
                  mapTrajetoria
                    ?.getView()
                    .animate({ center: coordinates, zoom: 15 });

                  console.debug(mapUltimoPonto?.getLayers());
                });
              });
              console.debug(mapTrajetoria?.getLayers());
              if (mapTrajetoria) {
                drawWMS(
                  wmsTrajetoriaLineLayer.current as TileLayer<any>,
                  {
                    funcionario: user,
                    data: `${data.current}`,
                    timeDe: `${timeDe.current}`,
                    timeAte: `${timeAte.current}`,
                    gap: 1,
                  },
                  {},
                  "http://localhost:8080/geoserver/mapa/wms",
                  "mapa:linhas"
                );
                mapTrajetoria?.updateSize();
              }
            }}
          />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "15px",
          position: "absolute",
        }}
        hidden={true}
        id="popup2"
      >
        <div id="popup-content"></div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "50% 50%",
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
            position: "relative",
          }}
        >
          <AiOutlineFullscreen
            size={30}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
              color: "rgb(65, 13, 91)",
            }}
            onClick={() => {
              setFullscreen(true);
            }}
          />
          <Title
            value="Trajetória realizada"
            style={{
              padding: 0,
              margin: "0 0 2rem 0",
              justifyContent: "center",
            }}
          />
          <div
            style={
              fullscreen ? stylesFullscreen : { flex: 1, position: "relative" }
            }
            ref={mapRefTrajetoria as LegacyRef<HTMLDivElement>}
          />
        </Paper>
      </div>
    </div>
  );
}
