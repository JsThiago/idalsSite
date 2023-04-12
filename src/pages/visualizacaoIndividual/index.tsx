import { Feature } from "ol";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { Overlay, View } from "ol";
import { Geometry } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import OptionsMenu from "../../components/optionsMenu";
import Paper from "../../components/paper";
import Title from "../../components/title";
import ErroDados from "../../components/erroDados";
import { CiFilter } from "react-icons/ci";
import Spin from "../../components/spin";
import Slider from "../../components/slider";
import MapMenuButton from "../../components/mapMenuButton";
import useMap, {
  addVectorLayer,
  addWMSLayer,
  drawWMS,
  drawPoint,
  updateWMS,
} from "../../hooks/useMap";
import { DadosFuncionarios, DataLocalizacao } from "../../types";
import { useToast } from "../../components/toast";
import TileSource from "ol/source/Tile";
import TileWMS from "ol/source/TileWMS";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSimplify, setIsSimplify] = useState<boolean>(false);
  const [quantPontos, setQuantPontos] = useState({ max: 0, quant: 0 });
  const [fullscreenLastPoint, setFullscreenLastPoint] =
    useState<boolean>(false);
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
  const [lineGap, setLineGap] = useState<number>(1);
  const [minDist, setMinDist] = useState<number>(1);
  const [showLines, setShowLines] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const mapRefUltimaRota = useRef<HTMLDivElement>(null);
  const wmsTrajetoriaLayer = useRef<TileLayer<any> | null>(null);
  const wmsTrajetoriaLineLayer = useRef<TileLayer<any> | null>(null);
  const funcionariosInfo = useRef<Record<string, { telefone: string }>>({});
  const vectorUltimoPontoLayer = useRef<VectorLayer<any> | null>(null);
  const firstPoint = useRef<Feature<Geometry> | null>(null);
  const lastPointTrajetoria = useRef<Feature<Geometry> | null>(null);
  const lastPoint = useRef<Feature<Geometry> | null>(null);
  const overlayTrajetoria = useRef<Overlay | null>(null);
  const vectorUltimoPontoTrajetoriaLayer = useRef<VectorLayer<any> | null>(
    null
  );
  const vectorPrimeiroPontoTrajetoriaLayer = useRef<VectorLayer<any> | null>(
    null
  );

  const [user, setUser] = useState("");
  const userRef = useRef("");
  const [localizacao, setLocalizacao] = useState<number>();
  const [funcionarioOptions, setFuncionarioOptions] =
    useState<Array<{ label: string; value: string }>>();
  const [localizacaoOptions, setLocalizacaoOptions] = useState<
    Array<{ label: string; value: string | number }>
  >([]);
  const data = useRef(generateDate()[2]);
  const timeAte = useRef(generateDate()[0]);
  const timeDe = useRef(generateDate()[1]);
  const toastContext = useToast();
  useEffect(() => {
    setLineGap(1);
  }, [showLines]);
  const mapTrajetoria = useMap(
    mapRefTrajetoria as React.RefObject<HTMLDivElement>,
    document.getElementById("popup2")
  );
  useEffect(() => {
    console.log("isLoading", isLoading);
    if (isLoading === true) {
      toastContext.toastCall("Por favor, aguarde", Infinity);
      return;
    }
    setIsLoading(false);
  }, [isLoading]);
  useEffect(() => {
    fetch("https://api.idals.com.br/localizacao").then((response) => {
      const localizacaoOptionsAux: typeof localizacaoOptions = [];
      response.json().then((localizacoes: Array<DataLocalizacao>) => {
        localizacoes.forEach((localizacao) => {
          localizacaoOptionsAux.push({
            label: localizacao.nome,
            value: localizacao.id,
          });
        });
        setLocalizacaoOptions(localizacaoOptionsAux);
        if (localizacaoOptionsAux.length > 0) {
          setLocalizacao(localizacaoOptionsAux[0].value as number);
        }
      });
    });
    fetch("https://api.idals.com.br/funcionario").then((response) => {
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
        setUser(funcionarioOptionsAux[0]?.value);
        userRef.current = funcionarioOptionsAux[0]?.value;
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
    if (mapTrajetoria?.getOverlays().item(0).getElement() === undefined) {
      mapTrajetoria
        ?.getOverlays()
        .item(0)
        .setElement(document.getElementById("popup2") as HTMLElement);
    }
    const overlay = mapTrajetoria?.getOverlays().item(0);

    mapUltimoPonto?.on("singleclick", (e) => {
      const overlay = mapUltimoPonto.getOverlays().item(0);
      const overlayElement = overlay.getElement();
      const pixel = e.pixel;
      const feature = mapUltimoPonto.getFeaturesAtPixel(pixel);
      if (overlayElement && feature.length === 0) {
        overlayElement.hidden = true;
        return;
      }
      if (overlayElement) overlayElement.hidden = false;
      console.log(feature);
    });
    const popup = overlay?.getElement() as HTMLElement;
    const content = document.getElementById("popup-content2");
    mapTrajetoria?.on("singleclick", (e) => {
      popup.hidden = true;
      const view = mapTrajetoria.getView();
      const viewResolution = view.getResolution() as number;
      const url = wmsTrajetoriaLayer.current
        ?.getSource()
        ?.getFeatureInfoUrl(e.coordinate, viewResolution, "EPSG:4674", {
          INFO_FORMAT: "application/json",
          FEATURE_COUNT: 50,
        });

      overlay?.setPosition(e.coordinate);
      fetch(url as string).then((a) => {
        a.json().then((a) => {
          if (a?.features?.length === 0) {
            return;
          }
          if (
            content &&
            a?.features?.length === 1 &&
            a?.features[0]?.properties?.date
          ) {
            content.innerHTML = `<div><span>Nome: ${
              userRef.current
            }</span></br><span> </span></br><span>Telefone: ${
              funcionariosInfo.current[userRef.current].telefone
            }</span></br><span> </span></br><span>Horário: ${
              a.features[0].properties.date.split("T")[1].split(".")[0]
            }</span></div>`;
            popup.hidden = false;
            return;
          }
          if (content) {
            content.innerHTML = `Essa localização possui muitos pontos.<br/>
            Por favor utilize o filtro de distância mínima para filtros pontos que estão muito
            próximos em horários próximos ou utilize o zoom`;
            popup.style.width = "200px";
            popup.hidden = false;
          }
        });
      });
    });
  }, [mapTrajetoria]);
  const mapUltimoPonto = useMap(
    mapRefUltimoPonto as React.RefObject<HTMLDivElement>,
    document.getElementById("popup")
  );
  useEffect(() => {
    if (mapUltimoPonto)
      vectorUltimoPontoLayer.current = addVectorLayer(mapUltimoPonto, "green");
  }, [mapUltimoPonto]);

  const updateWMSLayers = useCallback(
    (newQuantValue?: boolean) => {
      updateWMS({
        layer: wmsTrajetoriaLayer.current as TileLayer<TileWMS>,
        onGetFeaturesNumber: (value) => {
          if (newQuantValue)
            setQuantPontos((last) => ({ quant: value, max: value }));
        },
        options: {
          id_localizacao: +(localizacao as number),
          funcionario: user,
          data: `${data.current}`,
          timeDe: `${timeDe.current}`,
          timeAte: `${timeAte.current}`,
          gap: lineGap,
          simplify_param: +isSimplify,
          limit: newQuantValue ? null : quantPontos.quant,
          min_dist: minDist,
        },
      });

      updateWMS({
        layer: wmsTrajetoriaLineLayer.current as TileLayer<TileWMS>,
        options: {
          id_localizacao: +(localizacao as number),
          funcionario: user,
          data: `${data.current}`,
          timeDe: `${timeDe.current}`,
          timeAte: `${timeAte.current}`,
          gap: lineGap,
          simplify_param: +isSimplify,
          limit: newQuantValue ? null : quantPontos.quant,
          min_dist: minDist,
        },
      });
    },
    [localizacao, minDist, quantPontos, user, lineGap, isSimplify]
  );
  useEffect(() => {
    //setQuantPontos({
    //   max: quantPontos.max,
    //   quant:
    //     Math.trunc(quantPontos.quant / lineGap) + lineGap < quantPontos.max
    //       ? Math.trunc(quantPontos.quant / lineGap) + lineGap
    //      : quantPontos.max,
    // });
    if (wmsTrajetoriaLayer.current && wmsTrajetoriaLineLayer.current)
      updateWMSLayers(true);
  }, [lineGap]);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          flex: 1,
        }}
      >
        {(fullscreen || fullscreenLastPoint) && (
          <>
            <div
              style={{
                position: "fixed",
                top: "4rem",
                left: 10,
                zIndex: 9999999999,
              }}
            >
              <MapMenuButton
                onClick={() => {
                  try {
                    setIsMenuOpen(!isMenuOpen);
                  } catch (e) {
                    console.debug(e);
                  }
                }}
                color="rgba(65,13,91,0.8)"
                msgToolbox={isMenuOpen ? "Fechar filtros" : "Abrir filtros"}
                style={{
                  position: "relative",
                  zIndex: 99999,
                  display: "flex",
                }}
              >
                <CiFilter style={{ flex: 1 }} size={"3rem"} />
              </MapMenuButton>
            </div>
            <AiOutlineFullscreenExit
              onClick={() => {
                setFullscreen(false);
                setFullscreenLastPoint(false);
              }}
              size={40}
              style={{
                position: "fixed",
                color: "red",
                zIndex: 99999999,
                top: 10,
                right: 10,
                cursor: "pointer",
              }}
            />
          </>
        )}
        <div style={{ display: "flex", flexDirection: "row" }}>
          {((fullscreen && isMenuOpen) || !fullscreen) && (
            <div
              style={
                fullscreen
                  ? {
                      position: "fixed",
                      top: 20,
                      zIndex: 999999999,
                      left: "50%",
                      display: "flex",
                      flexDirection: "row",
                      transform: "translate(-50%,0%)",
                      flexWrap: "wrap",

                      flex: 1,

                      width: "80%",
                    }
                  : {
                      marginTop: "-2rem",
                      marginBottom: "1rem",
                    }
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  columnGap: "1rem",
                }}
              >
                <OptionsMenu
                  paperBackground={
                    fullscreen ? "rgba(255,255,255,0.7)" : undefined
                  }
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
                        userRef.current = newUser;
                      },
                      ops: funcionarioOptions,
                    },
                    {
                      type: "selection",
                      value: localizacao,
                      name: "Área:",
                      onChange: (newLocation: string | number) => {
                        setLocalizacao(+newLocation);
                      },
                      ops: localizacaoOptions,
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

                    flex: 5,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "1rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={
                        fullscreen
                          ? {
                              display: "flex",
                              alignItems: "center",
                              boxSizing: "border-box",
                              padding: "1rem",
                              borderRadius: "0.5rem",
                              backgroundColor: "rgba(255,255,255,0.7)",
                            }
                          : { display: "flex", alignItems: "center" }
                      }
                    >
                      <Checkbox
                        checked={showLines}
                        style={{ fontSize: "3rem", marginRight: "0.5rem" }}
                        onClick={() => {
                          if (wmsTrajetoriaLineLayer)
                            wmsTrajetoriaLineLayer.current?.setVisible(
                              !showLines
                            );
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
                    {showLines && (
                      <div
                        style={
                          fullscreen
                            ? {
                                display: "flex",
                                alignItems: "center",

                                padding: "1rem",
                                borderRadius: "0.5rem",
                                backgroundColor: "rgba(255,255,255,0.7)",
                              }
                            : { display: "flex", alignItems: "center" }
                        }
                      >
                        <Checkbox
                          checked={isSimplify}
                          disabled={!showLines}
                          style={{ fontSize: "3rem", marginRight: "0.5rem" }}
                          onClick={() => {
                            setLineGap(1);
                            setIsSimplify(!isSimplify);
                          }}
                        />
                        <label
                          style={{
                            fontSize: "1.3rem",
                            color: "rgb(48, 25, 52)",
                          }}
                          htmlFor="checkbox-visualizacao-individual"
                        >
                          Simplificar rota
                        </label>
                      </div>
                    )}
                    {showLines && isSimplify && (
                      <div
                        style={
                          fullscreen
                            ? {
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "rgba(255,255,255,0.7)",
                                padding: "1rem",
                                borderRadius: "0.5rem",
                              }
                            : {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                maxWidth: "content",
                                flex: 0.5,
                              }
                        }
                      >
                        <label
                          style={{
                            fontSize: "1.3rem",
                            color: "rgb(48, 25, 52)",
                          }}
                        >
                          {!isSimplify
                            ? "Espaçamento entre setas:"
                            : "Nível da simplificação"}
                        </label>
                        <input
                          type="number"
                          defaultValue={1}
                          min={1}
                          disabled={!showLines}
                          value={lineGap}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={(e) => {
                            setLineGap(+e.target.value);
                          }}
                          maxLength={2}
                          style={{
                            marginLeft: "1rem",
                            border: "none",
                            borderBottom: "1px solid black",
                            outline: "none",

                            maxWidth: "3rem",
                            backgroundColor: "transparent",
                          }}
                        />
                      </div>
                    )}
                    <div
                      style={
                        fullscreen
                          ? {
                              display: "flex",
                              alignItems: "center",

                              padding: "1rem",
                              borderRadius: "0.5rem",
                              backgroundColor: "rgba(255,255,255,0.7)",
                              flex: "r",
                            }
                          : { display: "flex", alignItems: "center" }
                      }
                    >
                      <label
                        style={{
                          fontSize: "1.3rem",
                          color: "rgb(48, 25, 52)",
                        }}
                      >
                        Distância mínima (m):
                      </label>
                      <input
                        type="number"
                        defaultValue={1}
                        min={0}
                        value={minDist}
                        onChange={(e) => {
                          setMinDist(+e.target.value);
                        }}
                        maxLength={2}
                        style={{
                          marginLeft: "1rem",
                          border: "none",
                          borderBottom: "1px solid black",
                          outline: "none",

                          maxWidth: "3rem",
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                    {quantPontos.max > 0 && (
                      <div
                        style={
                          fullscreen
                            ? {
                                alignItems: "center",
                                flexDirection: "column",
                                padding: "1rem",
                                borderRadius: "0.5rem",
                                backgroundColor: "rgba(255,255,255,0.7)",
                                flex: 1,
                              }
                            : {}
                        }
                      >
                        <label
                          style={{
                            fontSize: "1.3rem",
                            color: "rgb(48, 25, 52)",
                          }}
                        >
                          Quant. Pontos: {quantPontos.quant}
                        </label>
                        <Slider
                          max={quantPontos.max}
                          onMouseUp={() => updateWMSLayers()}
                          min={1}
                          onChange={(newValue) => {
                            setQuantPontos((lastValue) => {
                              if (newValue <= 1) {
                                return { quant: 1, max: lastValue.max };
                              }
                              if (newValue > lastValue.max) {
                                return {
                                  quant: lastValue.max,
                                  max: lastValue.max,
                                };
                              }
                              return {
                                ...lastValue,
                                quant: newValue,
                              };
                            });
                          }}
                          value={quantPontos.quant}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    flex: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "2rem",
                    flexDirection: "row",

                    display: "flex",
                  }}
                >
                  <Button
                    label="Aplicar filtros"
                    style={
                      fullscreen
                        ? {
                            backgroundColor: "rgba(65,13,91,0.7)",
                          }
                        : {}
                    }
                    onClick={() => {
                      const overlayUltimoPonto = mapUltimoPonto
                        ?.getOverlays()
                        .item(0);
                      if (
                        overlayUltimoPonto !== undefined &&
                        overlayUltimoPonto.getElement() !== undefined
                      ) {
                        (
                          overlayUltimoPonto.getElement() as HTMLElement
                        ).hidden = true;
                      }
                      if (isError) {
                        setIsError(false);
                      }
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

                      const finalDate = new Date(
                        data.current + "T" + timeAte.current
                      );

                      finalDate.setHours(finalDate.getHours() - 3);

                      console.log("datas", data, finalDate);
                      drawWMS({
                        layer: wmsTrajetoriaLayer.current as TileLayer<any>,
                        options: {
                          id_localizacao: +(localizacao as number),
                          funcionario: user,
                          data: `${data.current}`,
                          timeDe: `${timeDe.current}`,
                          timeAte: `${timeAte.current}`,
                          gap: lineGap,
                          simplify_param: +isSimplify,

                          min_dist: minDist,
                        },
                        env: {
                          finalDate: `${finalDate.toISOString()}`,
                        },
                        url: "https://geoserver.idals.com.br/geoserver/idals/wms",
                        layerName: "mapa:all2",
                        onLoading: setIsLoading,
                        onGetFeaturesNumber: (quant) => {
                          if (quant === 0) {
                            toastContext.toastCall(
                              "Não foram encontrados dados para o filtro selecionado"
                            );
                          }
                          setQuantPontos({ max: quant, quant: quant });
                        },
                        onError: () => {
                          setIsError(true);
                        },
                      });
                      fetch(
                        `https://bigdata.idals.com.br/data?funcionario=${user}&area=${localizacao}&de=${data.current}T${timeDe.current}&ate=${data.current}T${timeAte.current}`
                      ).then((response) => {
                        response.json().then((dado) => {
                          console.debug(dado, "dado");
                          const coordinates =
                            dado[dado.length - 1]?.localizacao;
                          const date = dado[dado.length - 1]?.date;

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
                          if (
                            mapUltimoPonto
                              ?.getOverlays()
                              .item(0)
                              .getElement() === undefined
                          ) {
                            mapUltimoPonto
                              ?.getOverlays()
                              .item(0)
                              .setElement(
                                document.getElementById("popup") || undefined
                              );
                          }
                          const overlay = mapUltimoPonto?.getOverlays().item(0);
                          const popup = overlay?.getElement();

                          const content =
                            document.getElementById("popup-content");
                          if (popup && content) {
                            content.innerHTML = `<div><span>Nome: ${
                              userRef.current
                            }</span></br><span> </span></br><span>Telefone: ${
                              funcionariosInfo.current[userRef.current].telefone
                            }</span></br><span> </span></br><span>Horário: ${
                              date.split("T")[1].split(".")[0]
                            }</span></div>`;
                          }
                          console.debug(popup);
                          mapUltimoPonto
                            ?.getView()
                            .animate({ center: coordinates, zoom: 19 });
                          mapTrajetoria
                            ?.getView()
                            .animate({ center: coordinates, zoom: 15 });

                          console.debug(mapUltimoPonto?.getLayers());
                          setTimeout(() => {
                            if (popup) popup.hidden = false;
                            overlay?.setPositioning("top-right");
                            overlay?.setPosition(coordinates);
                          }, 1000);
                        });
                      });
                      if (mapTrajetoria) {
                        drawWMS({
                          layer:
                            wmsTrajetoriaLineLayer.current as TileLayer<any>,
                          options: {
                            funcionario: user,
                            id_localizacao: +(localizacao as number),
                            data: `${data.current}`,
                            timeDe: `${timeDe.current}`,
                            timeAte: `${timeAte.current}`,
                            simplify_param: +isSimplify,
                            gap: lineGap,
                            min_dist: minDist,
                          },
                          url: "https://geoserver.idals.com.br/geoserver/idals/wms",
                          layerName: "idals:linhas",
                        });
                        mapTrajetoria?.updateSize();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
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
                setFullscreenLastPoint(true);
              }}
            />
            <Title
              style={{
                padding: 0,
                margin: "0 0 2rem 0",
                justifyContent: "center",
              }}
              value="Último ponto registrado"
            />
            <div
              style={
                fullscreenLastPoint
                  ? stylesFullscreen
                  : { flex: 1, position: "relative" }
              }
              ref={mapRefUltimoPonto as LegacyRef<HTMLDivElement>}
            >
              <ErroDados
                show={isError}
                style={{ backgroundColor: "rgba(65, 13, 91,0.7)" }}
              />
            </div>
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
              tabIndex={0}
              onKeyUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (
                  (e.key === "ArrowRight" || e.key === "ArrowLeft") &&
                  quantPontos.max > 0
                ) {
                  updateWMSLayers();
                }
              }}
              onKeyDown={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (quantPontos.max === 0) {
                  return;
                }
                if (e.key === "ArrowRight") {
                  setQuantPontos((lastValue) => {
                    if (lastValue.quant + 1 < lastValue.max) {
                      return {
                        max: lastValue.max,
                        quant: lastValue.quant + 1,
                      };
                    }
                    return { quant: lastValue.max, max: lastValue.max };
                  });
                  return;
                }
                if (e.key === "ArrowLeft") {
                  setQuantPontos((lastValue) => {
                    if (lastValue.quant - 1 >= 1) {
                      return {
                        max: lastValue.max,
                        quant: lastValue.quant - 1,
                      };
                    }
                    return { quant: 1, max: lastValue.max };
                  });
                  return;
                }
                return;
              }}
              style={
                fullscreen
                  ? stylesFullscreen
                  : { flex: 1, position: "relative" }
              }
              ref={mapRefTrajetoria as LegacyRef<HTMLDivElement>}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "1rem",
                  width: "200px",
                  borderRadius: "15px",
                }}
                id="popup2"
                hidden={true}
              >
                <div id="popup-content2"></div>
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "1rem",
                  width: "200px",
                  borderRadius: "15px",
                  position: "absolute",
                }}
                hidden={true}
                id="popup"
              >
                <div id="popup-content"></div>
              </div>
              {isLoading && (
                <Spin
                  style={{
                    position: "absolute",
                    width: "2rem",
                    top: 10,
                    left: 10,
                    height: "2rem",
                    zIndex: 99,
                  }}
                />
              )}
              <ErroDados
                show={isError}
                style={{ backgroundColor: "rgba(65, 13, 91,0.7)" }}
              />
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
}
