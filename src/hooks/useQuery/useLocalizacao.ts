import { useMutation, useQuery, useQueryClient } from "react-query";
import { BodyLocalizacao } from "../../types";
import {
  getLocalizacao as _getLocalizacao,
  postLocalizacao as _postLocalizacao,
} from "./api";
export default function useLocalizacao(query?: string) {
  const {
    mutate,
    isLoading: isLoadingCreate,
    isError: isErrorCreate,
  } = useMutation(_postLocalizacao);
  function createLocalizacao(
    body: BodyLocalizacao,
    onSuccess?: () => void,
    onError?: () => void,
    onSettled?: () => void
  ) {
    mutate(body, {
      onSuccess,
      onError,
      onSettled,
    });
    return { isLoadingCreate, isErrorCreate };
  }
  const { data, isLoading, isError } = useQuery("localizacao", async () => {
    return await _getLocalizacao(query);
  });
  return { data, isLoading, isError, createLocalizacao };
}
