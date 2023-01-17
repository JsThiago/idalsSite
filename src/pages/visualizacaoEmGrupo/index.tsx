import { Map, VectorTile } from "ol";
import VectorLayer from "ol/layer/Vector";
import {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import OptionsMenu from "../../components/optionsMenu";
import Paper from "../../components/paper";
import RadioGroup from "../../components/radioGroup";
import SquareColor from "../../components/squareColor";
import Table from "../../components/table";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";
import useMap, { addVectorLayer, drawPoint } from "../../hooks/useMap";
interface DadosArea {
  id: number;
  nome: string;
}
function randomColorGenerator(colors?: Record<string, string>) {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);

  while (randomColor.length < 6) {
    randomColor = Math.floor(Math.random() * 16777215).toString(16);
  }
  if (!colors) return randomColor;
  while (randomColor in colors && randomColor.length < 6) {
    randomColor = Math.floor(Math.random() * 16777215).toString(16);
  }
  return randomColor;
}

export default function VisualizacaoEmGrupo() {
  const [data, setData] = useState("");
  const [de, setDe] = useState("07:00");
  const [ate, setAte] = useState("08:00");
  const toastCall = useContext(toastContext).toastCall as Function;
  useEffect(() => {
    fetch("https://api.idals.com.br/localizacao?tipo=area").then((response) => {
      const areaOptionsAux: typeof areaOptions = [];
      response.json().then((areas: Array<DadosArea>) => {
        areas.forEach((areaValue) => {
          areaOptionsAux.push({ value: areaValue.id, label: areaValue.nome });
        });
        setAreaOptions(areaOptionsAux);
        setArea(areaOptionsAux[0]?.value as number);
      });
    });
  }, []);
  const [rows, setRows] = useState<Array<any>>([]);
  const mapRefUltimoPonto = useRef<HTMLDivElement>(null);
  const oldColorsLayers = useRef<Array<string>>([]);
  const [funcionarios, setFuncionarios] = useState<
    Array<[string, string, any, string]>
  >([]);
  const layers = useRef<Array<VectorLayer<any>>>([]);
  const [areaOptions, setAreaOptions] = useState<
    Array<{ label: string; value: string | number }>
  >([]);
  const [area, setArea] = useState<number | string>();

  const mapUltimoPonto = useRef<Map>();
  mapUltimoPonto.current = useMap(
    mapRefUltimoPonto as React.RefObject<HTMLDivElement>
  );

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
    console.info("gerando linhas:", funcionarios);
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
        "(xx) x xxxx-xxxx",
        new Date(funcionario[3])?.toTimeString()?.split(" ")[0],
      ]);
    });
    console.info("setando rows", rowsAux);
    setRows(rowsAux);
  }, [funcionarios]);
  useEffect(() => {
    generateRows();
    updateColorsLayers();
  }, [funcionarios, generateRows, updateColorsLayers]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <Button
          onClick={() => {
            toastCall("Por favor aguarde", 1000);
            removeAllLayers();
            fetch("https://bigdata.idals.com.br/data/status?area=" + area)
              .then((response) => {
                if (response.status !== 200) {
                  setFuncionarios([]);
                  setTimeout(() => {
                    toastCall("Não existem dados.");
                  }, 1000);

                  removeAllLayers();
                }
                response.json().then((data: Array<any>) => {
                  const funcionariosAux: typeof funcionarios = [];

                  const colors: Record<string, any> = {};
                  data.forEach((value: any) => {
                    const newColor = randomColorGenerator(colors);
                    colors[newColor] = 1;
                    console.log(newColor);

                    funcionariosAux.push([
                      value.nome_funcionario,
                      "#" + newColor,
                      value.localizacao,
                      value.date,
                    ]);
                    oldColorsLayers.current.push("#" + newColor);
                    const layer = addVectorLayer(
                      mapUltimoPonto.current as Map,
                      "#" + newColor
                    );
                    layers.current.push(layer);
                    drawPoint(value.localizacao, layer);
                  });
                  mapUltimoPonto.current?.getView().animate({
                    center: funcionariosAux[0][2],
                    zoom: 19,
                  });

                  setFuncionarios(funcionariosAux);
                });
              })
              .catch(() => {
                setFuncionarios([]);
                setTimeout(() => {
                  toastCall("Ocorreu um erro. Por favor tente mais tarde");
                }, 1000);
                removeAllLayers();
              });
          }}
          label="Aplicar filtros"
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
            padding: "0 2rem 2rem 2rem",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Title value="Último ponto registrado" />
          <div
            style={{ flex: 1, position: "relative" }}
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
              { name: "Telefone", size: 1 },
              { name: "Horário", size: 1 },
            ]}
          />
        </Paper>
      </div>
    </div>
  );
}
