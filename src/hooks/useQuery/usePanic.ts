import { useEffect, useState } from "react";
import { useQuery as query, useMutation, useQueryClient } from "react-query";
import {
  DadosFuncionarios,
  DadosSemRelacao,
  DataPanics,
  Panics,
  PostFuncionario,
} from "../../types";
import { getPanics } from "./api";

export default function usePanic({
  onSuccess,
}: {
  onSuccess?: (data: Array<Panics>) => void;
}) {
  const [panicos, setPanicos] = useState<Array<DataPanics>>([]);
  const { mutate, isLoading, isError } = useMutation(getPanics);
  useEffect(() => {
    mutate(
      { areas: [], funcionarios: [] },
      {
        onSuccess: (data: Array<DataPanics>) => {
          const dataTratado: Array<Panics> = data.map((panico) => {
            return {
              cracha: panico.identificador_cracha,
              date: panico.data,
              funcionario: panico.nome_funcionario,
              id: panico.id,
              localizacao: panico.localizacao,
              tratado: panico.tratado,
            };
          });
          onSuccess && onSuccess(dataTratado);
          setPanicos(data);
        },
      }
    );
  }, []);

  return { data: panicos, isLoading, isError };
}
