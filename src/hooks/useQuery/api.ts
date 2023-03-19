import axios from "axios"
import { async } from "q";
import { DadosFuncionarios, PostFuncionario } from "../../types";
const api = axios.create({
        baseURL:process.env.REACT_APP_API_BASE_URL
    })


const geoServer = axios.create({
    baseURL:process.env.REACT_APP_GEOSERVER_BASE_URL
})

export async function getFuncionarios(){
    const data = await api.get("funcionario");
    return data.data as Array<DadosFuncionarios>;
}

export async function postFuncionario(body:PostFuncionario) {
    console.log("onPost")
    await api.post("funcionario",body)
    return
}


export async function deleteFuncionario(id:number){

    await api.delete("funcionario/" + id);
    
}


export async function getSemRelacao(){
    const result = await api.get('semRelacoes');
    return result.data;
}

export async function getLocalizacao(){
    const result = await api.get('localizacao');
    return result.data
}


export async function getFeatures(query?:string){
    console.debug(`idals/ows?SERVICE=WFS&VERSION=1.1.1&REQUEST=GetFeature&outputFormat=application/json&typeName=mapa:all2&viewparams=${query}`);
    const result = await geoServer.get(`idals/ows?SERVICE=WFS&VERSION=1.1.1&REQUEST=GetFeature&outputFormat=application/json&typeName=mapa:all2&viewparams=${query}`)
    return result.data
}


