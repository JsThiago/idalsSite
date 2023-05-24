import { Map, VectorTile } from "ol";
import VectorLayer from "ol/layer/Vector";
import {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import Button from "../../components/button";
import OptionsMenu from "../../components/optionsMenu";
import Paper from "../../components/paper";
import SquareColor from "../../components/squareColor";
import Table from "../../components/table";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";
import useMap, { addVectorLayer, drawPoint } from "../../hooks/useMap";
import useData from "../../hooks/useQuery/useData";
import useLocalizacao from "../../hooks/useQuery/useLocalizacao";
import { todayInStringFormat } from "../../utils/dates.utils";
import randomColorGenerator from "../../utils/randomColorGenerator";

export default function VisualizacaoEmGrupo() {
  const [data, setData] = useState(todayInStringFormat());
  const [de, setDe] = useState("07:00");
  const [ate, setAte] = useState("08:00");
  const [fullscreen, setFullscreen] = useState(false);
  const toastCall = useContext(toastContext).toastCall as Function;
  const [funcionario, setFuncionario] = useState(-1);
  const lastArea = useRef<undefined | number>();
  const [funcionarioOptions, setFuncionarioOptions] = useState<
    Array<{ value: string | number; label: string }>
  >([]);
  const {
    data: localizacoes,
    isError,
    isLoading,
  } = useLocalizacao("tipo=area");
  useEffect(() => {
    filterLayer(funcionario);
  }, [funcionario]);
  useEffect(() => {
    const areaOptionsAux: typeof areaOptions = [];
    localizacoes?.forEach((areaData) => {
      console.debug("areas", area);
      if (area === null) return;
      if (!(areaData.id in locationsCoordinates.current)) {
        locationsCoordinates.current[areaData.id] = areaData.localizacao;
      }
      areaOptionsAux.push({ value: areaData?.id, label: areaData?.nome });
    });
    console.debug(areaOptionsAux);
    setAreaOptions(areaOptionsAux);
    setArea(areaOptionsAux[0]?.value as number);
  }, [localizacoes]);
  const [rows, setRows] = useState<Array<any>>([]);
  const mapRefUltimoPonto = useRef<HTMLDivElement>(null);
  const locationsCoordinates = useRef<Record<string, any>>({});
  const oldColorsLayers = useRef<Array<string>>([]);
  const [funcionarios, setFuncionarios] = useState<
    Array<[string, string, any, string]>
  >([]);
  const layers = useRef<Array<VectorLayer<any>>>([]);
  const [areaOptions, setAreaOptions] = useState<
    Array<{ label: string; value: string | number }>
  >([]);
  const [area, setArea] = useState<number | string>();
  const {
    data: dataStatus,
    isError: isErrorDataStatus,
    isLoading: isLoadingDataStatus,
  } = useData(useMemo(() => [area as number], [area]));
  const mapUltimoPonto = useRef<Map>();
  mapUltimoPonto.current = useMap(
    mapRefUltimoPonto as React.RefObject<HTMLDivElement>
  );
  const handlerFilterApply = useCallback(() => {
    toastCall("Por favor aguarde", 1000);
    removeAllLayers();
    lastArea.current = area as number;

    if (dataStatus.length === 0) {
      setTimeout(() => {
        if (area)
          mapUltimoPonto.current?.getView().animate({
            center: locationsCoordinates.current[area][0][0],
            zoom: 19,
          });
        toastCall("Não existem dados.");
      }, 1000);
      return;
    }

    const funcionariosAux: typeof funcionarios = [];
    const funcionarioOptionsAux: typeof funcionarioOptions = [];
    const colors: Record<string, any> = {};
    dataStatus.forEach((data) => {
      const newColor = randomColorGenerator(colors);
      colors[newColor] = 1;

      const coordinates = JSON.parse(data.localizacao).coordinates;
      funcionariosAux.push([
        data.nome_funcionario,
        "#" + newColor,
        coordinates,
        data.date,
      ]);
      funcionarioOptionsAux.push({
        label: data.nome_funcionario,
        value: data.id,
      });
      oldColorsLayers.current.push("#" + newColor);
      const layer = addVectorLayer(
        mapUltimoPonto.current as Map,
        "#" + newColor,
        10,
        data.id
      );
      layers.current.push(layer);
      if (
        (funcionario !== -1 && data.id === funcionario) ||
        funcionario === -1
      ) {
        drawPoint(coordinates, layer);
      }
    });

    setFuncionarioOptions(funcionarioOptionsAux);
    setFuncionarios(funcionariosAux);

    mapUltimoPonto.current?.getView().animate({
      center: funcionariosAux[0][2],
      zoom: 19,
    });
  }, [setFuncionarios, setFuncionarioOptions, funcionario, dataStatus]);
  const removeAllLayers = useCallback(() => {
    layers.current.forEach((layer) => {
      mapUltimoPonto.current?.removeLayer(layer);
    });

    layers.current = [];
    oldColorsLayers.current = [];
  }, [mapUltimoPonto, layers]);
  const updateColorsLayers = useCallback(() => {
    if (!oldColorsLayers.current) return;
    oldColorsLayers?.current.forEach((value, index) => {
      if (value !== funcionarios[index][1]) {
        mapUltimoPonto.current?.removeLayer(layers.current[index]);
        const newLayer = addVectorLayer(
          mapUltimoPonto.current as Map,
          funcionarios[index][1]
        );
        drawPoint(funcionarios[index][2], newLayer);
        oldColorsLayers.current[index] = funcionarios[index][1];
      }
    });
  }, [funcionarios]);
  const generateRows = useCallback(() => {
    const rowsAux: typeof rows = [];

    funcionarios.forEach((funcionario, index) => {
      rowsAux.push([
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SquareColor
            color={funcionario[1]}
            onChange={(color) => {
              const funcionariosCopy = [...funcionarios];
              funcionariosCopy[index][1] = color;
              setFuncionarios(funcionariosCopy);
            }}
            style={{
              borderRadius: "4px",
              width: "1.5rem",
              height: "1.5rem",
            }}
          />
        </div>,
        funcionario[0],
        new Date(funcionario[3])?.toTimeString()?.split(" ")[0],
      ]);
    });
    console.info("setando rows", rowsAux);
    setRows(rowsAux);
  }, [funcionarios]);
  useEffect(() => {
    console.debug(dataStatus);
    if (lastArea.current === undefined) {
      return;
    }

    handlerFilterApply();
  }, [dataStatus]);
  useEffect(() => {
    setFuncionarios([]);
    setFuncionario(-1);
  }, [area]);
  useEffect(() => {
    if (funcionarios.length === 0) return;
    generateRows();
    updateColorsLayers();
  }, [funcionarios, generateRows, updateColorsLayers]);
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
  const filterLayer = useCallback(
    (func: number) => {
      if (func === -1) {
        layers.current.forEach((layer) => {
          layer.setVisible(true);
        });
        return;
      }
      layers.current.forEach((layer) => {
        const id = layer.get("id");
        if (id && id !== func) {
          layer.setVisible(false);
        } else {
          layer.setVisible(true);
        }
      });
    },
    [layers]
  );
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
            boxSizing: "border-box",
            padding: 0,
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
          options={[
            {
              type: "selection",
              value: funcionario,
              onChange: (newFuncionario) => {
                setFuncionario(+newFuncionario);
              },
              name: "Funcionário:",
              ops: [
                {
                  label: "Todos os presentes",
                  value: -1,
                },
                ...funcionarioOptions,
              ],
            },
            {
              type: "selection",
              value: area,
              onChange: (value) => {
                console.log(areaOptions);
                setArea(value.toString());
              },
              name: "Área:",
              ops: areaOptions,
            },
            {
              type: "date",
              onChange: (value) => {
                setData(value);
              },
              value: data,
              name: "Data:",
            },
            {
              type: "time",
              onChange: (value) => {
                setDe(value);
              },
              value: de,
              name: "Horário (de):",
            },
            {
              type: "time",
              onChange: (value) => {
                setAte(value);
              },
              value: ate,
              name: "Horário (até):",
            },
          ]}
        />
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handlerFilterApply}
            label="Aplicar filtros"
            style={{ alignSelf: "flex-end", marginTop: "1rem" }}
          />
        </div>
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
            padding: "0 2rem 2rem 2rem",
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
              top: 20,
              right: 10,
              zIndex: 99,
              cursor: "pointer",
              color: "rgb(65, 13, 91)",
            }}
            onClick={() => {
              setFullscreen(true);
            }}
          />
          <Title value="Último ponto registrado" />
          <div
            style={
              fullscreen ? stylesFullscreen : { flex: 1, position: "relative" }
            }
            ref={mapRefUltimoPonto as LegacyRef<HTMLDivElement>}
          />
        </Paper>
        <Paper style={{ height: "fit-content" }}>
          <Table
            rows={rows}
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
                      disabled={true}
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
              { name: "Horário", size: 1 },
            ]}
          />
        </Paper>
      </div>
    </div>
  );
}
