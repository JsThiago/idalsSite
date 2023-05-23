import { useEffect, useState } from "react";
import { useQuery as query, useMutation, useQueryClient } from "react-query";
import { BodyPanics, DataPanics, Panics, PostFuncionario } from "../../types";
import { getPanics, updatePanic as _updatePanic } from "./api";

export default function usePanic({
  onSuccess,
  body,
  query,
  onSuccessUpdate,
}: {
  onSuccess?: (data: Array<Panics>) => void;
  body?: BodyPanics;
  query?: string;
  onSuccessUpdate?: (data: DataPanics) => void;
}) {
  const [panicos, setPanicos] = useState<Array<DataPanics>>([]);
  const {
    mutate: mutateUpdate,
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
  } = useMutation(
    ({ body, id }: { body: Partial<DataPanics>; id: string | number }) =>
      _updatePanic(id, body)
  );
  const { mutate, isLoading, isError } = useMutation(
    ({ body, query }: { body: BodyPanics; query: string }) =>
      getPanics(body, query)
  );
  function updatePanic(id: string | number, body: Partial<DataPanics>) {
    mutateUpdate(
      { body, id },
      {
        onSuccess: (data) => {
          onSuccessUpdate?.(data);
        },
      }
    );
    return { isLoading: isLoadingUpdate, isError: isErrorUpdate };
  }
  useEffect(() => {
    mutate(
      { body: body || { areas: [], funcionarios: [] }, query: query || "" },
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
          onSuccess?.(dataTratado);
          setPanicos(data);
        },
      }
    );
  }, []);

  return { data: panicos, isLoading, isError, updatePanic };
}
