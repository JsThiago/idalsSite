import { useQuery as query, useMutation, useQueryClient } from "react-query";
import {
  DadosFuncionarios,
  DadosSemRelacao,
  PostFuncionario,
} from "../../types";
import {
  getFuncionarios as _getFuncionario,
  postFuncionario as _postFuncionario,
  deleteFuncionario as _deleteFuncionario,
  getSemRelacao as _getSemRelacao,
} from "./api";

export default function useFuncionarios() {
  const queryClient = useQueryClient();
  const postFunctionarioMutate = useMutation(_postFuncionario);
  const deleteFuncionarioMutation = useMutation(_deleteFuncionario);
  const getSemRelacaoQuery = query("semRelacao", _getSemRelacao);
  const { data, isLoading, isError, refetch } = query(
    "funcionarios",
    _getFuncionario,
    { staleTime: Infinity }
  );

  function postFuncionario(body: PostFuncionario) {
    try {
      const { data, isLoading, isError, mutate } = postFunctionarioMutate;
      mutate(body);
      console.log(isError);
    } catch (e) {
      console.log(e);
    }
  }
  function deleteFuncionario(id: number) {
    const { data, isLoading, isError, mutate } = deleteFuncionarioMutation;
    mutate(id, {
      onSuccess: (deleteRowId) => {
        queryClient.setQueriesData("funcionarios", (old: any) => {
          const result = old.filter((row: DadosFuncionarios) => row.id !== id);
          console.debug(result);
          return result;
        });
      },
    });
  }
  return { data, isLoading, isError, postFuncionario, deleteFuncionario };
}
