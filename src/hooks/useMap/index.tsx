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
import { Circle, Fill } from "ol/style";
import Projection from "ol/proj/Projection";
import {
  fromLonLat,
  useGeographic as geographic,
  useGeographic,
} from "ol/proj";
import { control, coordinate, layer, pointer } from "openlayers";
import { Console } from "console";
import { Geometry, Point } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
export default function useMap(mapRef: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<ol.Map>();
  const [layers, setLayers] = useState<Record<string, TileLayer<any>>>();

  useGeographic();
  useEffect(() => {
    const olViewports = mapRef.current?.getElementsByClassName("ol-viewport");
    if (olViewports && olViewports.length > 0) return;
    geographic();
    const bounds = [-43.8119354248047, -43.7190132141113, 0, 0];
    proj4.defs(
      "EPSG:4674",
      "+proj=longlat +ellps=GRS80 +towgs84=0,0,0 +no_defs"
    );
    register(proj4);

    const mapLayerSource = new TileSourceXYZ({
      url: "http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}",
      maxZoom: 20,
      minZoom: 4,
    });
    const tileLayerMap = new TileLayer({ source: mapLayerSource });

    const view = new ol.View({
      maxZoom: 20,
      zoom: 4,
      projection: "EPSG:4674",
      minZoom: 4,
    });
    let mapGenerate = new ol.Map({
      controls: [],
      target: undefined,
      view: view,
      layers: [tileLayerMap],
    });

    mapGenerate.setTarget(mapRef.current as HTMLDivElement);
    mapGenerate.getView().fit(bounds, mapGenerate.getSize() as any);

    setMap(mapGenerate);
  }, [mapRef]);

  return map;
}
const formatarFiltros = (options: Record<string, string | number>): string => {
  let filtroFinal = "";
  for (let key in options) {
    filtroFinal += `${key}:${options[key]};`;
  }
  return filtroFinal.slice(0, -1);
};
export function drawWMS(
  layer: TileLayer<TileSource>,
  options: Record<string, string | number>,
  env: Record<string, string> = {},
  url: string,
  layerName: string
) {
  const filtro = formatarFiltros(options);
  const tileSource = new TileSource({
    url: url,
    params: {
      FORMAT: "image/png",
      VERSION: "1.1.1",
      viewparams: filtro,
      TILED: false,
      env: formatarFiltros(env),
      STYLES: "",
      LAYERS: layerName,
      exceptions: "application/vnd.ogc.se_inimage",
    },
  });
  layer.setSource(tileSource);
}
export const addWMSLayer = (map: ol.Map) => {
  const tileSource = new TileSource({
    params: {
      FORMAT: "image/png",
      VERSION: "1.1.1",
      TILED: false,
      STYLES: "",
      exceptions: "application/vnd.ogc.se_inimage",
      tilesOrigin: -56.55622135530706 + "," + -31.21237,
    },
  });
  const tileLayer = new TileLayer({
    source: tileSource,
    visible: true,
    useInterimTilesOnError: true,
  });
  map.addLayer(tileLayer);
  return tileLayer;
};
export const addVectorLayer = (
  map: ol.Map,
  color: string = "blue",
  size = 10
) => {
  const circle = new Circle({ radius: size, fill: new Fill({ color: color }) });
  const style = new Style({ image: circle });
  const vectorLayer = new VectorLayer({ style });
  map.addLayer(vectorLayer);

  return vectorLayer;
};

export const drawPoint = (e: Coordinate, layer: VectorLayer<any>) => {
  const point = new ol.Feature({ geometry: new Point(e) });
  const source = new VectorSource({ features: [point] });
  layer.setSource(source);
  return point;
};
