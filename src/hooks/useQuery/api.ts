import axios from "axios";
import { async } from "q";
import {
  BodyBigData,
  BodyDataStatus,
  BodyPanics,
  DadosFuncionarios,
  DataBigDataStatus,
  DataDataStatus,
  DataDataStatusTratada,
  DataPanics,
  LocationData,
  PostFuncionario,
} from "../../types";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const geoServer = axios.create({
  baseURL: process.env.REACT_APP_GEOSERVER_BASE_URL,
});

const bigData = axios.create({
  baseURL: process.env.REACT_APP_BIGDATA_BASE_URL,
});

export async function getFuncionarios() {
  const data = await api.get("funcionario");
  return data.data as Array<DadosFuncionarios>;
}

export async function postFuncionario(body: PostFuncionario) {
  console.log("onPost");
  await api.post("funcionario", body);
  return;
}

export async function deleteFuncionario(id: number) {
  await api.delete("funcionario/" + id);
}

export async function getSemRelacao() {
  const result = await api.get("semRelacoes");
  return result.data;
}

export async function getLocalizacao(
  query?: string
): Promise<Array<LocationData>> {
  const result = await api.get("localizacao?" + query);
  console.debug(result, "result");
  return result.data as Array<LocationData>;
}

export async function getFeatures(query?: string) {
  const result = await geoServer.get(
    `idals/ows?SERVICE=WFS&VERSION=1.1.1&REQUEST=GetFeature&outputFormat=application/json&typeName=mapa:all2&viewparams=${query}`
  );
  return result.data;
}

export async function getDashboard(
  body: BodyBigData,
  query: string = ""
): Promise<DataBigDataStatus> {
  try {
    const result = await bigData.post(`data/dashboard?${query}`, body);
    console.warn(result);
    return result.data;
  } catch {
    return { total: [{ count: "0" }], areas: {} };
  }
}

export async function getPanics(body: BodyPanics) {
  const result = await bigData.post<Array<DataPanics>>("panico", body);
  return result.data;
}

export async function getDataStatus(
  body: BodyDataStatus,
  query: string = ""
): Promise<Array<DataDataStatusTratada>> {
  const result = await bigData.post<Array<DataDataStatus>>(
    `data/status?${query}`,
    body
  );
  return result.data.map((data) => {
    const areasFunc: Record<string, number> = {};
    data.areas.forEach((area) => {
      areasFunc[area.f2] = area.f1;
    });
    return { ...data, areas: areasFunc };
  });
}
