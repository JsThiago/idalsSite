import axios from "axios"
import { DadosFuncionarios, PostFuncionario } from "../../types";
const api = axios.create({
        baseURL:process.env.REACT_APP_API_BASE_URL
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