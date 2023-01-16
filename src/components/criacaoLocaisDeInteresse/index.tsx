import L, {
  Layer,
  LayerGroup,
  Map,
  type LatLngExpression,
  latLng,
} from "leaflet";
import { relative } from "path";
import {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "../button";
import CustomInput from "../input";
import Paper from "../paper";
import Title from "../title";
import { toastContext } from "../toast";
import "./styles.css";
export default function CriacaoLocaisDeInteresse() {
  const limiteSobreposicao = 4;

  const markerLocations = useRef<L.LatLng[]>([]);
  const tipoSugerido = useRef("");
  const [opcoes, setOpcoes] = useState<Array<string>>([]);
  const [opcao, setOpcao] = useState(tipoSugerido.current);
  const mapRefDiv = useRef<HTMLElement>();
  const mapRef = useRef<Map>();
  const [tipo, setTipo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const toastCall = useContext(toastContext).toastCall as Function;
  useEffect(() => {
    setTipo(tipoSugerido.current);
  }, [tipoSugerido.current]);
  const [nome, setNome] = useState<string>("");
  const layerGroupRef = useRef<L.LayerGroup>();
  const initialView: LatLngExpression = [-20, -43];
  function createMap(container: HTMLElement) {
    let m = L.map(container, { preferCanvas: true }).setView(initialView, 11);
    L.tileLayer("http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}", {
      attribution: `
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
      subdomains: "abcd",
      maxZoom: 21,
    }).addTo(m);

    return m;
  }

  const sendData = useCallback(() => {
    console.info(markerLocations.current, tipoSugerido.current);
    const localizacao: Array<[number, number]> = [];
    markerLocations.current.forEach((point) => {
      localizacao.push([point.lng, point.lat]);
    });
    const data = JSON.stringify({
      nome,
      descricao,
      tipo,
      localizacao,
      check: true,
    });
    fetch("http://idals.com.br:3500/localizacao", {
      method: "POST",
      body: data,
      headers: { "content-type": "application/json" },
    }).then((response) => {
      if (response.status !== 201) {
        toastCall("Ocorreu um erro. Por favor tente novamente");
        return;
      }
      setNome("");
      setDescricao("");
      cleanAllMarkers();

      toastCall("Cadastrado com sucesso ");
    });
  }, [descricao, nome, tipo]);
  function markerIcon(i: number, size = 20) {
    let html = `<div className="map-marker" style="width: ${size}px; height: ${size}px; background-color: #90f; border-radius: 50%; color: #fff; font-size: 26px; opacity: 50%;">${i}</div>`;
    return L.divIcon({
      html,
      className: "map-marker",
    });
  }

  function createMarker(loc: L.LatLng, index: number) {
    let icon = markerIcon(index);
    let marker = L.marker(loc, { icon });
    return marker;
  }
  function cleanAllMarkers() {
    if (layerGroupRef.current !== undefined)
      layerGroupRef.current.clearLayers();
    markerLocations.current = [];
    setOpcao("");
    tipoSugerido.current = "";
    setTipo("");
  }
  function createLines() {
    return L.polyline(
      [
        markerLocations.current[markerLocations.current.length - 1],
        markerLocations.current[markerLocations.current.length - 2],
      ],
      { color: "#74f", opacity: 0.9 }
    );
  }

  let markerLayers: LayerGroup;
  let lineLayers: Layer;
  const polygonLayer = useRef<Layer | null>(null);
  function attMarkerLayer(ml: LayerGroup | null, ll: Layer, pontos: L.LatLng) {
    if (ml) {
      ml.remove();
      ml = null;
    }

    let m = createMarker(pontos, markerLocations.current.length);
    m.addTo(layerGroupRef.current as LayerGroup);
    if (markerLocations.current.length > 1) {
      ll = createLines();
      ll.addTo(layerGroupRef.current as LayerGroup);
    }
  }

  function sobrepondo(
    a: LatLngExpression,
    b: LatLngExpression,
    distancia: number
  ): boolean {
    let A = latLng(a);
    console.info(
      "distancias",
      mapRef.current?.getZoom(),
      distancia,
      A.distanceTo(b) / 1000
    );
    let unit = 10000;
    const zoom = mapRef.current?.getZoom() as number;
    if (zoom > 18) unit = 10;
    else if (zoom > 14) unit = 100;
    else if (zoom > 11) unit = 1000;
    else if (zoom >= 9) unit = 10000;
    else unit = 20000;
    let dist = A.distanceTo(b) / unit;
    if (dist <= distancia) {
      b = a;
      return true;
    }
    return false;
  }

  function attOptions() {
    if (
      (tipoSugerido.current === "area" || opcao === "area") &&
      polygonLayer.current === null
    ) {
      polygonLayer.current = L.polygon(markerLocations.current).addTo(
        layerGroupRef.current as LayerGroup
      );
    } else if (polygonLayer) {
      polygonLayer.current?.remove();
      polygonLayer.current = null;
    }
  }

  function attOption(s: string) {
    setOpcao(s);
  }

  const mapAction = useCallback((container: HTMLElement) => {
    if (mapRef.current !== undefined) return;
    mapRef.current = createMap(container);
    layerGroupRef.current = L.layerGroup();
    layerGroupRef.current.addTo(mapRef.current);
    mapRef.current.on("contextmenu", (e) => {
      let p: L.Layer | null = null;
      let l: L.Layer | null = null;
      const lenAux = markerLocations.current.length;
      if (lenAux === 1)
        layerGroupRef.current?.eachLayer((layer: any) => {
          if (lenAux !== markerLocations.current.length) return;
          if (
            layer._latlng?.lat ===
              (markerLocations.current as any)[
                markerLocations.current.length - 1
              ].lat &&
            layer._latlng?.lng ===
              (markerLocations.current as any)[
                markerLocations.current.length - 1
              ].lng
          ) {
            p = layer;
          }

          if (p !== null) {
            p.remove();
            markerLocations.current.pop();
          }
        });
      else
        layerGroupRef.current?.eachLayer((layer: any) => {
          if (lenAux !== markerLocations.current.length) return;

          if (
            layer._latlng?.lat ===
              (markerLocations.current as any)[
                markerLocations.current.length - 1
              ].lat &&
            layer._latlng?.lng ===
              (markerLocations.current as any)[
                markerLocations.current.length - 1
              ].lng &&
            layer._mapToAdd !== null
          ) {
            p = layer;
          }
          if (layer._latlngs !== undefined) {
            if (
              layer._latlngs[0]?.lat ===
                (markerLocations.current as any)[
                  markerLocations.current.length - 1
                ].lat &&
              layer._latlngs[0]?.lng ===
                (markerLocations.current as any)[
                  markerLocations.current.length - 1
                ].lng
            ) {
              l = layer;
            }
          }

          if (l !== null) {
            layerGroupRef?.current?.removeLayer(l);
            console.log(p);
            (p as any).remove();
            p = null;
            markerLocations.current.pop();
          }
        });
      if (markerLocations.current.length === 0) {
        attOption("");
        setOpcoes([""]);
        tipoSugerido.current = "";
        setTipo("");
      } else if (markerLocations.current.length === 1) {
        attOption("ponto");
        setOpcoes(["ponto"]);
        tipoSugerido.current = "ponto";
        setTipo("ponto");
      } else {
        attOption("linha");
        setOpcoes(["linha"]);
        tipoSugerido.current = "linha";
        setTipo("linha");
      }
      if (polygonLayer.current) {
        layerGroupRef.current?.removeLayer(polygonLayer.current as Layer);
        polygonLayer.current = null;
      }
    });
    mapRef.current.on("click", (e) => {
      if (tipoSugerido.current === "area") return;
      let a = markerLocations.current[0] || e.latlng;
      if (markerLocations.current.length + 1 === 1) {
        attOption("ponto");
        tipoSugerido.current = "ponto";
        markerLocations.current.push(e.latlng);
      } else if (
        tipoSugerido.current !== "area" &&
        markerLocations.current.length >= 3 &&
        sobrepondo(
          a,
          e.latlng,
          limiteSobreposicao * (1 / (mapRef.current as Map)?.getZoom())
        )
      ) {
        attOption("area");
        tipoSugerido.current = "area";
        markerLocations.current.push(L.latLng(a.lat, a.lng));
      } else if (markerLocations.current.length + 1 > 1) {
        attOption("linha");
        tipoSugerido.current = "linha";
        markerLocations.current.push(e.latlng);
      } else tipoSugerido.current = "";

      attOptions();
      if (markerLocations.current.length === 1) setOpcoes(["ponto"]);
      else if (
        markerLocations.current.length >= 3 &&
        sobrepondo(
          a,
          e.latlng,
          limiteSobreposicao / (mapRef.current as Map).getZoom()
        )
      )
        setOpcoes(["area", "linha"]);
      else if (markerLocations.current.length > 1) setOpcoes(["linha"]);
      else setOpcoes([]);

      attMarkerLayer(
        markerLayers,
        lineLayers,
        markerLocations.current[markerLocations.current.length - 1]
      );
      console.log(markerLocations.current);
    });

    return {
      destroy: () => {
        (mapRef.current as Map).remove();
      },
    };
  }, []);

  function resizeMap() {
    if (mapRef.current as Map) {
      (mapRef.current as Map).invalidateSize();
    }
  }
  useEffect(() => {
    console.log("useRef");
    if (mapRef.current !== null) {
      mapAction(mapRefDiv.current as HTMLElement);
    }
  }, []);
  return (
    <Paper
      style={{
        display: "flex",
        padding: "1em 0rem 3rem 0rem",
        flexDirection: "column",
        boxShadow: "0.5px 0.5px 1px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          marginBottom: "3rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Title value="Pontos de interesse &nbsp;>" />
        <h2
          style={{
            fontWeight: 400,
            margin: "0.22rem 0 0 0",
          }}
        >
          &nbsp; Cadastrar pontos de interesse
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            marginTop: "4rem",
            flexDirection: "column",
            width: "80vw",

            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", columnGap: "2rem" }}>
              <CustomInput
                placeholder="Nome"
                value={nome}
                onChange={(value) => {
                  setNome(value);
                }}
              />
              <CustomInput
                disabled
                style={{ backgroundColor: "white" }}
                value={tipo}
                placeholder="Tipo"
              />
            </div>
            <CustomInput
              value={descricao}
              onChange={(value) => {
                setDescricao(value);
              }}
              placeholder="Descrição"
            />
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "space-around",
              columnGap: "2rem",
            }}
          >
            <Button
              onClick={() => {
                sendData();
              }}
              label="Salvar"
            />
            <Button label="Limpar" onClick={cleanAllMarkers} />
          </div>
          <div
            style={{
              width: "80vw",
              order: 2,
              display: "flex",
              height: "80vh",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{ flex: 1 }}
              ref={mapRefDiv as LegacyRef<HTMLDivElement>}
              className="map"
            />
          </div>
        </div>
      </div>
    </Paper>
  );
}
