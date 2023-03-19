import {useQuery, useQueryClient} from "react-query"
import {getLocalizacao as _getLocalizacao} from "./api"
export default function useLocalizacao(){
    const queryClient = useQueryClient();
    const {data,isLoading,isError} = useQuery("localizacao",_getLocalizacao);
    return {data,isLoading,isError}
    

    
}