import {useQuery} from "react-query"
import { DadosSemRelacao } from "../../types";
export default function useSemRelacao(){
    const {data,isLoading,isError} =  useQuery("semRelacao");
    return {data:data as DadosSemRelacao,isLoading,isError}
}