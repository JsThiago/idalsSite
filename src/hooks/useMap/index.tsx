import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/TileWMS";
import TileSourceXYZ from "ol/source/XYZ";
import { register } from "ol/proj/proj4";
import * as ol from "ol";
import proj4 from "proj4";
import Projection from "ol/proj/Projection";
import { useGeographic as geographic } from "ol/proj";
import { layer } from "openlayers";
import { Console } from "console";
export default function useMap(mapRef: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<ol.Map>();
  const [layers, setLayers] = useState<Record<string, TileLayer<any>>>();
  useEffect(() => {
    const olViewports = mapRef.current?.getElementsByClassName("ol-viewport");
    if (olViewports && olViewports.length > 0) return;
    geographic();
    const bounds = [
      -56.55622135530706, -31.21237, -45.501004146498275, -11.681203493427798,
    ];
    proj4.defs(
      "EPSG:4674",
      "+proj=longlat +ellps=GRS80 +towgs84=0,0,0 +no_defs"
    );
    register(proj4);
    new Projection({
      code: "EPSG:4674",
      units: "degrees",
      axisOrientation: "neu",
      global: true,
    });
    const tileSource = new TileSource({
      url: "http://localhost:8080/geoserver/mapa/wms",
      params: {
        FORMAT: "image/png",
        VERSION: "1.3.0",
        TILED: false,
        STYLES: "",
        LAYERS: "mapa:all2",
        exceptions: "application/vnd.ogc.se_inimage",
        tilesOrigin: -56.55622135530706 + "," + -31.21237,
      },
    });
    const mapLayerSource = new TileSourceXYZ({
      url: "http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}",
      maxZoom: 20,
    });
    const tileLayerMap = new TileLayer({ source: mapLayerSource });
    const tileLayer = new TileLayer({ source: tileSource, visible: true });
    let mapGenerate = new ol.Map({
      pixelRatio: 1,
      controls: [],
      target: undefined,
      view: new ol.View({ maxZoom: 20, zoom: 2 }),
      layers: [tileLayerMap, tileLayer],
    });
    mapGenerate.setTarget(mapRef.current as HTMLDivElement);
    mapGenerate.getView().fit(bounds, mapGenerate.getSize() as any);
    setMap(mapGenerate);
    setLayers({ users: tileLayer });
  }, [mapRef]);
  const formatarFiltros = useCallback(
    (options: Record<string, string>): string => {
      let filtroFinal = "";
      for (let key in options) {
        filtroFinal += `${key}:${options[key]};`;
      }
      return filtroFinal.slice(0, -1);
    },
    []
  );
  const aplicarFiltros = useCallback(
    (options: Record<string, string>) => {
      const filtro = formatarFiltros(options);
      const tileSource = new TileSource({
        url: "http://localhost:8080/geoserver/mapa/wms",
        params: {
          FORMAT: "image/png",
          VERSION: "1.3.0",
          viewparams: filtro,
          TILED: false,
          STYLES: "",
          LAYERS: "mapa:all2",
          exceptions: "application/vnd.ogc.se_inimage",
        },
      });
      layers?.users.setSource(tileSource);
      map?.render();
    },
    [formatarFiltros, map, layers?.users]
  );
  return { map, aplicarFiltros };
}
