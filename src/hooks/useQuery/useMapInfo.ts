import {useQuery} from "react-query"
import {getFeatures} from "./api"
export default function useMapInfo(query?:string,callback?:(result:any)=>void){
    try{
    const {data,isLoading,isError,} = useQuery("mapInfo",async ()=>{
        console.debug("aqui")
        callback && callback(data);
        return await getFeatures(query)
    });
    return {data,isLoading,isError}
}catch(e){
    console.debug(e);
}
}