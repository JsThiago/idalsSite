import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../../components/card";
import ElipsePerson from "../../components/card/icons/people";
import Circle from "../../components/circle";
import DatePicker from "../../components/datePicker";
import MultiSelect from "../../components/multiSelect";
import Paper from "../../components/paper";
import SubTitle from "../../components/subTitle";
import Table from "../../components/table";
import Title from "../../components/title";
import calcularPercentBateria from "../../utils/calcularPercentBateria";
import randomColorGeneratorRGBA from "../../utils/randomColorGeneratorRGBA";
import PanicNotification from "../../components/panicNotification";
import PanicModalAlert from "../../components/panicModalAlert";
import useDashboard from "../../hooks/useQuery/useDashboard";
import useDataStatus from "../../hooks/useQuery/useData";
export default function Dashboard() {
  const [dataInicio, setDataInicio] = useState("2010-01-01");
  const replaceNullAreaName = useCallback((areaName: string) => {
    if (areaName === "null") {
      return "Fora";
    }
    return areaName;
  }, []);

  const isTodosFromAreas = useCallback((area: string | number) => {
    if (area === "todos") {
      return true;
    }
    return false;
  }, []);
  const [panicVisibility, setPanicVisibility] = useState(false);
  const [baterias, setBaterias] = useState<{
    vermelho: number;
    amarelo: number;
    verde: number;
  }>({
    amarelo: 0,
    verde: 0,
    vermelho: 0,
  });
  const [dataCards, setDataCards] = useState<
    Record<
      string,
      { nome: string; quant: number; color: string; id: string | number }
    >
  >({});
  const [areaSelected, setAreaSelected] = useState<string>("Todas");
  const [rows, setRows] = useState<Array<any>>([]);

  const [areasOptions, setAreasOptions] = useState<
    Record<string | number, string | number>
  >({});
  const [areasSelectedFilter, setAreasSelectedFilter] = useState<
    Record<string | number, string | number>
  >({ todos: "Todos" });

  const filterTodosFromArea = useCallback(
    (areasSelectedFilter: Record<string | number, string | number>) =>
      Object.keys(areasSelectedFilter).filter((area) => {
        if (isTodosFromAreas(area)) {
          return false;
        }
        return true;
      }),
    []
  );
  const {
    data: ultimaPosicaoFuncPorArea,
    isError,
    isLoading,
  } = useDataStatus(
    useMemo(
      () => filterTodosFromArea(areasSelectedFilter),
      [filterTodosFromArea, areasSelectedFilter]
    ),
    ""
  );
  const {
    data: areasMetadados,
    isError: isErrorMetadados,
    isLoading: isLoadingMetadados,
  } = useDashboard(
    useMemo(
      () => filterTodosFromArea(areasSelectedFilter),
      [filterTodosFromArea, areasSelectedFilter]
    ),
    ""
  );
  useEffect(() => {
    if (Object.keys(areasOptions).length > 0) {
      return;
    }
    const areasOptionsAux: typeof areasOptions = {};
    Object.entries(areasMetadados?.areas)?.forEach(([key, value]) => {
      areasOptionsAux[value.id] = key;
    });
    setAreasOptions(areasOptionsAux);
  }, [areasMetadados]);

  function filterArea(areaName: string | number) {
    console.log(areaName);
    if (+areaName in areasSelectedFilter || "todos" in areasSelectedFilter) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    const dataCardsAux: typeof dataCards = {};
    const colorsUsed: Record<string, any> = {};

    Object.entries(areasMetadados.areas).map(([key, value]) => {
      const newColor = randomColorGeneratorRGBA(colorsUsed);
      const newColorRGB =
        dataCards[key]?.color || `${newColor.r}, ${newColor.g}, ${newColor.b}`;
      dataCardsAux[key] = {
        nome: replaceNullAreaName(key as string) as string,
        quant: +areasMetadados?.areas[key]?.count,
        color: newColorRGB,
        id: value.id,
      };

      colorsUsed[newColorRGB] = 1;
    });

    setDataCards(dataCardsAux);
  }, [areasMetadados]);

  useEffect(() => {
    const newRows: typeof rows = [];
    const newBaterias: typeof baterias = {
      amarelo: 0,
      verde: 0,
      vermelho: 0,
    };
    ultimaPosicaoFuncPorArea.forEach((func) => {
      const date = new Date(func.date);
      if (areaSelected !== "Todas" && !(areaSelected in func.areas)) {
        return;
      }
      let color: string | undefined = "";
      if (calcularPercentBateria(func.bateria) > 12) {
        newBaterias.verde += 1;
        color = undefined;
      } else if (calcularPercentBateria(func.bateria) < 5) {
        newBaterias.vermelho += 1;
        color = "#BC0202";
      } else {
        newBaterias.amarelo += 1;
        color = "#ECD03B";
      }
      newRows.push([
        <Circle color={color} style={{ minWidth: "2rem", height: "2rem" }} />,
        func.nome_funcionario,
        `${date.toLocaleDateString("pt-br")} ${date.toLocaleTimeString(
          "pt-br"
        )}`,
      ]);
    });

    setBaterias(newBaterias);
    setRows(newRows);
  }, [ultimaPosicaoFuncPorArea, areaSelected]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "3rem",
      }}
    >
      <PanicModalAlert
        onClickOutside={() => {
          setPanicVisibility(false);
        }}
        visibility={panicVisibility}
      />
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
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title value="Pessoas na empresa" />
          <div style={{ marginRight: "2rem" }}>
            <PanicNotification
              onClick={(panics) => {
                setPanicVisibility(true);
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ flex: 1 }}>
            <SubTitle
              style={{
                color: "#A6A6A6",
                fontSize: "1.2rem",
                marginLeft: "3rem",
                marginBottom: "2rem",
                marginTop: 0,
              }}
              value="Filtros"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                marginLeft: "4rem",
                rowGap: "2rem",
              }}
            >
              <div>
                <DatePicker
                  onBlur={(value) => {
                    setDataInicio(value);
                  }}
                  defaultValue={dataInicio}
                  label="A partir de"
                />
              </div>
              {/*
                <div><DatePicker onChange={(value)=>{
                setDataFim(value)
              }} defaultValue={dataFim} label="Até"/></div>
              */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                <label
                  style={{ marginRight: "1rem" }}
                  htmlFor="areas-multselect"
                >
                  Áreas
                </label>
                <MultiSelect
                  selected={areasSelectedFilter}
                  onRemoveAll={() => {
                    setAreasSelectedFilter({});
                  }}
                  key="areas-multselect"
                  onRemove={(value) => {
                    const areasSelectedFilterCopy = { ...areasSelectedFilter };
                    delete areasSelectedFilterCopy[value[0]];
                    setAreasSelectedFilter(areasSelectedFilterCopy);
                  }}
                  onSelectAll={() => {
                    setAreasSelectedFilter({ todos: "Todos" });
                  }}
                  onSelect={(newValue) => {
                    setAreaSelected("Todas");
                    if ("todos" in areasSelectedFilter) {
                      setAreasSelectedFilter({ [newValue[0]]: newValue[1] });
                      return;
                    }
                    setAreasSelectedFilter({
                      ...areasSelectedFilter,
                      [newValue[0]]: newValue[1],
                    });
                  }}
                  options={areasOptions}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}
          >
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
                number={areasMetadados ? +areasMetadados?.total[0]?.count : 0}
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
            {Object.keys(dataCards).length > 0 && (
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
                {Object.values(dataCards)
                  .sort((a, b) => +(a.quant < b.quant))
                  .map((data, index) => {
                    console.debug(data, areasSelectedFilter);

                    if (filterArea(data.id))
                      return (
                        <Card
                          onClick={(e) => {
                            setAreaSelected(e);
                          }}
                          id={`${data.nome}-card-${data.quant}-${data.color}`}
                          number={data.quant}
                          title={data.nome}
                          color={data.color}
                          titleColor={data.color}
                        />
                      );
                  })}
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
                baterias.verde || 0
              }  pessoas com bateria acima de 80%`}</span>
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
                {`${baterias.amarelo || 0} pessoas com bateria
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
                {`${
                  baterias.vermelho || 0
                } pessoas com bateria em estado crítico`}
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
                { name: "Última posição", size: 0.5 },
              ]}
              rows={rows}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
}
