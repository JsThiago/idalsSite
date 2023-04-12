import { useQuery, useQueryClient } from "react-query";
import { getLocalizacao as _getLocalizacao } from "./api";
export default function useLocalizacao(query?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery("localizacao", async () => {
    return await _getLocalizacao(query);
  });
  return { data, isLoading, isError };
}
